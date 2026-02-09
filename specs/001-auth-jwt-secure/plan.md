# Implementation Plan: Authentication & Secure API Access

**Branch**: `001-auth-jwt-secure` | **Date**: 2026-02-06 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/001-auth-jwt-secure/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of JWT-based authentication and authorization for the Todo Full-Stack Web Application. The system will integrate Better Auth for Next.js frontend authentication, issue JWT tokens upon successful authentication, and verify tokens on the FastAPI backend to ensure user isolation and secure access to user-specific resources. The implementation will enforce user identity validation at the API layer and ensure all CRUD operations are properly authenticated and authorized.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript (Next.js)
**Primary Dependencies**:
- Frontend: Next.js, Better Auth, React
- Backend: FastAPI, PyJWT, python-jose[cryptography]
- ORM: SQLModel for token validation and user identity extraction
**Storage**: Neon Serverless PostgreSQL (for user data - JWT tokens are stateless)
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Linux server (backend), Web browser (frontend)
**Project Type**: web (full-stack application with frontend and backend)
**Performance Goals**: <200ms p95 response time for authentication requests
**Constraints**: <200ms p95, stateless JWT authentication, no database session storage, user data isolation
**Scale/Scope**: Multi-user access, secure token validation, proper user isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Security-first design: Authentication, authorization, and data isolation are mandatory from the start
- ✅ Separation of concerns: Clear separation between frontend authentication, token transmission, and backend verification
- ✅ Technology Stack Compliance: Uses Better Auth (JWT-based) for user management, follows FastAPI + SQLModel architecture
- ✅ Data Isolation: Backend will filter data based on authenticated user identity, enforcing task ownership
- ✅ Stateless Authentication: No database-based session validation, relies solely on JWT verification

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-jwt-secure/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── middleware.py              # JWT verification middleware
│   │   ├── dependencies.py            # Current user dependency injection
│   │   └── utils.py                   # JWT encoding/decoding utilities
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py                # BETTER_AUTH_SECRET configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py                    # User identity model for token validation
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py            # Authentication validation service
│   │   └── user_service.py            # User data isolation service
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app with auth middleware
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py                # Auth-specific endpoints (if needed)
│   │       └── tasks.py               # Updated task routes with auth requirements
│   └── __init__.py
├── requirements.txt                   # JWT verification dependencies
├── .env                              # BETTER_AUTH_SECRET environment variable
└── tests/
    ├── auth/
    │   ├── test_middleware.py         # JWT middleware tests
    │   └── test_auth_service.py       # Authentication service tests
    └── integration/
        └── test_auth_integration.py   # Full auth flow tests

frontend/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── AuthProvider.jsx       # Better Auth context provider
│   │       └── ProtectedRoute.jsx     # Authentication guard component
│   ├── services/
│   │   ├── api.js                     # API client with JWT attachment
│   │   └── auth.js                    # Better Auth integration
│   ├── pages/
│   │   ├── login.jsx                  # Login page using Better Auth
│   │   └── dashboard.jsx              # Protected dashboard page
│   └── middleware.js                  # Next.js middleware for auth protection
├── package.json                       # Better Auth and related dependencies
└── .env                               # Frontend environment variables
```

**Structure Decision**: Full-stack implementation with separate frontend (Next.js + Better Auth) and backend (FastAPI + JWT middleware) components. Clear separation between authentication (frontend), token transport (HTTP headers), and authorization (backend). Backend authentication middleware enforces access control at the API layer, while frontend provides token attachment to requests.

## Phase 0: Research & Discovery

### 0.1 Better Auth Integration Research
- Research Better Auth configuration options for Next.js applications
- Study JWT plugin setup and token customization options
- Investigate user session management and token refresh patterns

### 0.2 JWT Verification in FastAPI Research
- Research JWT verification libraries for Python (PyJWT, python-jose)
- Study FastAPI dependency injection patterns for authentication
- Investigate middleware vs dependency approaches for JWT validation
- Review security best practices for JWT handling

### 0.3 Frontend-Backend Token Transmission Patterns
- Research secure methods for storing JWT in browser (HttpOnly cookies vs local storage)
- Study automatic Authorization header attachment in API clients
- Investigate error handling patterns for authentication failures

## Phase 1: Design & Architecture

### 1.1 Better Auth Configuration Design
- Design Better Auth configuration with JWT plugin enabled
- Configure token payload structure with user identity information
- Set token expiration duration balancing security and user experience
- Define authentication endpoints and callbacks

### 1.2 JWT Verification Middleware Architecture
- Design JWT verification middleware for FastAPI
- Plan dependency injection for current user context
- Define error responses for various authentication failures (401, 403)
- Plan token validation and user identity extraction

### 1.3 Frontend API Client Integration
- Design API client wrapper that automatically attaches JWT to requests
- Plan error handling for authentication failures
- Design authentication context for state management
- Plan route protection mechanisms

### 1.4 Authorization Enforcement Strategy
- Design approach to validate user_id in URL matches JWT identity
- Plan database query filtering to ensure user isolation
- Define error responses for cross-user access attempts
- Plan integration with existing CRUD operations

## Phase 2: Implementation Strategy

### 2.1 Environment and Configuration Setup
- Configure BETTER_AUTH_SECRET environment variable in both frontend and backend
- Set up Better Auth with JWT plugin on the frontend
- Update settings.py to load auth configuration
- Implement configuration validation

### 2.2 Backend Authentication Infrastructure
- Implement JWT verification utilities (encoding/decoding)
- Create authentication middleware for token validation
- Implement current user dependency for route injection
- Update existing task routes to require authentication
- Implement user ID validation to prevent cross-user access

### 2.3 Frontend Authentication Integration
- Integrate Better Auth with Next.js application
- Implement API client with automatic JWT attachment
- Create protected route components
- Update frontend to send JWT in Authorization headers

### 2.4 Security Validation and Testing
- Validate all protected endpoints require authentication
- Test cross-user access prevention
- Verify error handling for invalid/expired tokens
- Test user isolation enforcement

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Two-project structure (frontend + backend) | Required by authentication architecture with separate client and server concerns | Single project approach would mix frontend and backend authentication logic, reducing security isolation |
| JWT stateless authentication | Required for scalable, distributed system without database session lookups | Database session validation would create additional database load and reduce scalability |