# Task Management API

A FastAPI-based REST API for managing user tasks with SQLModel ORM and Neon Serverless PostgreSQL.

## Overview

This API provides full CRUD operations for user tasks with proper validation and error handling. All endpoints follow RESTful principles and implement proper HTTP status codes.

## Prerequisites

- Python 3.11+
- pip package manager
- Access to Neon Serverless PostgreSQL database

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables by copying the `.env.example` to `.env` and updating the database URL.

## Setup Database

Initialize the database tables:

```bash
python init_db.py
```

## Running the Application

Start the API server:

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

All endpoints follow the pattern `/api/{user_id}/tasks` to ensure proper user isolation:

### Create Task
```
POST /api/{user_id}/tasks
Content-Type: application/json

{
  "title": "Sample Task",
  "description": "Description of the task",
  "completed": false
}
```

Response: `201 Created` with created task object

### Get All Tasks for User
```
GET /api/{user_id}/tasks
```

Response: `200 OK` with array of task objects

### Get Specific Task
```
GET /api/{user_id}/tasks/{task_id}
```

Response: `200 OK` with task object or `404 Not Found`

### Update Task
```
PUT /api/{user_id}/tasks/{task_id}
Content-Type: application/json

{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true
}
```

Response: `200 OK` with updated task object or `404 Not Found`

### Delete Task
```
DELETE /api/{user_id}/tasks/{task_id}
```

Response: `200 OK` with success message or `404 Not Found`

### Toggle Task Completion
```
PATCH /api/{user_id}/tasks/{task_id}/complete
Content-Type: application/json

{
  "completed": true
}
```

Response: `200 OK` with updated task object or `404 Not Found`

## Features

- Full CRUD operations for tasks
- User data isolation through user_id parameter
- Input validation with Pydantic models
- Proper error handling and HTTP status codes
- Automatic timestamp management
- RESTful API design

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   └── task_model.py          # SQLModel Task definition
│   ├── services/
│   │   ├── __init__.py
│   │   ├── database.py            # Database engine and session setup
│   │   └── task_service.py        # CRUD operations for tasks
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app initialization
│   │   ├── exceptions.py          # HTTP exception handlers
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py           # Task API routes (GET, POST, PUT, DELETE, PATCH)
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py            # Configuration and environment variables
│   └── __init__.py
├── tests/
├── requirements.txt
├── init_db.py                     # Database initialization script
├── main.py                        # Main application entry point
└── .env                           # Environment variables
```