# API Contracts: Backend Task API & Database

**Feature**: 001-backend-task-api
**Date**: 2026-02-05
**Related**: [Plan](../plan.md), [Data Model](../data-model.md)

## Contract Overview

This document defines the API contracts for the Backend Task API. Each endpoint follows RESTful principles with proper HTTP status codes and consistent request/response structures.

## Common Headers

All requests must include:
```
Content-Type: application/json
Accept: application/json
```

## Common Response Format

### Success Responses
```json
{
  "data": { /* resource data */ },
  "message": "Optional message"
}
```

### Error Responses
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message",
    "details": { /* optional field-specific error details */ }
  }
}
```

## API Endpoints

### 1. Create Task
- **Endpoint**: `POST /api/{user_id}/tasks`
- **Description**: Creates a new task for the specified user
- **Path Parameters**:
  - `user_id` (string): The user identifier
- **Request Body**:
```json
{
  "title": "Required task title",
  "description": "Optional task description",
  "completed": false
}
```
- **Response Codes**:
  - `201 Created`: Task successfully created
  - `422 Unprocessable Entity`: Validation error
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": {
    "id": 123,
    "title": "Required task title",
    "description": "Optional task description",
    "completed": false,
    "user_id": "user123",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T10:00:00Z"
  }
}
```

### 2. Get All Tasks
- **Endpoint**: `GET /api/{user_id}/tasks`
- **Description**: Retrieves all tasks for the specified user
- **Path Parameters**:
  - `user_id` (string): The user identifier
- **Query Parameters**: None
- **Response Codes**:
  - `200 OK`: Successfully retrieved tasks
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": [
    {
      "id": 123,
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "user_id": "user123",
      "created_at": "2026-02-05T10:00:00Z",
      "updated_at": "2026-02-05T10:00:00Z"
    }
  ]
}
```

### 3. Get Specific Task
- **Endpoint**: `GET /api/{user_id}/tasks/{id}`
- **Description**: Retrieves a specific task for the specified user
- **Path Parameters**:
  - `user_id` (string): The user identifier
  - `id` (integer): The task identifier
- **Response Codes**:
  - `200 OK`: Task found and returned
  - `404 Not Found`: Task not found
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": {
    "id": 123,
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "user_id": "user123",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T10:00:00Z"
  }
}
```

### 4. Update Task
- **Endpoint**: `PUT /api/{user_id}/tasks/{id}`
- **Description**: Updates a specific task for the specified user
- **Path Parameters**:
  - `user_id` (string): The user identifier
  - `id` (integer): The task identifier
- **Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```
- **Response Codes**:
  - `200 OK`: Task successfully updated
  - `404 Not Found`: Task not found
  - `422 Unprocessable Entity`: Validation error
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": {
    "id": 123,
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": true,
    "user_id": "user123",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T11:00:00Z"
  }
}
```

### 5. Delete Task
- **Endpoint**: `DELETE /api/{user_id}/tasks/{id}`
- **Description**: Deletes a specific task for the specified user
- **Path Parameters**:
  - `user_id` (string): The user identifier
  - `id` (integer): The task identifier
- **Response Codes**:
  - `200 OK`: Task successfully deleted
  - `404 Not Found`: Task not found
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": {
    "success": true,
    "message": "Task deleted successfully"
  }
}
```

### 6. Toggle Task Completion
- **Endpoint**: `PATCH /api/{user_id}/tasks/{id}/complete`
- **Description**: Toggles the completion status of a specific task
- **Path Parameters**:
  - `user_id` (string): The user identifier
  - `id` (integer): The task identifier
- **Request Body**:
```json
{
  "completed": true
}
```
- **Response Codes**:
  - `200 OK`: Task status successfully updated
  - `404 Not Found`: Task not found
  - `422 Unprocessable Entity`: Validation error
  - `500 Internal Server Error`: Server error
- **Successful Response**:
```json
{
  "data": {
    "id": 123,
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "user_id": "user123",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T12:00:00Z"
  }
}
```

## Validation Rules

### Request Validation
1. **Title**: Required, 1-255 characters
2. **Description**: Optional, maximum 1000 characters
3. **Completed**: Boolean value
4. **User ID**: Required string parameter
5. **Task ID**: Required positive integer

### Business Logic Validation
1. Users can only access tasks with matching user_id
2. All timestamps are in UTC ISO 8601 format
3. Task IDs are auto-generated by the database
4. The `updated_at` field is automatically updated on modifications

## Error Codes

- `TASK_NOT_FOUND`: Specific task does not exist
- `VALIDATION_ERROR`: Request data does not meet validation requirements
- `DATABASE_ERROR`: Issue occurred while accessing the database
- `UNEXPECTED_ERROR`: General server error