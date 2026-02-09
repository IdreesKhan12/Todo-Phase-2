from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select
from ...auth.dependencies import get_current_user_id
from ...auth.jwt_handler import create_access_token
from ...services.database import get_session
from ...models.user_model import User
import bcrypt
import uuid


router = APIRouter()


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(request: SignUpRequest, session: Session = Depends(get_session)):
    """
    Register a new user and return JWT token.
    """
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == request.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create user in database
    user_id = str(uuid.uuid4())
    db_user = User(
        id=user_id,
        email=request.email,
        name=request.name,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Generate JWT token
    token = create_access_token({"sub": user_id})

    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": request.email,
            "name": request.name
        }
    }


@router.post("/signin")
def signin(request: SignInRequest, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token.
    """
    # Check if user exists in database
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not bcrypt.checkpw(request.password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token({"sub": user.id})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }


@router.get("/validate-token")
def validate_token_endpoint(
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Validate JWT token and return user information.
    """
    return {
        "valid": True,
        "user_id": current_user_id,
        "message": "Token is valid"
    }


@router.get("/health")
def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy", "message": "Task Management API is running!"}
