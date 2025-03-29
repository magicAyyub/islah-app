# src/routes/enrollments.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Enrollment, Student, Class
from src.schemas import (
    EnrollmentCreate, EnrollmentUpdate, EnrollmentResponse, 
    EnrollmentDetailResponse
)

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[EnrollmentResponse])
async def read_enrollments(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    class_id: Optional[int] = None,
    status: Optional[str] = None,
    school_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Enrollment)
    
    if student_id:
        query = query.filter(Enrollment.student_id == student_id)
    
    if class_id:
        query = query.filter(Enrollment.class_id == class_id)
    
    if status:
        query = query.filter(Enrollment.status == status)
    
    if school_year:
        query = query.filter(Enrollment.school_year == school_year)
    
    enrollments = query.offset(skip).limit(limit).all()
    return enrollments

@router.get("/{enrollment_id}", response_model=EnrollmentDetailResponse)
async def read_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@router.post("/", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if student exists
    student = db.query(Student).filter(Student.id == enrollment.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if class exists
    class_ = db.query(Class).filter(Class.id == enrollment.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if enrollment already exists for this student and class in this school year
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == enrollment.student_id,
        Enrollment.class_id == enrollment.class_id,
        Enrollment.school_year == enrollment.school_year
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student is already enrolled in this class for this school year"
        )
    
    # Check if class has reached its capacity
    active_enrollments = db.query(Enrollment).filter(
        Enrollment.class_id == enrollment.class_id,
        Enrollment.status == "active",
        Enrollment.school_year == enrollment.school_year
    ).count()
    
    if active_enrollments >= class_.max_capacity and enrollment.status == "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class has reached its maximum capacity"
        )
    
    db_enrollment = Enrollment(
        student_id=enrollment.student_id,
        class_id=enrollment.class_id,
        enrollment_date=enrollment.enrollment_date or date.today(),
        status=enrollment.status,
        school_year=enrollment.school_year,
        notes=enrollment.notes
    )
    
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    
    return db_enrollment

@router.put("/{enrollment_id}", response_model=EnrollmentResponse)
async def update_enrollment(
    enrollment_id: int,
    enrollment: EnrollmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    update_data = enrollment.dict(exclude_unset=True)
    
    # If status is changing to "active", check class capacity
    if update_data.get("status") == "active" and db_enrollment.status != "active":
        class_ = db.query(Class).filter(Class.id == db_enrollment.class_id).first()
        active_enrollments = db.query(Enrollment).filter(
            Enrollment.class_id == db_enrollment.class_id,
            Enrollment.status == "active",
            Enrollment.school_year == db_enrollment.school_year
        ).count()
        
        if active_enrollments >= class_.max_capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Class has reached its maximum capacity"
            )
    
    for key, value in update_data.items():
        setattr(db_enrollment, key, value)
    
    db.commit()
    db.refresh(db_enrollment)
    
    return db_enrollment

@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Instead of deleting, change status to "cancelled"
    db_enrollment.status = "cancelled"
    db.commit()
    
    return None