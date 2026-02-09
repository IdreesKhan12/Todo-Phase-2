# API Contracts: Authentication & Secure API Access

**Feature**: 001-auth-jwt-secure
**Date**: 2026-02-06
**Related**: [Plan](../plan.md), [Data Model](../data-model.md)

## Authentication Flow Contract

### Frontend Authentication with Better Auth

#### Login Flow
1. User visits login page
2. User enters credentials via Better Auth UI
3. Better Auth issues JWT token upon successful authentication
4. Frontend stores JWT token (in local storage or secure cookie)
5. Frontend begins attaching token to all subsequent API requests

#### Token Attachment Format
- **Header**: `Authorization: Bearer <jwt_token>`
- **Where**: Included in all requests to protected API endpoints
- **Automatic**: API client automatically attaches token to requests

### Backend JWT Verification Contract

#### Token Verification Requirements
1. All protected endpoints require valid JWT token
2. Token must have valid signature verified with BETTER_AUTH_SECRET
3. Token must not be expired (exp claim validation)
4. User identity must be extracted from token for authorization

#### Error Response Contract
- **401 Unauthorized**: Invalid, expired, or missing JWT token
- **403 Forbidden**: Valid token but unauthorized access to specific resource
- **Consistent Format**: All auth-related errors follow standard error response structure

## Protected API Endpoints (Require JWT Authentication)

### GET /api/{user_id}/tasks
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token
- **Response**:
  - `200 OK`: List of tasks belonging to authenticated user
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to access different user's tasks
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`

### POST /api/{user_id}/tasks
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token
- **Response**:
  - `201 Created`: New task created successfully
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to create tasks for different user
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`
- **Body**: Task creation data

### GET /api/{user_id}/tasks/{id}
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token; task must belong to user
- **Response**:
  - `200 OK`: Specific task data
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to access different user's task
  - `404 Not Found`: Task doesn't exist or doesn't belong to user
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`

### PUT /api/{user_id}/tasks/{id}
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token; task must belong to user
- **Response**:
  - `200 OK`: Task updated successfully
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to update different user's task
  - `404 Not Found`: Task doesn't exist or doesn't belong to user
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`
- **Body**: Task update data

### DELETE /api/{user_id}/tasks/{id}
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token; task must belong to user
- **Response**:
  - `200 OK`: Task deleted successfully
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to delete different user's task
  - `404 Not Found`: Task doesn't exist or doesn't belong to user
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`

### PATCH /api/{user_id}/tasks/{id}/complete
- **Requires Authentication**: Bearer token in Authorization header
- **User Validation**: `user_id` in URL must match user ID in JWT token; task must belong to user
- **Response**:
  - `200 OK`: Task completion status updated
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User attempting to update different user's task
  - `404 Not Found`: Task doesn't exist or doesn't belong to user
- **Headers**:
  - `Authorization: Bearer <valid_jwt_token>`
- **Body**: Completion status update

## Authentication-Specific Endpoints

### POST /api/auth/validate
- **Purpose**: Verify JWT token validity without performing any action
- **Headers**:
  - `Authorization: Bearer <jwt_token_to_validate>`
- **Response**:
  - `200 OK`: Token is valid, returns user identity information
  - `401 Unauthorized`: Token is invalid or expired
- **Response Body**:
  ```json
  {
    "valid": true,
    "user_id": "user_identifier",
    "expires_at": "timestamp"
  }
  ```

## Token Validation Contract

### JWT Token Structure
The backend expects JWT tokens with the following claims:
- `sub`: Subject (user ID)
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp
- `user_id`: User identifier (for validation purposes)
- `email`: User email (for identification)

### User ID Matching Contract
For all user-specific endpoints, the backend MUST verify that:
1. The JWT token contains a valid user ID in the `user_id` claim
2. The `user_id` path parameter matches the `user_id` in the JWT token
3. If these do not match, the backend MUST return a 403 Forbidden response

## Error Response Format

### Authentication Error Responses
All authentication-related errors follow this format:

**401 Unauthorized (Invalid Token):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Could not validate credentials",
    "details": "Token is invalid, expired, or improperly formatted"
  }
}
```

**403 Forbidden (Unauthorized Access):**
```json
{
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Access to this resource is forbidden",
    "details": "User ID in token does not match user ID in request"
  }
}
```

## Security Contract

### Authorization Requirements
1. **No Anonymous Access**: All user-specific endpoints require authentication
2. **User Isolation**: Users can only access their own resources
3. **Token Validation**: JWT signature must be validated using BETTER_AUTH_SECRET
4. **Expiration Check**: Expired tokens must be rejected
5. **User ID Validation**: URL parameters must match token user ID

### Header Requirements
- All requests to protected endpoints must include `Authorization: Bearer <token>` header
- Backend should reject requests without proper authorization header with 401 status
- Backend should handle missing/malformed headers gracefully

## Client Implementation Contract

### Frontend Responsibilities
1. **Token Storage**: Securely store JWT token after authentication
2. **Token Attachment**: Automatically attach JWT to all protected API requests
3. **Error Handling**: Handle 401/403 responses by redirecting to login
4. **Token Refresh**: Implement token refresh mechanism if needed

### Backend Responsibilities
1. **Token Validation**: Verify JWT signature and expiration
2. **User Validation**: Ensure requested user ID matches token user ID
3. **Response Consistency**: Provide consistent error responses
4. **Secure Defaults**: Deny access by default if authentication fails