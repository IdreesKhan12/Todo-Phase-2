---
description: "Task list for Backend Task API & Database implementation"
---

# Tasks: Backend Task API & Database

**Input**: Design documents from `/specs/001-backend-task-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/` at repository root
- Paths shown below follow the structure defined in plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure with backend/ directory per implementation plan
- [X] T002 [P] Initialize Python project with requirements.txt for FastAPI, SQLModel, uvicorn, psycopg2-binary
- [X] T003 [P] Configure environment variables and settings module in backend/src/config/settings.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup database engine and session management in backend/src/services/database.py
- [X] T005 [P] Create base SQLModel configuration and setup in backend/src/models/__init__.py
- [X] T006 [P] Setup FastAPI app initialization in backend/src/api/main.py
- [X] T007 Create Task model with all required fields in backend/src/models/task_model.py
- [X] T008 Configure error handling and HTTP exception handlers in backend/src/api/exceptions.py
- [X] T009 Setup request/response validation models for Task operations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task (Priority: P1) 🎯 MVP

**Goal**: A user can create a new task with a title and optional description, and have it stored persistently in the database.

**Independent Test**: Can be fully tested by making a POST request to /api/{user_id}/tasks with task data and verifying the task is created with a unique ID and proper timestamps.

### Implementation for User Story 1

- [X] T010 [P] Create TaskCreate and TaskRead Pydantic models in backend/src/models/task_model.py
- [X] T011 Implement create_task function in backend/src/services/task_service.py
- [X] T012 Create POST endpoint for task creation in backend/src/api/routes/tasks.py
- [X] T013 Add validation for required title field and error handling
- [X] T014 Test that created task returns proper ID, timestamps and user_id

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Retrieve All Tasks (Priority: P1)

**Goal**: A user can view all their tasks to see what they need to accomplish.

**Independent Test**: Can be fully tested by making a GET request to /api/{user_id}/tasks and verifying the response contains all tasks for that user.

### Implementation for User Story 2

- [X] T015 [P] Create function to retrieve all tasks for a user in backend/src/services/task_service.py
- [X] T016 Create GET endpoint for retrieving all tasks in backend/src/api/routes/tasks.py
- [X] T017 Add proper filtering by user_id to ensure data isolation
- [X] T018 Test that only tasks for the specified user_id are returned

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Get Individual Task (Priority: P2)

**Goal**: A user can retrieve details of a specific task by its ID.

**Independent Test**: Can be fully tested by making a GET request to /api/{user_id}/tasks/{id} and verifying the response contains the specific task data.

### Implementation for User Story 3

- [X] T019 [P] Create function to retrieve a single task by ID in backend/src/services/task_service.py
- [X] T020 Create GET endpoint for retrieving specific task in backend/src/api/routes/tasks.py
- [X] T021 Add validation to ensure user can only access their own tasks
- [X] T022 Test that 404 is returned for non-existent task

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: A user can modify an existing task, such as changing its title or description.

**Independent Test**: Can be fully tested by making a PUT request to /api/{user_id}/tasks/{id} with updated data and verifying the task is updated in the database.

### Implementation for User Story 4

- [X] T023 [P] Create TaskUpdate Pydantic model in backend/src/models/task_model.py
- [X] T024 Create update_task function in backend/src/services/task_service.py
- [X] T025 Create PUT endpoint for updating task in backend/src/api/routes/tasks.py
- [X] T026 Ensure updated_at timestamp is updated when task is modified
- [X] T027 Test that 404 is returned for non-existent task

**Checkpoint**: User Stories 1, 2, 3, and 4 should now be independently functional

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: A user can remove a task that is no longer needed.

**Independent Test**: Can be fully tested by making a DELETE request to /api/{user_id}/tasks/{id} and verifying the task is removed from the database.

### Implementation for User Story 5

- [X] T028 [P] Create delete_task function in backend/src/services/task_service.py
- [X] T029 Create DELETE endpoint for deleting task in backend/src/api/routes/tasks.py
- [X] T030 Add proper success response for deletion
- [X] T031 Test that 404 is returned for non-existent task

**Checkpoint**: User Stories 1-5 should now be independently functional

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P3)

**Goal**: A user can mark a task as completed or incomplete without changing other properties.

**Independent Test**: Can be fully tested by making a PATCH request to /api/{user_id}/tasks/{id}/complete and verifying the task's completion status is toggled.

### Implementation for User Story 6

- [X] T032 [P] Create TaskToggle Pydantic model in backend/src/models/task_model.py
- [X] T033 Create toggle_completion function in backend/src/services/task_service.py
- [X] T034 Create PATCH endpoint for toggling task completion in backend/src/api/routes/tasks.py
- [X] T035 Ensure updated_at timestamp is updated when completion status changes
- [X] T036 Test that 404 is returned for non-existent task

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T037 [P] Add comprehensive error responses per API contracts
- [X] T038 Add database initialization and migration setup
- [X] T039 Add request logging and response time metrics
- [X] T040 [P] Update API documentation and add health check endpoint
- [X] T041 Security validation: ensure user isolation is properly enforced
- [X] T042 Run quickstart.md validation with all endpoints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Task)
4. Complete Phase 4: User Story 2 (Retrieve All Tasks)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 together
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 & 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Add User Story 6 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Ensure proper user isolation - users can only access their own tasks