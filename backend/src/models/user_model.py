from sqlmodel import SQLModel, Field
from typing import Optional


class UserBase(SQLModel):
    """Base class containing shared fields for User."""
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=255)


class User(UserBase, table=True):
    """User model representing a user in the database."""
    id: Optional[str] = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
