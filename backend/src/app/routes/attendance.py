# src/routes/attendance.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_teacher_role
from src.models import Attendance, Student, Class, AbsenceJustification
from src.schemas import (
    AttendanceCreate, AttendanceUpdate, AttendanceResponse, 
    AttendanceDetailResponse, AbsenceJustificationCreate,
    AbsenceJustificationResponse, AttendanceStatistics
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[AttendanceResponse])
async def read_attendances(
    skip: int = 0,
    limit: int = 100,
    class_id: Optional[int] = None,
    student_id: Optional[int] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    is_present: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Attendance)
    
    if class_id:
        query = query.filter(Attendance.class_id == class_id)
    
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    
    if date_from:
        query = query.filter(Attendance.date >= date_from)
    
    if date_to:
        query = query.filter(Attendance.date <= date_to)
    
    if is_present is not None:
        query = query.filter(Attendance.is_present == is_present)
    
    attendances = query.order_by(Attendance.date.desc()).offset(skip).limit(limit).all()
    return attendances

@router.get("/statistics", response_model=AttendanceStatistics)
async def get_attendance_statistics(
    class_id: Optional[int] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Attendance)
    
    if class_id:
        query = query.filter(Attendance.class_id == class_id)
    
    if date_from:
        query = query.filter(Attendance.date >= date_from)
    
    if date_to:
        query = query.filter(Attendance.date <= date_to)
    
    total = query.count()
    present = query.filter(Attendance.is_present == True).count()
    absent = total - present
    
    justified = db.query(AbsenceJustification).join(Attendance).filter(
        Attendance.is_present == False,
        AbsenceJustification.is_validated == True
    ).count()
    
    attendance_rate = (present / total) * 100 if total > 0 else 0
    
    return {
        "total_students": total,
        "present": present,
        "absent": absent,
        "justified": justified,
        "attendance_rate": attendance_rate
    }

@router.get("/{attendance_id}", response_model=AttendanceDetailResponse)
async def read_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if attendance is None:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    # Check if student exists
    student = db.query(Student).filter(Student.id == attendance.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if class exists
    class_ = db.query(Class).filter(Class.id == attendance.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if attendance record already exists for this student, class and date
    existing = db.query(Attendance).filter(
        Attendance.student_id == attendance.student_id,
        Attendance.class_id == attendance.class_id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance record already exists for this student, class and date"
        )
    
    db_attendance = Attendance(
        student_id=attendance.student_id,
        class_id=attendance.class_id,
        date=attendance.date,
        arrival_time=attendance.arrival_time,
        is_present=attendance.is_present,
        comment=attendance.comment,
        recorded_by=current_user.id  # Use the current user's ID
    )
    
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    
    return db_attendance

@router.put("/{attendance_id}", response_model=AttendanceResponse)
async def update_attendance(
    attendance_id: int,
    attendance: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if db_attendance is None:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    update_data = attendance.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_attendance, key, value)
    
    db.commit()
    db.refresh(db_attendance)
    
    return db_attendance

@router.post("/justification", response_model=AbsenceJustificationResponse)
async def create_absence_justification(
    justification: AbsenceJustificationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if attendance record exists and is an absence
    attendance = db.query(Attendance).filter(
        Attendance.id == justification.attendance_id,
        Attendance.is_present == False
    ).first()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Absence record not found"
        )
    
    # Check if justification already exists
    existing = db.query(AbsenceJustification).filter(
        AbsenceJustification.attendance_id == justification.attendance_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Justification already exists for this absence"
        )
    
    db_justification = AbsenceJustification(
        attendance_id=justification.attendance_id,
        reason=justification.reason,
        description=justification.description,
        document_url=justification.document_url,
        submission_date=justification.submission_date
    )
    
    db.add(db_justification)
    db.commit()
    db.refresh(db_justification)
    
    return db_justification