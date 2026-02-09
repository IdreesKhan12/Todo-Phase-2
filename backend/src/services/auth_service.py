from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from ..auth.utils import create_access_token
from ..models.task_model import Task
from sqlmodel import Session, select
from jose import jwt
import os


def authenticate_user(user_credentials: Dict[str, Any]) -> Optional[str]:
    """
    Authenticate user and return JWT token if valid.
    In a real implementation, this would verify user credentials against the database.
    For this implementation, we're focusing on the JWT creation part.
    """
    # In a real implementation, we would verify credentials here
    # For this demo, we'll assume authentication succeeded
    user_id = user_credentials.get("user_id")
    if not user_id:
        return None

    # Create access token with user info
    token_data = {
        "sub": user_id,
        "user_id": user_id,
        "email": user_credentials.get("email", ""),
        "exp": datetime.utcnow() + timedelta(minutes=30),
        "iat": datetime.utcnow()
    }

    token = create_access_token(token_data)
    return token


def validate_user_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Validate the provided JWT token and return user information.
    """
    from ..auth.utils import verify_token
    try:
        payload = verify_token(token)
        return payload
    except Exception:
        return None


def validate_user_access(user_id_from_token: str, user_id_from_request: str) -> bool:
    """
    Validate that the user ID in the token matches the user ID in the request.
    This is crucial for preventing cross-user access.
    """
    return user_id_from_token == user_id_from_request


def get_user_tasks_count(session: Session, user_id: str) -> int:
    """
    Get the count of tasks for a specific user to validate access.
    """
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return len(tasks)