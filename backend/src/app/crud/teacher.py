from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.teacher import Teacher
from src.app.models.user import User
from src.app.schemas.teacher import TeacherCreate, TeacherUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_teachers(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
) -> Tuple[List[Teacher], Dict[str, Any]]:
    """
    Get teachers with optional filtering and pagination.
    Returns a tuple of (teachers, pagination_meta).
    """
    try:
        query = db.query(Teacher)
        
        if name:
            query = query.filter(
                (Teacher.first_name.ilike(f"%{name}%")) | 
                (Teacher.last_name.ilike(f"%{name}%"))
            )
        
        if email:
            query = query.filter(Teacher.email.ilike(f"%{email}%"))
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving teachers", original_error=e)

def get_teacher(db: Session, teacher_id: int) -> Teacher:
    """Get a single teacher by ID."""
    try:
        db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if db_teacher is None:
            raise ResourceNotFoundError("Teacher", teacher_id)
        return db_teacher
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving teacher {teacher_id}", original_error=e)

def validate_teacher_data(db: Session, teacher_data: TeacherCreate | TeacherUpdate) -> None:
    """Validate teacher data before creation or update."""
    validation_errors = []
    
    if hasattr(teacher_data, 'email') and teacher_data.email:
        existing_teacher = db.query(Teacher).filter(Teacher.email == teacher_data.email).first()
        if existing_teacher and (not hasattr(teacher_data, 'id') or existing_teacher.id != teacher_data.id):
            validation_errors.append({
                "field": "email",
                "message": f"Email {teacher_data.email} is already registered to another teacher."
            })
    
    if hasattr(teacher_data, 'user_id') and teacher_data.user_id is not None:
        if teacher_data.user_id <= 0:
            validation_errors.append({
                "field": "user_id",
                "message": f"Invalid user_id: {teacher_data.user_id}. Must be a positive integer or null."
            })
        else:
            user = db.query(User).filter(User.id == teacher_data.user_id).first()
            if not user:
                validation_errors.append({
                    "field": "user_id",
                    "message": f"User with ID {teacher_data.user_id} does not exist."
                })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_teacher(db: Session, teacher: TeacherCreate) -> Teacher:
    """Create a new teacher."""
    try:
        validate_teacher_data(db, teacher)
        
        db_teacher = Teacher(
            first_name=teacher.first_name,
            last_name=teacher.last_name,
            phone=teacher.phone,
            email=teacher.email,
            user_id=teacher.user_id
        )
        
        db.add(db_teacher)
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating teacher: {str(e)}")

def update_teacher(db: Session, teacher_id: int, teacher: TeacherUpdate) -> Teacher:
    """Update an existing teacher."""
    try:
        db_teacher = get_teacher(db, teacher_id)
        validate_teacher_data(db, teacher)
        
        update_data = teacher.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_teacher, key, value)
        
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating teacher: {str(e)}")

def delete_teacher(db: Session, teacher_id: int) -> Dict[str, Any]:
    """Delete a teacher."""
    try:
        db_teacher = get_teacher(db, teacher_id)
        db.delete(db_teacher)
        db.commit()
        return {"id": teacher_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting teacher: {str(e)}") 