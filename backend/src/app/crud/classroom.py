from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.classroom import Classroom
from src.app.models.level import Level
from src.app.models.teacher import Teacher
from src.app.schemas.classroom import ClassroomCreate, ClassroomUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_classrooms(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    label: Optional[str] = None,
    level_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
) -> Tuple[List[Classroom], Dict[str, Any]]:
    """
    Get classrooms with optional filtering and pagination.
    Returns a tuple of (classrooms, pagination_meta).
    """
    try:
        query = db.query(Classroom)
        
        if label:
            query = query.filter(Classroom.label.ilike(f"%{label}%"))
        
        if level_id:
            query = query.filter(Classroom.level_id == level_id)
        
        if teacher_id:
            query = query.filter(Classroom.teacher_id == teacher_id)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving classrooms", original_error=e)

def get_classroom(db: Session, classroom_id: int) -> Classroom:
    """Get a single classroom by ID."""
    try:
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if db_classroom is None:
            raise ResourceNotFoundError("Classroom", classroom_id)
        return db_classroom
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving classroom {classroom_id}", original_error=e)

def validate_classroom_data(db: Session, classroom_data: ClassroomCreate | ClassroomUpdate) -> None:
    """Validate classroom data before creation or update."""
    validation_errors = []
    
    if hasattr(classroom_data, 'level_id') and classroom_data.level_id is not None:
        if classroom_data.level_id <= 0:
            validation_errors.append({
                "field": "level_id",
                "message": f"Invalid level_id: {classroom_data.level_id}. Must be a positive integer."
            })
        else:
            level = db.query(Level).filter(Level.id == classroom_data.level_id).first()
            if not level:
                validation_errors.append({
                    "field": "level_id",
                    "message": f"Level with ID {classroom_data.level_id} does not exist."
                })
    
    if hasattr(classroom_data, 'teacher_id') and classroom_data.teacher_id is not None:
        if classroom_data.teacher_id <= 0:
            validation_errors.append({
                "field": "teacher_id",
                "message": f"Invalid teacher_id: {classroom_data.teacher_id}. Must be a positive integer."
            })
        else:
            teacher = db.query(Teacher).filter(Teacher.id == classroom_data.teacher_id).first()
            if not teacher:
                validation_errors.append({
                    "field": "teacher_id",
                    "message": f"Teacher with ID {classroom_data.teacher_id} does not exist."
                })
    
    if hasattr(classroom_data, 'capacity') and classroom_data.capacity is not None:
        if classroom_data.capacity <= 0:
            validation_errors.append({
                "field": "capacity",
                "message": "Classroom capacity must be greater than zero."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_classroom(db: Session, classroom: ClassroomCreate) -> Classroom:
    """Create a new classroom."""
    try:
        validate_classroom_data(db, classroom)
        
        db_classroom = Classroom(
            label=classroom.label,
            level_id=classroom.level_id,
            schedule=classroom.schedule,
            capacity=classroom.capacity,
            teacher_id=classroom.teacher_id
        )
        
        db.add(db_classroom)
        db.commit()
        db.refresh(db_classroom)
        return db_classroom
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating classroom: {str(e)}")

def update_classroom(db: Session, classroom_id: int, classroom: ClassroomUpdate) -> Classroom:
    """Update an existing classroom."""
    try:
        db_classroom = get_classroom(db, classroom_id)
        validate_classroom_data(db, classroom)
        
        update_data = classroom.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_classroom, key, value)
        
        db.commit()
        db.refresh(db_classroom)
        return db_classroom
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating classroom: {str(e)}")

def delete_classroom(db: Session, classroom_id: int) -> Dict[str, Any]:
    """Delete a classroom."""
    try:
        db_classroom = get_classroom(db, classroom_id)
        db.delete(db_classroom)
        db.commit()
        return {"id": classroom_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting classroom: {str(e)}")

def get_classroom_students(db: Session, classroom_id: int) -> List[Any]:
    """Get all students in a classroom."""
    try:
        classroom = get_classroom(db, classroom_id)
        return classroom.students
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving students for classroom {classroom_id}", original_error=e) 