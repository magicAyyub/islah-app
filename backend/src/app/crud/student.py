from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.student import Student
from src.app.models.parent import Parent
from src.app.models.classroom import Classroom
from src.app.schemas.student import StudentCreate, StudentUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_students(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    class_id: Optional[int] = None,
    status: Optional[str] = None,
) -> Tuple[List[Student], Dict[str, Any]]:
    """
    Get students with optional filtering and pagination.
    Returns a tuple of (students, pagination_meta).
    """
    try:
        query = db.query(Student)
        
        if name:
            query = query.filter(
                (Student.first_name.ilike(f"%{name}%")) | 
                (Student.last_name.ilike(f"%{name}%"))
            )
        
        if class_id:
            query = query.filter(Student.current_class_id == class_id)
        
        if status:
            query = query.filter(Student.status == status)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving students", original_error=e)

def get_student(db: Session, student_id: int) -> Student:
    """Get a single student by ID."""
    try:
        db_student = db.query(Student).filter(Student.id == student_id).first()
        if db_student is None:
            raise ResourceNotFoundError("Student", student_id)
        return db_student
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving student {student_id}", original_error=e)

def validate_student_data(db: Session, student_data: StudentCreate | StudentUpdate) -> None:
    """Validate student data before creation or update."""
    validation_errors = []
    
    if hasattr(student_data, 'parent_id') and student_data.parent_id is not None:
        if student_data.parent_id <= 0:
            validation_errors.append({
                "field": "parent_id",
                "message": f"Invalid parent_id: {student_data.parent_id}. Must be a positive integer or null."
            })
        else:
            parent = db.query(Parent).filter(Parent.id == student_data.parent_id).first()
            if not parent:
                validation_errors.append({
                    "field": "parent_id",
                    "message": f"Parent with ID {student_data.parent_id} does not exist."
                })
    
    if hasattr(student_data, 'current_class_id') and student_data.current_class_id is not None:
        if student_data.current_class_id <= 0:
            validation_errors.append({
                "field": "current_class_id",
                "message": f"Invalid current_class_id: {student_data.current_class_id}. Must be a positive integer or null."
            })
        else:
            classroom = db.query(Classroom).filter(Classroom.id == student_data.current_class_id).first()
            if not classroom:
                validation_errors.append({
                    "field": "current_class_id",
                    "message": f"Classroom with ID {student_data.current_class_id} does not exist."
                })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_student(db: Session, student: StudentCreate) -> Student:
    """Create a new student."""
    try:
        validate_student_data(db, student)
        
        db_student = Student(
            first_name=student.first_name,
            last_name=student.last_name,
            birth_date=student.birth_date,
            gender=student.gender,
            status=student.status,
            enrolled_at=student.enrolled_at,
            parent_id=student.parent_id,
            current_class_id=student.current_class_id
        )
        
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating student: {str(e)}")

def update_student(db: Session, student_id: int, student: StudentUpdate) -> Student:
    """Update an existing student."""
    try:
        db_student = get_student(db, student_id)
        validate_student_data(db, student)
        
        update_data = student.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_student, key, value)
        
        db.commit()
        db.refresh(db_student)
        return db_student
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating student: {str(e)}")

def delete_student(db: Session, student_id: int) -> Dict[str, Any]:
    """Delete a student."""
    try:
        db_student = get_student(db, student_id)
        db.delete(db_student)
        db.commit()
        return {"id": student_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting student: {str(e)}") 