from datetime import datetime, timedelta
from typing import Dict, Optional
from jose import jwt
from ..config.settings import settings
import os

# Use the same secret key as utils.py
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", settings.better_auth_secret)
ALGORITHM = "HS256"


def create_access_token(data: Dict[str, any], expires_delta: Optional[timedelta] = None):
    """
    Create JWT access token with expiration.
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt