from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.app.models.grade import Grade
from src.app.models.student import Student
from src.app.models.subject import Subject
from src.app.schemas.grade import GradeCreate, GradeUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query

def get_grades(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    term: Optional[str] = None,
) -> Tuple[List[Grade], Dict[str, Any]]:
    """
    Get grades with optional filtering and pagination.
    Returns a tuple of (grades, pagination_meta).
    """
    try:
        query = db.query(Grade)
        
        if student_id:
            query = query.filter(Grade.student_id == student_id)
        
        if subject_id:
            query = query.filter(Grade.subject_id == subject_id)
        
        if term:
            query = query.filter(Grade.term == term)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving grades", original_error=e)

def get_grade(db: Session, grade_id: int) -> Grade:
    """Get a single grade by ID."""
    try:
        db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if db_grade is None:
            raise ResourceNotFoundError("Grade", grade_id)
        return db_grade
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving grade {grade_id}", original_error=e)

def validate_grade_data(db: Session, grade_data: GradeCreate | GradeUpdate) -> None:
    """Validate grade data before creation or update."""
    validation_errors = []
    
    if hasattr(grade_data, 'student_id') and grade_data.student_id is not None:
        if grade_data.student_id <= 0:
            validation_errors.append({
                "field": "student_id",
                "message": f"Invalid student_id: {grade_data.student_id}. Must be a positive integer."
            })
        else:
            student = db.query(Student).filter(Student.id == grade_data.student_id).first()
            if not student:
                validation_errors.append({
                    "field": "student_id",
                    "message": f"Student with ID {grade_data.student_id} does not exist."
                })
    
    if hasattr(grade_data, 'subject_id') and grade_data.subject_id is not None:
        if grade_data.subject_id <= 0:
            validation_errors.append({
                "field": "subject_id",
                "message": f"Invalid subject_id: {grade_data.subject_id}. Must be a positive integer."
            })
        else:
            subject = db.query(Subject).filter(Subject.id == grade_data.subject_id).first()
            if not subject:
                validation_errors.append({
                    "field": "subject_id",
                    "message": f"Subject with ID {grade_data.subject_id} does not exist."
                })
    
    if hasattr(grade_data, 'score') and grade_data.score is not None:
        if grade_data.score < 0 or grade_data.score > 100:
            validation_errors.append({
                "field": "score",
                "message": "Score must be between 0 and 100."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_grade(db: Session, grade: GradeCreate) -> Grade:
    """Create a new grade."""
    try:
        validate_grade_data(db, grade)
        
        db_grade = Grade(
            student_id=grade.student_id,
            subject_id=grade.subject_id,
            term=grade.term,
            score=grade.score,
            comment=grade.comment
        )
        
        db.add(db_grade)
        db.commit()
        db.refresh(db_grade)
        return db_grade
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating grade: {str(e)}")

def update_grade(db: Session, grade_id: int, grade: GradeUpdate) -> Grade:
    """Update an existing grade."""
    try:
        db_grade = get_grade(db, grade_id)
        validate_grade_data(db, grade)
        
        update_data = grade.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_grade, key, value)
        
        db.commit()
        db.refresh(db_grade)
        return db_grade
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating grade: {str(e)}")

def delete_grade(db: Session, grade_id: int) -> Dict[str, Any]:
    """Delete a grade."""
    try:
        db_grade = get_grade(db, grade_id)
        db.delete(db_grade)
        db.commit()
        return {"id": grade_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting grade: {str(e)}")

def get_student_grades(db: Session, student_id: int, term: Optional[str] = None) -> List[Grade]:
    """Get all grades for a specific student."""
    try:
        query = db.query(Grade).filter(Grade.student_id == student_id)
        if term:
            query = query.filter(Grade.term == term)
        return query.all()
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving grades for student {student_id}", original_error=e) 