from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Payment
from pydantic import BaseModel
from datetime import datetime
from utils import schemas, models
from typing import Optional, List
from datetime import date

router = APIRouter(
    tags=["Attendances"]
)

db_dependency = Depends(get_db)

@router.post("/attendance/", response_model=schemas.AttendanceResponse)
async def record_attendance(
    attendance: schemas.AttendanceBase,
    db: Session = Depends(get_db)
):
    # Check for existing attendance record
    existing = db.query(models.Attendance).filter(
        models.Attendance.student_id == attendance.student_id,
        models.Attendance.class_id == attendance.class_id,
        models.Attendance.attendance_date == attendance.attendance_date
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance record already exists for this student on this date"
        )
    
    db_attendance = models.Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.get("/attendance/class/{class_id}", response_model=List[schemas.AttendanceResponse])
async def get_class_attendance(
    class_id: int,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Attendance).filter(models.Attendance.class_id == class_id)
    if date_from:
        query = query.filter(models.Attendance.attendance_date >= date_from)
    if date_to:
        query = query.filter(models.Attendance.attendance_date <= date_to)
    return query.order_by(models.Attendance.attendance_date.desc()).all()