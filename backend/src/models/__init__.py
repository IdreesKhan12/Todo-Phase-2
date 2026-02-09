from sqlmodel import SQLModel

# Import all models here to register them with SQLModel
from .task_model import Task, TaskCreate, TaskRead, TaskUpdate, TaskToggle

__all__ = ["SQLModel", "Task", "TaskCreate", "TaskRead", "TaskUpdate", "TaskToggle"]