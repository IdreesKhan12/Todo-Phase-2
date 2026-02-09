# Quickstart Guide: Authentication & Secure API Access

**Feature**: 001-auth-jwt-secure
**Date**: 2026-02-06
**Related**: [Plan](./plan.md), [Research](./research.md), [Data Model](./data-model.md)

## Overview

This guide provides instructions for implementing, testing, and using the JWT-based authentication and secure API access for the Todo Full-Stack Web Application. The system integrates Better Auth for Next.js frontend authentication with FastAPI backend JWT verification.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Access to Neon Serverless PostgreSQL database
- Environment for running both frontend and backend applications

## Setup Authentication System

### 1. Configure Environment Variables

Create or update the `.env` files in both frontend and backend:

**Backend `.env`:**
```
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
ENVIRONMENT=development
DEBUG=true
```

**Frontend `.env`:**
```
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
pip install pyjwt python-jose[cryptography] bcrypt
```

**Frontend:**
```bash
cd frontend
npm install better-auth @better-auth/node
```

### 3. Configure Better Auth in Frontend

Create or update `frontend/src/services/auth.js`:
```javascript
import { betterAuth } from "better-auth";
import { jwt } from "@better-auth/node";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET,
    })
  ],
  // Add your auth configuration here
});
```

## Backend JWT Verification Implementation

### 1. Create JWT Utilities

Create `backend/src/auth/utils.py`:
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
from ..config.settings import settings

SECRET_KEY = settings.better_auth_secret
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
```

### 2. Create Authentication Dependencies

Create `backend/src/auth/dependencies.py`:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .utils import verify_token

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    return verify_token(token)
```

### 3. Update Settings Configuration

Update `backend/src/config/settings.py` to include auth configuration:
```python
import os
from typing import Optional

class Settings:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "")
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        self.better_auth_secret = os.getenv("BETTER_AUTH_SECRET", "")

settings = Settings()
```

## Frontend API Client Implementation

### 1. Create API Client with JWT Attachment

Create `frontend/src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Protect Routes with Authentication Guard

Create `frontend/src/components/auth/ProtectedRoute.jsx`:
```jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      // Validate token with backend
      validateToken(token);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
```

## Testing Authentication

### 1. Manual Testing

**Backend authentication middleware testing:**
```bash
# Test without token (should return 401)
curl -X GET http://localhost:8000/api/user123/tasks

# Test with invalid token (should return 401)
curl -X GET http://localhost:8000/api/user123/tasks -H "Authorization: Bearer invalid.token.here"

# Test with valid token for wrong user (should return 403)
curl -X GET http://localhost:8000/api/user456/tasks -H "Authorization: Bearer <valid_token_for_user123>"
```

### 2. Automated Testing

**Create authentication tests in `backend/tests/auth/`:**
- `test_middleware.py` - Test JWT verification middleware
- `test_auth_service.py` - Test authentication service functions
- `test_auth_integration.py` - Test full authentication flow

## Production Deployment Considerations

### 1. Secret Management
- Never hardcode BETTER_AUTH_SECRET in source code
- Use environment variables or secret management systems
- Use strong, randomly generated secrets
- Rotate secrets periodically

### 2. Token Configuration
- Adjust token expiration times based on security requirements
- Use longer expiration times for refresh tokens
- Implement token blacklisting for logout functionality
- Monitor token usage for potential abuse

### 3. Security Headers
- Ensure HTTPS is enforced
- Implement Content Security Policy headers
- Add X-Frame-Options to prevent clickjacking
- Use Strict-Transport-Security for secure connections

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**: Verify BETTER_AUTH_SECRET matches between frontend and backend
2. **Cross-Origin Issues**: Configure CORS properly between frontend and backend
3. **Token Validation Failures**: Check token format and expiration
4. **User Isolation Failures**: Verify user ID validation logic in routes

### Health Checks

Verify authentication system is working:
```bash
# Check backend authentication is running
curl -I http://localhost:8000/health

# Check JWT verification is working
curl -X GET http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer <valid_jwt_token>" \
  -v
```

## Migration Considerations

- All existing endpoints will require authentication after implementation
- Existing database data should remain accessible to original users
- API clients will need to be updated to include JWT tokens
- Frontend applications will need to implement token storage and attachment