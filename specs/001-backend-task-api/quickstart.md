# Quickstart Guide: Backend Task API & Database

**Feature**: 001-backend-task-api
**Date**: 2026-02-05
**Related**: [Plan](./plan.md), [Research](./research.md), [Data Model](./data-model.md)

## Overview

This guide provides instructions for setting up, running, and using the Backend Task API with Neon Serverless PostgreSQL database. The API provides REST endpoints for managing user tasks with proper CRUD operations and validation.

## Prerequisites

- Python 3.11+
- pip package manager
- Access to Neon Serverless PostgreSQL database
- Environment for running uvicorn

## Installation

### 1. Clone or Navigate to Project Directory
```bash
cd /path/to/your/project
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi sqlmodel uvicorn psycopg2-binary python-dotenv
```

### 4. Set Up Environment Variables
Create a `.env` file in your project root:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## Project Structure

After setup, your project should look like:

```
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   └── task_model.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── task_service.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py
│   └── config/
│       ├── __init__.py
│       └── settings.py
├── requirements.txt
└── .env
```

## Running the Application

### 1. Initialize the Database Tables
Before starting the API, ensure the database tables are created:

```bash
# This would typically be done in a startup script
# For now, run a small script to initialize tables
python -c "
from src.services.database import engine
from src.models.task_model import Task
from sqlmodel import SQLModel

SQLModel.metadata.create_all(engine)
print('Database tables created successfully!')
"
```

### 2. Start the API Server
```bash
uvicorn src.api.main:app --reload
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

## Testing the API

### Example: Create a Task
```bash
curl -X POST http://localhost:8000/api/user123/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'
```

### Example: Get All Tasks
```bash
curl http://localhost:8000/api/user123/tasks
```

## Configuration Details

### Environment Variables
- `DATABASE_URL`: Connection string for Neon PostgreSQL database
- `ENVIRONMENT`: (optional) Set to "development", "staging", or "production"
- `DEBUG`: (optional) Enable debug mode if set to "true"

### Settings Module
The `settings.py` file manages configuration:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    debug: bool = False

    class Config:
        env_file = ".env"
```

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Verify `DATABASE_URL` in `.env` file
2. **Table Doesn't Exist**: Run the database initialization script
3. **Port Already in Use**: Use different port with `--port` option: `uvicorn src.api.main:app --reload --port 8001`

### Health Check
Verify the API is running by visiting the docs: `http://localhost:8000/docs`