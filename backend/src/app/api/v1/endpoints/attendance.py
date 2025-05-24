from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

import src.utils.dependencies as deps
from src.app.crud import attendance as crud
from src.app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse
)
from src.utils.enums import AttendanceStatus

router = APIRouter()

@router.get("/", response_model=List[AttendanceResponse])
def get_attendances(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    status: Optional[AttendanceStatus] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get attendance records with optional filtering.
    """
    attendances, _ = crud.get_attendances(
        db=db,
        skip=skip,
        limit=limit,
        student_id=student_id,
        status=status,
        start_date=start_date,
        end_date=end_date
    )
    return attendances

@router.post("/", response_model=AttendanceResponse)
def create_attendance(
    *,
    db: Session = Depends(deps.get_db),
    attendance_in: AttendanceCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new attendance record.
    """
    return crud.create_attendance(db=db, attendance=attendance_in)

@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    *,
    db: Session = Depends(deps.get_db),
    attendance_id: int,
    attendance_in: AttendanceUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update attendance record.
    """
    attendance = crud.get_attendance(db=db, attendance_id=attendance_id)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return crud.update_attendance(db=db, attendance_id=attendance_id, attendance=attendance_in)

@router.delete("/{attendance_id}")
def delete_attendance(
    *,
    db: Session = Depends(deps.get_db),
    attendance_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete attendance record.
    """
    attendance = crud.get_attendance(db=db, attendance_id=attendance_id)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    if crud.delete_attendance(db=db, attendance_id=attendance_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete attendance record")

@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
def get_student_attendance(
    *,
    db: Session = Depends(deps.get_db),
    student_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get attendance records for a specific student.
    """
    return crud.get_student_attendance(
        db=db,
        student_id=student_id,
        start_date=start_date,
        end_date=end_date
    )

@router.get("/classroom/{classroom_id}", response_model=List[AttendanceResponse])
def get_class_attendance(
    *,
    db: Session = Depends(deps.get_db),
    classroom_id: int,
    date: date,
    current_user = Depends(deps.get_current_user),
):
    """
    Get attendance records for all students in a classroom on a specific date.
    """
    return crud.get_class_attendance(db=db, classroom_id=classroom_id, date=date)
