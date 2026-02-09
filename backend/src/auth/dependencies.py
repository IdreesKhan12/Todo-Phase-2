from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
from .utils import verify_token
from ..models.task_model import Task


security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Get the current authenticated user from the JWT token.
    """
    token = credentials.credentials
    user_data = verify_token(token)
    return user_data


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Get the current authenticated user ID from the JWT token.
    """
    token = credentials.credentials
    user_data = verify_token(token)
    user_id = user_data.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    return user_id