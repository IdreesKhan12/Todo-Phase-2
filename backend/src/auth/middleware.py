from fastapi import Request, HTTPException, status
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from .utils import verify_token
import logging


# Set up logging
logger = logging.getLogger(__name__)


class JWTBearer(HTTPBearer):
    """
    JWT Bearer token authentication scheme.
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        # Log the incoming request for authentication
        logger.info(f"Authenticating request: {request.method} {request.url.path}")

        credentials: Optional[HTTPAuthorizationCredentials] = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                logger.warning("Invalid authentication scheme")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )

            token = credentials.credentials
            user_data = self.verify_jwt(token)
            if not user_data:
                logger.warning("Invalid token or expired token")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token or expired token."
                )

            logger.info(f"Successfully authenticated user: {user_data.get('sub', 'unknown')}")
            return user_data
        else:
            logger.warning("Invalid authorization code - no credentials provided")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )

    def verify_jwt(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify the JWT token and return the user data if valid.
        """
        try:
            user_data = verify_token(token)
            return user_data
        except Exception as e:
            logger.error(f"JWT verification failed: {str(e)}")
            return None


# Create an instance of the middleware
jwt_scheme = JWTBearer()