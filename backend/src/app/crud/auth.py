from typing import Optional, Tuple
from sqlalchemy.orm import Session
from datetime import datetime
import bcrypt
import logging

from src.app.models.user import User
from src.app.schemas.user import UserCreate
from src.utils.error_handlers import APIError, ResourceAlreadyExistsError
from src.utils.enums import UserRole

# Configure logging
logger = logging.getLogger(__name__)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Authenticate a user with username and password.
    
    Args:
        db: Database session
        username: Username to authenticate
        password: Password to verify
        
    Returns:
        User object if authentication successful, None otherwise
    """
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
            
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return None
            
        return user
    except Exception as e:
        logger.error(f"Error during user authentication: {str(e)}")
        raise APIError(
            status_code=500,
            detail="Error during authentication",
            error_code="AUTHENTICATION_ERROR"
        )

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Get a user by username.
    
    Args:
        db: Database session
        username: Username to look up
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user.
    
    Args:
        db: Database session
        user: User creation data
        
    Returns:
        Created User object
        
    Raises:
        ResourceAlreadyExistsError: If username already exists
    """
    try:
        # Check if username exists
        if get_user_by_username(db, user.username):
            raise ResourceAlreadyExistsError("User", "username", user.username)
        
        # Hash password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        db_user = User(
            username=user.username,
            password_hash=hashed_password,
            full_name=user.full_name,
            role=user.role,
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    except ResourceAlreadyExistsError:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise APIError(
            status_code=500,
            detail="Error creating user",
            error_code="USER_CREATION_ERROR"
        )

def update_last_login(db: Session, user: User) -> None:
    """
    Update user's last login timestamp.
    
    Args:
        db: Database session
        user: User to update
    """
    try:
        user.last_login = datetime.utcnow()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating last login: {str(e)}")
        raise APIError(
            status_code=500,
            detail="Error updating last login",
            error_code="UPDATE_LOGIN_ERROR"
        )

def update_last_logout(db: Session, user: User) -> None:
    """
    Update user's last logout timestamp.
    
    Args:
        db: Database session
        user: User to update
    """
    try:
        user.last_login = None
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating last logout: {str(e)}")
        raise APIError(
            status_code=500,
            detail="Error updating last logout",
            error_code="UPDATE_LOGOUT_ERROR"
        )

def validate_user_credentials(db: Session, username: str, password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate user credentials and return status with error message if any.
    
    Args:
        db: Database session
        username: Username to validate
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        user = get_user_by_username(db, username)
        if not user:
            return False, "Incorrect username or password"
            
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return False, "Incorrect username or password"
            
        if not user.is_active:
            return False, "User account is inactive"
            
        return True, None
    except Exception as e:
        logger.error(f"Error validating credentials: {str(e)}")
        return False, "Error validating credentials"
