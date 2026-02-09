# Research: Backend Task API & Database

**Feature**: 001-backend-task-api
**Date**: 2026-02-05
**Related**: [Plan](./plan.md)

## Phase 0: Technical Research & Discovery

### 0.1 FastAPI & SQLModel Integration

#### FastAPI Best Practices
- Dependency injection for database sessions using FastAPI's Depends()
- Pydantic models for request/response validation
- Proper HTTP status codes (200, 201, 404, 422, 500)
- Exception handling with custom handlers

#### SQLModel Integration
- SQLModel extends Pydantic and SQLAlchemy
- Can define both Pydantic validation and SQLAlchemy ORM features
- Uses the same model for both request validation and database operations
- Supports async operations for better performance

#### Dependency Injection Pattern
```python
def get_session():
    with Session(engine) as session:
        yield session

@app.get("/tasks")
def get_tasks(session: Session = Depends(get_session)):
    # Work with session here
```

### 0.2 Neon PostgreSQL Connection Patterns

#### Connection Pooling for Serverless
- Neon's serverless feature automatically scales connections
- Recommended to use connection pooling to minimize connection overhead
- Need to handle potential connection timeouts during scaling events

#### Environment Variables for Connection
- DATABASE_URL with postgresql format
- Proper handling of connection parameters (host, port, user, password, database)
- Support for SSL connection requirements

### 0.3 REST API Design for User-Specific Resources

#### Endpoint Structure
- Use user_id in path parameters to enforce data isolation
- Consistent naming convention for all endpoints
- Proper HTTP methods mapping to CRUD operations:
  - GET /api/{user_id}/tasks - Retrieve all tasks
  - POST /api/{user_id}/tasks - Create new task
  - GET /api/{user_id}/tasks/{id} - Get specific task
  - PUT /api/{user_id}/tasks/{id} - Update task
  - DELETE /api/{user_id}/tasks/{id} - Delete task
  - PATCH /api/{user_id}/tasks/{id}/complete - Toggle completion

#### Error Handling
- 422 for validation errors
- 404 for not-found resources
- 500 for server errors
- Consistent error response format

### 0.4 Database Schema Design

#### Task Model Fields
- id (primary key, auto-generated)
- title (string, required, indexed)
- description (string, optional)
- completed (boolean, default: false)
- user_id (string/UUID, required, indexed for filtering)
- created_at (timestamp, auto-generated)
- updated_at (timestamp, auto-generated, updates on change)

#### Indexing Strategy
- Primary key on id
- Index on user_id for efficient user-based queries
- Index on completed for potential filtering
- Potential composite index for user_id + completed if needed

### 0.5 Validation Requirements

#### Input Validation
- Title is required and should have length constraints
- Description optional, with maximum length if provided
- User_id should be validated (UUID format or string format)
- Prevent malicious input in title and description

#### Business Logic Validation
- Ensure user can only modify their own tasks
- Proper timestamp handling
- Data type validation