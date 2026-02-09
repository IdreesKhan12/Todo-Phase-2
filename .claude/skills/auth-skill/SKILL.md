---
name: auth-skill
description: Handle secure user authentication flows including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth Skill

## Instructions

1. **User Authentication Flows**
   - Implement secure **signup, signin, logout**
   - Enforce email/username uniqueness
   - Handle account verification and password reset flows

2. **Password Security**
   - Hash passwords using **bcrypt or argon2**
   - Apply proper salting and configurable cost factors
   - Never store or log plain-text passwords

3. **Token Management**
   - Issue **JWT access and refresh tokens**
   - Validate token signatures, expiry, and claims
   - Rotate and revoke tokens securely
   - Use HTTP-only, secure cookies when applicable

4. **Better Auth Integration**
   - Configure Better Auth providers, adapters, and sessions
   - Integrate with databases and user models correctly
   - Follow Better Auth security defaults and lifecycle hooks

5. **Authorization Support**
   - Enforce role-based access control (RBAC)
   - Apply least-privilege principles
   - Protect sensitive routes and resources

## Best Practices
- Treat all inputs as untrusted
- Follow OWASP authentication and session management guidelines
- Prefer secure defaults over convenience
- Protect against brute-force and replay attacks
- Ensure consistent error messages (avoid user enumeration)
- Log auth events safely without exposing secrets

## Example Structure
```ts
// Signup
const hashedPassword = await hash(password, { algorithm: "argon2" });

await db.user.create({
  email,
  password: hashedPassword,
});

// JWT Issue
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  JWT_SECRET,
  { expiresIn: "15m" }
);
