from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import pytz
from ..models.task_model import Task, TaskCreate, TaskUpdate, TaskToggle
from ..api.exceptions import TaskNotFoundException


def create_task(session: Session, task_data: TaskCreate) -> Task:
    """
    Create a new task in the database.
    """
    db_task = Task.from_orm(task_data)
    # Set the current time for created_at and updated_at
    now = datetime.now(pytz.UTC)
    db_task.created_at = now
    db_task.updated_at = now
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def get_tasks_by_user(session: Session, user_id: str) -> List[Task]:
    """
    Retrieve all tasks for a specific user.
    """
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks


def get_task_by_id_and_user(session: Session, task_id: int, user_id: str) -> Optional[Task]:
    """
    Retrieve a specific task by its ID and user ID.
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()
    return task


def update_task(session: Session, task_id: int, user_id: str, task_data: TaskUpdate) -> Optional[Task]:
    """
    Update a specific task by its ID and user ID.
    """
    db_task = get_task_by_id_and_user(session, task_id, user_id)
    if not db_task:
        return None

    update_data = task_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    # Update the timestamp
    db_task.updated_at = datetime.now(pytz.UTC)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def delete_task(session: Session, task_id: int, user_id: str) -> bool:
    """
    Delete a specific task by its ID and user ID.
    """
    db_task = get_task_by_id_and_user(session, task_id, user_id)
    if not db_task:
        return False

    session.delete(db_task)
    session.commit()
    return True


def toggle_task_completion(session: Session, task_id: int, user_id: str, task_toggle: TaskToggle) -> Optional[Task]:
    """
    Toggle the completion status of a specific task.
    """
    db_task = get_task_by_id_and_user(session, task_id, user_id)
    if not db_task:
        return None

    db_task.completed = task_toggle.completed
    db_task.updated_at = datetime.now(pytz.UTC)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task