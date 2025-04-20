# src/routes/attendances.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Optional, Any
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_teacher_role
from src.utils.pagination import get_pagination_meta
from src.models import Attendance, User, Student
from src.schemas import AttendanceCreate, AttendanceUpdate, AttendanceResponse, AttendanceDetailResponse
from src.utils.error_handlers import (
    ResourceNotFoundError,
    ForeignKeyViolationError,
    ValidationError,
    DatabaseError
)
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/attendances",
    tags=["Attendances"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Attendance not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[AttendanceResponse],
    summary="Get all attendances",
    description="Retrieve a list of all attendances with optional filtering and pagination"
)
async def read_attendances(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    student_id: Optional[int] = Query(None, description="Filter by student ID"),
    status: Optional[str] = Query(None, description="Filter by attendance status"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Attendance)
        
        # Apply filters
        if student_id:
            query = query.filter(Attendance.student_id == student_id)
        
        if status:
            query = query.filter(Attendance.status == status)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        attendances = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        return PaginatedResponse(
            success=True,
            data=attendances,
            message=f"Retrieved {len(attendances)} attendance records",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving attendance records", original_error=str(e))

@router.get(
    "/count", 
    response_model=APIResponse[int],
    summary="Count attendance records",
    description="Get the total number of attendance records"
)
async def count_attendances(
    student_id: Optional[int] = Query(None, description="Filter by student ID"),
    status: Optional[str] = Query(None, description="Filter by attendance status"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Attendance)
        
        # Apply filters
        if student_id:
            query = query.filter(Attendance.student_id == student_id)
        
        if status:
            query = query.filter(Attendance.status == status)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            query = query.filter(Attendance.date <= end_date)
            
        total_attendance = query.count()
        return APIResponse(
            success=True,
            data=total_attendance,
            message="Total number of attendance records"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error counting attendance records", original_error=str(e))

@router.get(
    "/{attendance_id}", 
    response_model=APIResponse[AttendanceDetailResponse],
    summary="Get attendance by ID",
    description="Retrieve detailed information about a specific attendance record"
)
async def read_attendance(
    attendance_id: int = Path(..., ge=1, description="The ID of the attendance record to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if db_attendance is None:
            raise ResourceNotFoundError("Attendance", attendance_id)
        
        return APIResponse(
            success=True,
            data=db_attendance,
            message=f"Retrieved attendance record {attendance_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving attendance record {attendance_id}", original_error=str(e))

@router.post(
    "/", 
    response_model=APIResponse[AttendanceResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new attendance record",
    description="Create a new attendance record with the provided details"
)
async def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    try:
        # Validate student exists
        student = db.query(Student).filter(Student.id == attendance.student_id).first()
        if not student:
            raise ForeignKeyViolationError(
                resource_type="Attendance",
                field="student_id",
                value=attendance.student_id,
                referenced_resource="Student"
            )
        
        # Check if attendance record for this student on this date already exists
        existing_attendance = db.query(Attendance).filter(
            Attendance.student_id == attendance.student_id,
            Attendance.date == attendance.date
        ).first()
        
        if existing_attendance:
            raise ValidationError(f"Attendance record for student {attendance.student_id} on {attendance.date} already exists")
        
        # Create attendance record
        db_attendance = Attendance(
            student_id=attendance.student_id,
            date=attendance.date,
            status=attendance.status,
            notes=attendance.notes if hasattr(attendance, 'notes') else None
        )
        
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        
        return APIResponse(
            success=True,
            data=db_attendance,
            message=f"Attendance record for student {attendance.student_id} on {attendance.date} created successfully"
        )
    except ForeignKeyViolationError as e:
        raise e
    except ValidationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating attendance record", original_error=str(e))

@router.put(
    "/{attendance_id}", 
    response_model=APIResponse[AttendanceResponse],
    summary="Update an attendance record",
    description="Update an existing attendance record with the provided details"
)
async def update_attendance(
    attendance_id: int = Path(..., ge=1, description="The ID of the attendance record to update"),
    attendance: AttendanceUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    try:
        # Check if attendance exists
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if db_attendance is None:
            raise ResourceNotFoundError("Attendance", attendance_id)
        
        # Validate student exists if student_id is being updated
        if hasattr(attendance, 'student_id') and attendance.student_id is not None:
            student = db.query(Student).filter(Student.id == attendance.student_id).first()
            if not student:
                raise ForeignKeyViolationError(
                    resource_type="Attendance",
                    field="student_id",
                    value=attendance.student_id,
                    referenced_resource="Student"
                )
        
        # Update attendance
        update_data = attendance.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_attendance, key, value)
        
        db.commit()
        db.refresh(db_attendance)
        
        return APIResponse(
            success=True,
            data=db_attendance,
            message=f"Attendance record {attendance_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ForeignKeyViolationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating attendance record {attendance_id}", original_error=str(e))

@router.delete(
    "/{attendance_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete an attendance record",
    description="Delete an attendance record by ID"
)
async def delete_attendance(
    attendance_id: int = Path(..., ge=1, description="The ID of the attendance record to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    try:
        # Check if attendance exists
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if db_attendance is None:
            raise ResourceNotFoundError("Attendance", attendance_id)
        
        # Delete attendance
        db.delete(db_attendance)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": attendance_id},
            message=f"Attendance record {attendance_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting attendance record {attendance_id}", original_error=str(e))

@router.get(
    "/students/{student_id}/summary",
    response_model=APIResponse[Dict[str, Any]],
    summary="Get attendance summary for a student",
    description="Get attendance summary statistics for a specific student"
)
async def get_student_attendance_summary(
    student_id: int = Path(..., ge=1, description="The ID of the student"),
    start_date: Optional[date] = Query(None, description="Start date for summary"),
    end_date: Optional[date] = Query(None, description="End date for summary"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if student exists
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ResourceNotFoundError("Student", student_id)
        
        # Build the query
        query = db.query(Attendance).filter(Attendance.student_id == student_id)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        # Get all attendance records
        attendances = query.all()
        
        # Calculate summary
        total = len(attendances)
        present = sum(1 for a in attendances if a.status == "present")
        absent = sum(1 for a in attendances if a.status == "absent")
        late = sum(1 for a in attendances if a.status == "late")
        excused = sum(1 for a in attendances if a.status == "excused")
        
        summary = {
            "student_id": student_id,
            "student_name": f"{student.first_name} {student.last_name}",
            "total_records": total,
            "present": present,
            "absent": absent,
            "late": late,
            "excused": excused,
            "attendance_rate": round(present / total * 100, 2) if total > 0 else 0
        }
        
        return APIResponse(
            success=True,
            data=summary,
            message=f"Attendance summary for student {student_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving attendance summary for student {student_id}", original_error=str(e))
