from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

from src.app.models.attendance import Attendance
from src.app.models.student import Student
from src.app.schemas.attendance import AttendanceCreate, AttendanceUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query
from src.utils.enums import AttendanceStatus

def get_attendances(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    status: Optional[AttendanceStatus] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Tuple[List[Attendance], Dict[str, Any]]:
    """
    Get attendances with optional filtering and pagination.
    Returns a tuple of (attendances, pagination_meta).
    """
    try:
        query = db.query(Attendance)
        
        if student_id:
            query = query.filter(Attendance.student_id == student_id)
        
        if status:
            query = query.filter(Attendance.status == status)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving attendances", original_error=e)

def get_attendance(db: Session, attendance_id: int) -> Attendance:
    """Get a single attendance by ID."""
    try:
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if db_attendance is None:
            raise ResourceNotFoundError("Attendance", attendance_id)
        return db_attendance
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving attendance {attendance_id}", original_error=e)

def validate_attendance_data(db: Session, attendance_data: AttendanceCreate | AttendanceUpdate) -> None:
    """Validate attendance data before creation or update."""
    validation_errors = []
    
    if hasattr(attendance_data, 'student_id') and attendance_data.student_id is not None:
        if attendance_data.student_id <= 0:
            validation_errors.append({
                "field": "student_id",
                "message": f"Invalid student_id: {attendance_data.student_id}. Must be a positive integer."
            })
        else:
            student = db.query(Student).filter(Student.id == attendance_data.student_id).first()
            if not student:
                validation_errors.append({
                    "field": "student_id",
                    "message": f"Student with ID {attendance_data.student_id} does not exist."
                })
    
    if hasattr(attendance_data, 'date') and attendance_data.date is not None:
        if attendance_data.date > date.today():
            validation_errors.append({
                "field": "date",
                "message": "Attendance date cannot be in the future."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_attendance(db: Session, attendance: AttendanceCreate) -> Attendance:
    """Create a new attendance record."""
    try:
        validate_attendance_data(db, attendance)
        
        db_attendance = Attendance(
            student_id=attendance.student_id,
            date=attendance.date,
            status=attendance.status if hasattr(attendance, 'status') else AttendanceStatus.PRESENT
        )
        
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating attendance: {str(e)}")

def update_attendance(db: Session, attendance_id: int, attendance: AttendanceUpdate) -> Attendance:
    """Update an existing attendance record."""
    try:
        db_attendance = get_attendance(db, attendance_id)
        validate_attendance_data(db, attendance)
        
        update_data = attendance.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_attendance, key, value)
        
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating attendance: {str(e)}")

def delete_attendance(db: Session, attendance_id: int) -> Dict[str, Any]:
    """Delete an attendance record."""
    try:
        db_attendance = get_attendance(db, attendance_id)
        db.delete(db_attendance)
        db.commit()
        return {"id": attendance_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting attendance: {str(e)}")

def get_student_attendance(
    db: Session,
    student_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> List[Attendance]:
    """Get attendance records for a specific student."""
    try:
        query = db.query(Attendance).filter(Attendance.student_id == student_id)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        return query.order_by(Attendance.date.desc()).all()
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving attendance for student {student_id}", original_error=e)

def get_class_attendance(
    db: Session,
    classroom_id: int,
    date: date
) -> List[Attendance]:
    """Get attendance records for all students in a classroom on a specific date."""
    try:
        return db.query(Attendance).join(Student).filter(
            Student.current_class_id == classroom_id,
            Attendance.date == date
        ).all()
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving attendance for classroom {classroom_id}", original_error=e) 