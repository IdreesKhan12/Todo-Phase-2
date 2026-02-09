---
name: backend-skill
description: Generate backend routes, handle HTTP requests and responses, and connect applications to databases securely and efficiently.
---

# Backend Skill – API & Server Logic

## Instructions

1. **Routing**
   - Create RESTful or RPC-style routes
   - Use clear and consistent URL patterns
   - Separate public and protected routes
   - Apply middleware where required (auth, validation, logging)

2. **Request & Response Handling**
   - Parse and validate incoming requests
   - Handle headers, params, query strings, and body safely
   - Return standardized responses (status codes, JSON structure)
   - Implement proper error handling and messaging

3. **Database Integration**
   - Connect to relational or NoSQL databases
   - Perform CRUD operations efficiently
   - Use parameterized queries / ORM methods
   - Manage connections and transactions safely

4. **Security & Reliability**
   - Sanitize all inputs
   - Prevent common backend vulnerabilities
   - Handle edge cases and failures gracefully

## Best Practices
- Keep controllers thin and business logic modular
- Use async/await with proper error boundaries
- Follow REST or API design standards
- Never expose sensitive data in responses
- Optimize queries and avoid unnecessary DB calls

## Example Structure
```js
// routes/user.routes.js
import express from "express";
import { createUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users/:id", getUser);

export default router;
