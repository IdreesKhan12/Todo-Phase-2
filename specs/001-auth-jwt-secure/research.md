# Research: Authentication & Secure API Access

**Feature**: 001-auth-jwt-secure
**Date**: 2026-02-06
**Related**: [Plan](./plan.md)

## Phase 0: Technical Research & Discovery

### 0.1 Better Auth Integration Research

#### Better Auth Setup for Next.js
- Better Auth is a complete authentication solution that handles sessions, password management, and social login
- For JWT-based approach, it can be configured to issue JWT tokens on successful authentication
- Configuration requires BETTER_AUTH_URL and BETTER_AUTH_SECRET environment variables
- Can be configured to use JWT tokens instead of database sessions

#### JWT Plugin Configuration
- Better Auth supports JWT through its plugin system
- Tokens can be customized to include user identity information
- Token expiration can be configured (recommended 15-30 minutes for access tokens)
- Refresh tokens can be used for longer session management

#### Token Payload Structure
- Should include user ID for identity verification
- May include roles/permissions if needed
- Should have standard claims: issuer, subject, audience, expiration
- Should be signed with BETTER_AUTH_SECRET for verification

### 0.2 JWT Verification in FastAPI Research

#### JWT Libraries for Python
- **PyJWT**: Most popular JWT library for Python, simple to use
- **python-jose**: More comprehensive, includes cryptography tools
- **authlib**: Full authentication library with JWT support
- For this implementation, python-jose recommended due to its cryptography support

#### FastAPI Authentication Patterns
- **Dependency Injection**: Create a `get_current_user` dependency that validates JWT
- **Middleware**: Global middleware to validate JWT tokens for protected routes
- **Route-level decoration**: Decorators to protect specific routes
- Dependency injection approach recommended for flexibility and testability

#### Security Best Practices
- Always verify token signature using shared secret
- Validate token expiration (exp claim)
- Use HTTPS in production to prevent token interception
- Consider using HttpOnly cookies for token storage instead of headers for XSS protection

### 0.3 Frontend-Backend Token Transmission Patterns

#### Secure Token Storage Options
- **HttpOnly Cookies**: Most secure against XSS, but requires CORS configuration
- **LocalStorage**: Convenient for SPA, but vulnerable to XSS
- **Memory Storage**: Tokens lost on refresh, more secure but less convenient
- For this implementation, using Authorization header with Bearer tokens

#### API Client Implementation
- Axios interceptors can automatically attach Authorization header
- Fetch API wrappers can achieve similar functionality
- Should handle 401 responses appropriately (logout, token refresh)
- Should cache tokens for the duration of validity

### 0.4 Authorization Enforcement Strategies

#### Middleware vs Route-level Protection
- **Global Middleware**: Applies to all routes, can exclude specific paths
- **Route Dependencies**: Applied per-route or per-router, more granular control
- **Route Decorators**: Custom decorators for specific protection levels
- For this implementation, dependency injection approach recommended for clarity

#### User Identity Validation
- Extract user ID from JWT token payload
- Compare with user ID in URL parameters
- Use custom exception for unauthorized access attempts
- Apply to all user-specific endpoints (tasks, user data, etc.)

### 0.5 Cross-User Access Prevention

#### Implementation Approaches
- **Database-level**: Filter queries by authenticated user ID
- **Application-level**: Verify user ID in service layer before database access
- **Route-level**: Validate user ID matches token early in request lifecycle
- Combination of approaches recommended for defense in depth

#### Error Handling Patterns
- Return 401 for invalid/expired tokens
- Return 403 for valid token but unauthorized access to resource
- Return 404 instead of 403 to prevent user enumeration
- Consistent error response format across all endpoints