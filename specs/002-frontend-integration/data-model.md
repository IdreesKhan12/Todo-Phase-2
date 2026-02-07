# Data Model: Frontend Application & Integration

## Entity Definitions

### Task (Client Representation)
**Fields:**
- id: string (unique identifier from backend)
- title: string (required, max 255 characters)
- description: string (optional, max 1000 characters)
- completed: boolean (default: false)
- created_at: string (ISO 8601 timestamp from backend)
- updated_at: string (ISO 8601 timestamp from backend)

**Validation Rules:**
- title must be 1-255 characters
- description must be 0-1000 characters if provided
- completed must be boolean
- timestamps must be valid ISO 8601 format

**State Transitions:**
- pending → completed (toggle completion)
- completed → pending (toggle completion)

### User Session (Authentication State)
**Fields:**
- user_id: string (from JWT payload)
- email: string (from JWT payload)
- name: string (optional, from JWT payload)
- isAuthenticated: boolean (derived from session validity)

**Validation Rules:**
- user_id must match JWT subject
- email must be valid email format
- isAuthenticated determined by token validity

### API Response Structures
**Task List Response:**
- tasks: Array<Task> (empty array if no tasks)

**Single Task Response:**
- task: Task (single task object)

**Error Response:**
- error: string (human-readable error message)
- status: number (HTTP status code)

## Relationship Mapping

### Frontend ↔ Backend
- Task entity maps to backend Task model (SQLModel)
- User session derived from JWT token issued by Better Auth
- API endpoints consume/produce matching data structures

### Component Relationships
- Dashboard component consumes Task list
- TaskItem component consumes individual Task
- TaskForm component produces Task data for API submission
- AuthProvider supplies User Session to all protected components

## Client-Side State Schema

### Task Management State
```
{
  tasks: Task[],
  loading: boolean,
  error: string | null,
  currentUser: {
    id: string,
    email: string,
    name: string
  },
  sessionValid: boolean
}
```

### Form State
```
{
  title: string,
  description: string,
  submitting: boolean,
  errors: {
    title?: string,
    description?: string
  }
}
```

## Data Flow Patterns

### Fetch Tasks
1. Dashboard component requests tasks from API
2. API client attaches JWT token
3. Backend validates token and user_id
4. Backend returns user's tasks
5. Dashboard updates local state with tasks

### Create Task
1. User fills task form
2. TaskForm component validates input
3. TaskForm sends request to API with JWT
4. Backend validates token and creates task for user_id
5. TaskForm receives response and updates UI

### Update Task
1. User interacts with task (toggle, edit)
2. TaskItem component sends update request with JWT
3. Backend validates token matches user_id
4. Backend updates task
5. TaskItem receives response and updates UI

### Delete Task
1. User clicks delete button
2. TaskItem component sends delete request with JWT
3. Backend validates token and user_id
4. Backend deletes task
5. TaskItem removes from UI