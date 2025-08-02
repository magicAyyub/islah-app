from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import Optional
from datetime import date

from app.schemas.student import StudentCreate, StudentUpdate, Student
from app.services import student_service
from app.database.session import get_db
from app.api.pagination import PaginatedResponse, paginate_query, create_paginated_response
from app.api.search import StudentSearchFilters, apply_student_filters
from app.database.models import Student as StudentModel, User, Parent, Class
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=Student)
def create_student(
    student: StudentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    return student_service.create_student(db=db, student=student)

@router.get("/", response_model=PaginatedResponse[Student])
def get_students(
    # Pagination parameters
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    
    # Search parameters
    search: Optional[str] = Query(None, description="Search in student and parent names"),
    class_id: Optional[int] = Query(None, description="Filter by class ID"),
    academic_year: Optional[str] = Query(None, description="Filter by academic year"),
    registration_status: Optional[str] = Query(None, description="Filter by registration status"),
    gender: Optional[str] = Query(None, description="Filter by gender"),
    age_min: Optional[int] = Query(None, ge=0, le=100, description="Minimum age"),
    age_max: Optional[int] = Query(None, ge=0, le=100, description="Maximum age"),
    
    # Sorting
    sort_by: Optional[str] = Query("first_name", description="Sort by field"),
    sort_order: Optional[str] = Query("asc", pattern="^(asc|desc)$", description="Sort order"),
    
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """
    Get paginated list of students with search and filtering capabilities.
    """
    # Create search filters
    filters = StudentSearchFilters(
        search=search,
        class_id=class_id,
        academic_year=academic_year,
        registration_status=registration_status,
        gender=gender,
        age_min=age_min,
        age_max=age_max
    )
    
    # Start with base query using selectinload for relationships
    query = db.query(StudentModel).options(
        selectinload(StudentModel.parent),
        selectinload(StudentModel.__mapper__.relationships['class']),
        selectinload(StudentModel.flags)
    )
    
    # Apply search filters
    query = apply_student_filters(query, filters)
    
    # Apply sorting
    if sort_by and hasattr(StudentModel, sort_by):
        sort_column = getattr(StudentModel, sort_by)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    else:
        # Default sorting
        query = query.order_by(StudentModel.first_name.asc(), StudentModel.last_name.asc())
    
    # Apply pagination
    paginated_query, pagination_metadata = paginate_query(query, page, size)
    
    # Execute query and get results
    students = paginated_query.all()
    
    # Convert to response models
    student_responses = [Student.model_validate(student) for student in students]
    
    return create_paginated_response(student_responses, pagination_metadata)

@router.get("/{student_id}", response_model=Student)
def get_student(
    student_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    student = student_service.get_student(db=db, student_id=student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=Student)
def update_student(
    student_id: int,
    student_update: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Update an existing student"""
    return student_service.update_student(db=db, student_id=student_id, student_update=student_update)

@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Delete a student"""
    return student_service.delete_student(db=db, student_id=student_id)

@router.post("/{student_id}/expel")
def expel_student(
    student_id: int,
    reason: str = Query(..., description="Reason for expulsion"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """
    Expel a student - this completely removes the student and all related data from the system.
    This action is irreversible and should be used only in serious cases.
    """
    return student_service.expel_student(db=db, student_id=student_id, reason=reason, expelled_by=current_user.id)

@router.post("/{student_id}/flag")
def flag_student(
    student_id: int,
    flag_type: str = Query(..., description="Type of flag (payment_issue, bounced_check, late_payment, etc.)"),
    reason: str = Query(..., description="Reason for flagging"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """
    Flag a student for tracking purposes (payment issues, behavior, etc.)
    """
    return student_service.flag_student(db=db, student_id=student_id, flag_type=flag_type, reason=reason, flagged_by=current_user.id)

@router.delete("/{student_id}/flag")
def unflag_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Remove flag from student"""
    return student_service.unflag_student(db=db, student_id=student_id)
