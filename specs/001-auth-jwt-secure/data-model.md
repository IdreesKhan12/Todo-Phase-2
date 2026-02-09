# Data Model: Authentication & Secure API Access

**Feature**: 001-auth-jwt-secure
**Date**: 2026-02-06
**Related**: [Plan](./plan.md), [Research](./research.md)

## JWT Token Structure

### JWT Payload Claims
The JWT tokens issued by Better Auth will contain the following claims:

| Claim | Type | Description | Purpose |
|-------|------|-------------|---------|
| `sub` | String | Subject (user ID) | Identifies the authenticated user |
| `iss` | String | Issuer | Identifies the application that issued the token |
| `aud` | String | Audience | Specifies the intended recipients |
| `exp` | Number (Unix timestamp) | Expiration time | Determines token validity period |
| `iat` | Number (Unix timestamp) | Issued at | Time of token issuance |
| `jti` | String | JWT ID | Unique identifier for the token |

### User Identity Properties
Additional properties included in JWT for user identification:

| Property | Type | Description | Used For |
|----------|------|-------------|----------|
| `user_id` | String | Unique identifier for the user | User-specific data access validation |
| `email` | String | User email address | User identification |
| `role` | String | User role (if applicable) | Permission-based access control |

## Authentication Context Model

### Current User Model
The authenticated user model that will be injected into authenticated routes:

```python
from pydantic import BaseModel
from typing import Optional

class CurrentUser(BaseModel):
    """Represents the authenticated user extracted from JWT token."""
    id: str
    email: str
    role: Optional[str] = "user"  # Default role assignment
```

### JWT Verification Model
Input model for JWT verification:

```python
from pydantic import BaseModel

class JWTTokenPayload(BaseModel):
    """Validates the structure of decoded JWT token payload."""
    sub: str  # Subject - user ID
    exp: int  # Expiration timestamp
    iat: int  # Issued at timestamp
    iss: str  # Issuer
    user_id: str  # User identifier
    email: str  # User email
```

## Frontend Authentication State

### Session Context
The frontend authentication context will maintain:

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | Boolean | Whether the user is currently authenticated |
| `user` | Object or null | User information when authenticated |
| `accessToken` | String or null | Current JWT access token |
| `refreshToken` | String or null | Refresh token for renewing access |
| `expiresAt` | Date or null | Token expiration timestamp |

## Error Response Models

### Authentication Error Response
Standardized error response for authentication failures:

```python
from pydantic import BaseModel

class AuthenticationError(BaseModel):
    """Error response for authentication failures."""
    error: str
    message: str
    status_code: int

# Examples:
# 401 Unauthorized: Invalid or missing token
# 403 Forbidden: Valid token but unauthorized access to resource
```

### Token Validation Error
Error response specifically for token validation failures:

```python
from pydantic import BaseModel

class TokenValidationError(BaseModel):
    """Detailed error response for token validation failures."""
    error: str  # "INVALID_TOKEN", "EXPIRED_TOKEN", "SIGNATURE_MISMATCH"
    message: str
    status_code: int
    details: dict  # Additional context (e.g., expired_at timestamp)
```

## Authorization Validation Models

### User Identity Validation
Model to represent the result of user identity validation:

```python
from pydantic import BaseModel
from typing import Optional

class UserIdentityCheck(BaseModel):
    """Result of user identity validation against request."""
    is_valid: bool
    user_id_from_token: str
    user_id_from_request: str
    reason: Optional[str] = None  # Reason for validation failure
```

## API Security Models

### Secure API Request Model
Model for secure API requests that require authentication:

```python
from pydantic import BaseModel
from typing import Optional

class SecureAPIRequest(BaseModel):
    """Base model for authenticated API requests."""
    user_id: str  # User ID from token validation
    request_path: str  # Original request path
    request_method: str  # HTTP method
    timestamp: float  # Request timestamp for rate limiting

    class Config:
        # Prevent unauthorized modification of user_id
        frozen = True
```

## Validation Rules

### JWT Token Validation Rules
1. **Signature Verification**: Token signature must match with BETTER_AUTH_SECRET
2. **Expiration Check**: Current time must be before token expiration (exp claim)
3. **Issuer Validation**: Token must have valid issuer claim
4. **Subject Presence**: Token must contain valid user ID in subject claim

### User Access Validation Rules
1. **User ID Matching**: User ID in JWT token must match user ID in URL parameter
2. **Resource Ownership**: User can only access resources they own
3. **Permission Checking**: User must have appropriate permissions for requested operation
4. **Request Method Authorization**: Certain operations may require specific permissions

### Error Response Consistency Rules
1. **Status Code Accuracy**: Use appropriate HTTP status codes (401, 403, etc.)
2. **Message Clarity**: Error messages should be informative but not reveal system details
3. **Structure Consistency**: All error responses follow the same structure
4. **Privacy Protection**: Error responses should not reveal user existence to unauthorized parties

## Security Considerations

### Token Storage Security
- Tokens should be stored securely in frontend (consider HttpOnly cookies for sensitive applications)
- Tokens should have limited lifespan (recommended 15-30 minutes for access tokens)
- Tokens should be transmitted over HTTPS only
- Refresh tokens should be more secure and have longer expiration

### Rate Limiting Integration
- Authentication endpoints should be protected against brute force attacks
- Consider per-user or per-IP rate limiting for authentication endpoints
- Implement account lockout mechanisms for repeated failures

### Cross-Site Request Forgery (CSRF) Protection
- When using cookies for token storage, implement CSRF protection
- Use same-site cookies to prevent cross-origin requests
- Implement anti-CSRF tokens when appropriate