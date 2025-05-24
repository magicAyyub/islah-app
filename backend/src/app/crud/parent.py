from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.parent import Parent
from src.app.models.user import User
from src.app.schemas.parent import ParentCreate, ParentUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_parents(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
) -> Tuple[List[Parent], Dict[str, Any]]:
    """
    Get parents with optional filtering and pagination.
    Returns a tuple of (parents, pagination_meta).
    """
    try:
        query = db.query(Parent)
        
        if name:
            query = query.filter(
                (Parent.first_name.ilike(f"%{name}%")) | 
                (Parent.last_name.ilike(f"%{name}%"))
            )
        
        if email:
            query = query.filter(Parent.email.ilike(f"%{email}%"))
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving parents", original_error=e)

def get_parent(db: Session, parent_id: int) -> Parent:
    """Get a single parent by ID."""
    try:
        db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
        if db_parent is None:
            raise ResourceNotFoundError("Parent", parent_id)
        return db_parent
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving parent {parent_id}", original_error=e)

def validate_parent_data(db: Session, parent_data: ParentCreate | ParentUpdate) -> None:
    """Validate parent data before creation or update."""
    validation_errors = []
    
    if hasattr(parent_data, 'email') and parent_data.email:
        existing_parent = db.query(Parent).filter(Parent.email == parent_data.email).first()
        if existing_parent and (not hasattr(parent_data, 'id') or existing_parent.id != parent_data.id):
            validation_errors.append({
                "field": "email",
                "message": f"Email {parent_data.email} is already registered to another parent."
            })
    
    if hasattr(parent_data, 'user_id') and parent_data.user_id is not None:
        if parent_data.user_id <= 0:
            validation_errors.append({
                "field": "user_id",
                "message": f"Invalid user_id: {parent_data.user_id}. Must be a positive integer or null."
            })
        else:
            user = db.query(User).filter(User.id == parent_data.user_id).first()
            if not user:
                validation_errors.append({
                    "field": "user_id",
                    "message": f"User with ID {parent_data.user_id} does not exist."
                })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_parent(db: Session, parent: ParentCreate) -> Parent:
    """Create a new parent."""
    try:
        validate_parent_data(db, parent)
        
        db_parent = Parent(
            first_name=parent.first_name,
            last_name=parent.last_name,
            phone=parent.phone,
            email=parent.email,
            address=parent.address,
            user_id=parent.user_id
        )
        
        db.add(db_parent)
        db.commit()
        db.refresh(db_parent)
        return db_parent
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating parent: {str(e)}")

def update_parent(db: Session, parent_id: int, parent: ParentUpdate) -> Parent:
    """Update an existing parent."""
    try:
        db_parent = get_parent(db, parent_id)
        validate_parent_data(db, parent)
        
        update_data = parent.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_parent, key, value)
        
        db.commit()
        db.refresh(db_parent)
        return db_parent
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating parent: {str(e)}")

def delete_parent(db: Session, parent_id: int) -> Dict[str, Any]:
    """Delete a parent."""
    try:
        db_parent = get_parent(db, parent_id)
        db.delete(db_parent)
        db.commit()
        return {"id": parent_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting parent: {str(e)}") 