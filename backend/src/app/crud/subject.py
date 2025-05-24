from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.subject import Subject
from src.app.schemas.subject import SubjectCreate, SubjectUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_subjects(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
) -> Tuple[List[Subject], Dict[str, Any]]:
    """
    Get subjects with optional filtering and pagination.
    Returns a tuple of (subjects, pagination_meta).
    """
    try:
        query = db.query(Subject)
        
        if name:
            query = query.filter(Subject.name.ilike(f"%{name}%"))
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving subjects", original_error=e)

def get_subject(db: Session, subject_id: int) -> Subject:
    """Get a single subject by ID."""
    try:
        db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if db_subject is None:
            raise ResourceNotFoundError("Subject", subject_id)
        return db_subject
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving subject {subject_id}", original_error=e)

def validate_subject_data(db: Session, subject_data: SubjectCreate | SubjectUpdate) -> None:
    """Validate subject data before creation or update."""
    validation_errors = []
    
    if hasattr(subject_data, 'name') and subject_data.name:
        existing_subject = db.query(Subject).filter(Subject.name == subject_data.name).first()
        if existing_subject and (not hasattr(subject_data, 'id') or existing_subject.id != subject_data.id):
            validation_errors.append({
                "field": "name",
                "message": f"Subject name '{subject_data.name}' already exists."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_subject(db: Session, subject: SubjectCreate) -> Subject:
    """Create a new subject."""
    try:
        validate_subject_data(db, subject)
        
        db_subject = Subject(
            name=subject.name
        )
        
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating subject: {str(e)}")

def update_subject(db: Session, subject_id: int, subject: SubjectUpdate) -> Subject:
    """Update an existing subject."""
    try:
        db_subject = get_subject(db, subject_id)
        validate_subject_data(db, subject)
        
        update_data = subject.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_subject, key, value)
        
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating subject: {str(e)}")

def delete_subject(db: Session, subject_id: int) -> Dict[str, Any]:
    """Delete a subject."""
    try:
        db_subject = get_subject(db, subject_id)
        db.delete(db_subject)
        db.commit()
        return {"id": subject_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting subject: {str(e)}") 