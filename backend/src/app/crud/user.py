from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

from src.app.models.user import User
from src.app.schemas.user import UserCreate, UserUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query
from src.utils.enums import UserRole

def get_users(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    username: Optional[str] = None,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
) -> Tuple[List[User], Dict[str, Any]]:
    """
    Get users with optional filtering and pagination.
    Returns a tuple of (users, pagination_meta).
    """
    try:
        query = db.query(User)
        
        if username:
            query = query.filter(User.username.ilike(f"%{username}%"))
        
        if role:
            query = query.filter(User.role == role)
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving users", original_error=e)

def get_user(db: Session, user_id: int) -> User:
    """Get a single user by ID."""
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise ResourceNotFoundError("User", user_id)
        return db_user
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving user {user_id}", original_error=e)

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get a user by username."""
    try:
        return db.query(User).filter(User.username == username).first()
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving user with username {username}", original_error=e)

def validate_user_data(db: Session, user_data: UserCreate | UserUpdate) -> None:
    """Validate user data before creation or update."""
    validation_errors = []
    
    if hasattr(user_data, 'username') and user_data.username:
        existing_user = db.query(User).filter(User.username == user_data.username).first()
        if existing_user and (not hasattr(user_data, 'id') or existing_user.id != user_data.id):
            validation_errors.append({
                "field": "username",
                "message": f"Username '{user_data.username}' is already taken."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user."""
    try:
        validate_user_data(db, user)
        
        db_user = User(
            username=user.username,
            password_hash=user.password_hash,  # Note: Password should be hashed before this point
            role=user.role,
            full_name=user.full_name,
            is_active=user.is_active if hasattr(user, 'is_active') else True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating user: {str(e)}")

def update_user(db: Session, user_id: int, user: UserUpdate) -> User:
    """Update an existing user."""
    try:
        db_user = get_user(db, user_id)
        validate_user_data(db, user)
        
        update_data = user.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating user: {str(e)}")

def delete_user(db: Session, user_id: int) -> Dict[str, Any]:
    """Delete a user."""
    try:
        db_user = get_user(db, user_id)
        db.delete(db_user)
        db.commit()
        return {"id": user_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting user: {str(e)}")

def update_last_login(db: Session, user_id: int) -> User:
    """Update the last login timestamp for a user."""
    try:
        db_user = get_user(db, user_id)
        db_user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(db_user)
        return db_user
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating last login: {str(e)}") 