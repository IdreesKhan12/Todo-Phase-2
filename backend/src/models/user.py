from pydantic import BaseModel
from typing import Optional


class CurrentUser(BaseModel):
    """Represents the authenticated user extracted from JWT token."""
    id: str
    email: Optional[str] = None
    role: Optional[str] = "user"  # Default role assignment


class JWTTokenPayload(BaseModel):
    """Validates the structure of decoded JWT token payload."""
    sub: str  # Subject - user ID
    exp: int  # Expiration timestamp
    iat: int  # Issued at timestamp
    iss: str  # Issuer
    user_id: str  # User identifier
    email: str  # User email