from sqlmodel import SQLModel, Field
from datetime import datetime, date
import pytz
from typing import Optional


class TaskBase(SQLModel):
    """Base class containing shared fields for Task."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(max_length=255, index=True)
    due_date: Optional[str] = Field(default=None)


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
    due_date: Optional[str] = Field(default=None)


class TaskToggle(SQLModel):
    """Schema for toggling task completion."""
    completed: bool
