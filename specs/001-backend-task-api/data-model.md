# Data Model: Backend Task API & Database

**Feature**: 001-backend-task-api
**Date**: 2026-02-05
**Related**: [Plan](./plan.md), [Research](./research.md)

## Task Entity Definition

### Core Fields
The Task entity represents a user's task with the following required fields:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Integer (Primary Key) | Auto-generated, Unique | Auto-increment | Unique identifier for each task |
| title | String (VARCHAR) | Required, Length: 1-255 chars | N/A | Required title of the task |
| description | String (TEXT) | Optional | NULL | Optional description for the task details |
| completed | Boolean | Required | False | Task completion status |
| user_id | String (VARCHAR) | Required, Indexed | N/A | Identifier of the user who owns this task |
| created_at | DateTime | Required, Immutable | Current Timestamp | Timestamp when the task was created |
| updated_at | DateTime | Required | Current Timestamp | Timestamp when the task was last updated |

### Database Schema Representation
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for efficient user-based queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Index for potential completion status queries
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Composite index for common queries: user and completion status
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

## SQLModel Class Definition

### Task Model
```python
from sqlmodel import SQLModel, Field, Column
from datetime import datetime
import pytz
from typing import Optional

class TaskBase(SQLModel):
    """Base class containing shared fields for Task."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(max_length=255, index=True)

class Task(TaskBase, table=True):
    """Task model representing a user's task in the database."""
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))

class TaskCreate(TaskBase):
    """Schema for creating new tasks."""
    title: str = Field(min_length=1, max_length=255)

class TaskRead(TaskBase):
    """Schema for returning task data."""
    id: int
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    """Schema for updating tasks."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)

class TaskToggle(SQLModel):
    """Schema for toggling task completion."""
    completed: bool
```

## Relationships

### User Relationship
- Each task belongs to a single user identified by user_id
- Tasks are isolated by user_id to ensure multi-user isolation
- No explicit foreign key constraint to user table since user management is out of scope for this feature

### Query Constraints
- All queries must filter by user_id to ensure data isolation
- Users can only access their own tasks
- API endpoints must validate user_id parameter against authenticated user

## Validation Rules

### Field-Level Validation
1. **title**: Required, minimum length 1 character, maximum length 255 characters
2. **description**: Optional, maximum length 1000 characters
3. **completed**: Boolean value, defaults to False
4. **user_id**: Required, maximum length 255 characters
5. **created_at**: Auto-populated with current timestamp at creation
6. **updated_at**: Auto-populated with current timestamp on any update

### Business Rule Validation
1. Tasks can only be accessed by their owner (verified via user_id)
2. All timestamps are stored in UTC timezone
3. Task ID is immutable after creation
4. User_id is immutable after creation to prevent ownership changes

## Indexing Strategy

### Performance Considerations
- Primary key index on `id` (automatically created)
- Index on `user_id` for efficient filtering by user
- Index on `completed` for efficient filtering by completion status
- Composite index on `(user_id, completed)` for common combined queries

### Expected Query Patterns
1. Retrieve all tasks for a specific user: `SELECT * FROM tasks WHERE user_id = ?`
2. Retrieve completed/incomplete tasks for a user: `SELECT * FROM tasks WHERE user_id = ? AND completed = ?`
3. Get a specific task: `SELECT * FROM tasks WHERE user_id = ? AND id = ?`
4. Count tasks by user: `SELECT COUNT(*) FROM tasks WHERE user_id = ?`

## Migration Considerations

### Schema Evolution
- Future versions may add fields for categorization, priority, due dates
- Existing indexes should remain valid
- New indexes may be added based on evolving query patterns
- User_id validation should remain strict for data isolation