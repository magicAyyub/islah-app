from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.level import Level
from src.app.schemas.level import LevelCreate, LevelUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_levels(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
) -> Tuple[List[Level], Dict[str, Any]]:
    """
    Get levels with optional filtering and pagination.
    Returns a tuple of (levels, pagination_meta).
    """
    try:
        query = db.query(Level)
        
        if name:
            query = query.filter(Level.name.ilike(f"%{name}%"))
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving levels", original_error=e)

def get_level(db: Session, level_id: int) -> Level:
    """Get a single level by ID."""
    try:
        db_level = db.query(Level).filter(Level.id == level_id).first()
        if db_level is None:
            raise ResourceNotFoundError("Level", level_id)
        return db_level
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving level {level_id}", original_error=e)

def validate_level_data(db: Session, level_data: LevelCreate | LevelUpdate) -> None:
    """Validate level data before creation or update."""
    validation_errors = []
    
    if hasattr(level_data, 'name') and level_data.name:
        existing_level = db.query(Level).filter(Level.name == level_data.name).first()
        if existing_level and (not hasattr(level_data, 'id') or existing_level.id != level_data.id):
            validation_errors.append({
                "field": "name",
                "message": f"Level name '{level_data.name}' already exists."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_level(db: Session, level: LevelCreate) -> Level:
    """Create a new level."""
    try:
        validate_level_data(db, level)
        
        db_level = Level(
            name=level.name
        )
        
        db.add(db_level)
        db.commit()
        db.refresh(db_level)
        return db_level
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating level: {str(e)}")

def update_level(db: Session, level_id: int, level: LevelUpdate) -> Level:
    """Update an existing level."""
    try:
        db_level = get_level(db, level_id)
        validate_level_data(db, level)
        
        update_data = level.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_level, key, value)
        
        db.commit()
        db.refresh(db_level)
        return db_level
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating level: {str(e)}")

def delete_level(db: Session, level_id: int) -> Dict[str, Any]:
    """Delete a level."""
    try:
        db_level = get_level(db, level_id)
        db.delete(db_level)
        db.commit()
        return {"id": level_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting level: {str(e)}") 