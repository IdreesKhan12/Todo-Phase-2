from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from datetime import date

from ...models.task_model import Task, TaskCreate, TaskRead, TaskUpdate, TaskToggle
from ...services.database import get_session
from ...services.task_service import create_task, get_tasks_by_user, get_task_by_id_and_user, update_task, delete_task, toggle_task_completion
from ...api.exceptions import TaskNotFoundException
from ...auth.dependencies import get_current_user_id


router = APIRouter()


def _validate_due_date(due_date_str: str) -> None:
    """Validate that due_date is a valid future date."""
    try:
        due = date.fromisoformat(due_date_str)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid due_date format. Use YYYY-MM-DD.")
    if due < date.today():
        raise HTTPException(status_code=422, detail="Due date cannot be in the past")


@router.post("/tasks", response_model=TaskRead, status_code=201)
def create_task_endpoint(
    task: TaskCreate,
    token_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    if token_user_id != task.user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot create tasks for another user"
        )

    if task.due_date:
        _validate_due_date(task.due_date)

    task_dict = task.dict()
    task_dict['user_id'] = token_user_id
    updated_task = TaskCreate(**task_dict)

    db_task = create_task(session, updated_task)
    return db_task


@router.get("/tasks", response_model=List[TaskRead])
def read_tasks_endpoint(
    user_id: str,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Retrieve all tasks for the authenticated user.
    """
    # Verify that the user_id in the token matches the user_id in the request
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot access tasks for another user"
        )
    tasks = get_tasks_by_user(session, authenticated_user_id)
    return tasks


@router.get("/tasks/{task_id}", response_model=TaskRead)
def read_task_endpoint(
    user_id: str,
    task_id: int,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific task by its ID.
    """
    # Verify that the user_id in the token matches the user_id in the request
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot access tasks for another user"
        )
    task = get_task_by_id_and_user(session, task_id, authenticated_user_id)
    if not task:
        raise TaskNotFoundException(task_id)
    return task


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task_endpoint(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by its ID.
    """
    # Verify that the user_id in the token matches the user_id in the request
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot update tasks for another user"
        )
    if task_update.due_date:
        _validate_due_date(task_update.due_date)

    updated_task = update_task(session, task_id, authenticated_user_id, task_update)
    if not updated_task:
        raise TaskNotFoundException(task_id)
    return updated_task


@router.delete("/tasks/{task_id}")
def delete_task_endpoint(
    user_id: str,
    task_id: int,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by its ID.
    """
    # Verify that the user_id in the token matches the user_id in the request
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot delete tasks for another user"
        )
    deleted = delete_task(session, task_id, authenticated_user_id)
    if not deleted:
        raise TaskNotFoundException(task_id)
    return {"success": True, "message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion_endpoint(
    user_id: str,
    task_id: int,
    task_toggle: TaskToggle,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task.
    """
    # Verify that the user_id in the token matches the user_id in the request
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Cannot modify tasks for another user"
        )
    updated_task = toggle_task_completion(session, task_id, authenticated_user_id, task_toggle)
    if not updated_task:
        raise TaskNotFoundException(task_id)
    return updated_task