# src/utils/dependencies.py

from fastapi import Depends, status, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import logging

from src.utils.database import get_db
from src.models import User
from src.schemas import TokenData
from src.utils.enums import UserRole
from src.utils.error_handlers import APIError, UnauthorizedError
from src.utils.settings import (
    SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES,
)

# Configure logging
logger = logging.getLogger(__name__)

# OAuth2 scheme for token authentication - make sure tokenUrl is correct
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/token",  # Make sure this matches your actual token endpoint URL
)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = APIError(
        status_code=status.HTTP_401_UNAUTHORIZED,   
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
        error_code="INVALID_CREDENTIALS"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            logger.warning("Token missing 'sub' claim")
            raise credentials_exception
        token_data = TokenData(email=username, role=payload.get("role"))
    except JWTError as e:
        logger.warning(f"JWT validation error: {str(e)}")
        raise credentials_exception
    
    user = db.query(User).filter(User.username == token_data.email).first()
    if user is None:
        logger.warning(f"User not found: {token_data.email}")
        raise credentials_exception
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Inactive user attempted login: {user.username}")
        raise APIError(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
            error_code="INACTIVE_USER"
        )
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.commit()
    
    return user

def check_roles(allowed_roles: List[UserRole]):
    """
    Creates a dependency that checks if the current user has one of the allowed roles.
    """
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise UnauthorizedError(
                detail=f"User role '{current_user.role}' is not authorized to perform this action. Required roles: {[role.value for role in allowed_roles]}"
            )
        return current_user
    return role_checker

# Role-based dependencies
check_admin_role = check_roles([UserRole.ADMIN])
check_admin_or_staff_role = check_roles([UserRole.ADMIN, UserRole.STAFF])
check_admin_or_teacher_role = check_roles([UserRole.ADMIN, UserRole.TEACHER])
check_admin_staff_or_teacher_role = check_roles([UserRole.ADMIN, UserRole.STAFF, UserRole.TEACHER])
