from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...database.session import get_db
from ...database.models import User
from ...api.dependencies import get_current_user
from ...schemas.academic import (
    Subject, SubjectCreate, SubjectUpdate,
    Grade, GradeCreate, GradeUpdate, BulkGradeCreate,
    Attendance, AttendanceCreate, AttendanceUpdate, BulkAttendanceCreate,
    AttendanceStats, GradeStats
)
from ...services.academic_service import SubjectService, GradeService, AttendanceService

router = APIRouter()

# Subject endpoints
@router.post("/subjects/", response_model=Subject, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new subject. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can create subjects"
        )
    
    try:
        return SubjectService.create_subject(db, subject_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/subjects/", response_model=List[Subject])
def get_subjects(
    skip: int = Query(0, ge=0, description="Number of subjects to skip"),
    limit: int = Query(100, ge=1, le=200, description="Number of subjects to return"),
    academic_year: Optional[str] = Query(None, description="Filter by academic year"),
    class_id: Optional[int] = Query(None, description="Filter by class ID"),
    teacher_id: Optional[int] = Query(None, description="Filter by teacher ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all subjects with optional filtering."""
    return SubjectService.get_subjects(
        db, 
        skip=skip, 
        limit=limit,
        academic_year=academic_year,
        class_id=class_id,
        teacher_id=teacher_id
    )

@router.get("/subjects/{subject_id}", response_model=Subject)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific subject by ID."""
    subject = SubjectService.get_subject(db, subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    return subject

@router.put("/subjects/{subject_id}", response_model=Subject)
def update_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a subject. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can update subjects"
        )
    
    subject = SubjectService.update_subject(db, subject_id, subject_data)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    return subject

@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a subject. Requires admin role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete subjects"
        )
    
    try:
        if not SubjectService.delete_subject(db, subject_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subject not found"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Grade endpoints
@router.post("/grades/", response_model=Grade, status_code=status.HTTP_201_CREATED)
def create_grade(
    grade_data: GradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new grade. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can create grades"
        )
    
    try:
        return GradeService.create_grade(db, grade_data, current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/grades/bulk", response_model=List[Grade], status_code=status.HTTP_201_CREATED)
def create_bulk_grades(
    bulk_data: BulkGradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create multiple grades at once. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can create grades"
        )
    
    try:
        return GradeService.create_bulk_grades(db, bulk_data, current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/grades/{grade_id}", response_model=Grade)
def get_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific grade by ID."""
    grade = GradeService.get_grade(db, grade_id)
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )
    return grade

@router.get("/students/{student_id}/grades", response_model=List[Grade])
def get_student_grades(
    student_id: int,
    subject_id: Optional[int] = Query(None, description="Filter by subject ID"),
    academic_year: Optional[str] = Query(None, description="Filter by academic year"),
    academic_period: Optional[str] = Query(None, description="Filter by academic period"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get grades for a specific student."""
    return GradeService.get_student_grades(
        db, 
        student_id,
        subject_id=subject_id,
        academic_year=academic_year,
        academic_period=academic_period
    )

@router.get("/classes/{class_id}/grades", response_model=List[Grade])
def get_class_grades(
    class_id: int,
    subject_id: Optional[int] = Query(None, description="Filter by subject ID"),
    academic_period: Optional[str] = Query(None, description="Filter by academic period"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get grades for all students in a class."""
    return GradeService.get_class_grades(
        db, 
        class_id,
        subject_id=subject_id,
        academic_period=academic_period
    )

@router.put("/grades/{grade_id}", response_model=Grade)
def update_grade(
    grade_id: int,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a grade. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can update grades"
        )
    
    grade = GradeService.update_grade(db, grade_id, grade_data)
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )
    return grade

@router.delete("/grades/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a grade. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can delete grades"
        )
    
    if not GradeService.delete_grade(db, grade_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )

@router.get("/students/{student_id}/grade-stats", response_model=GradeStats)
def get_grade_statistics(
    student_id: int,
    subject_id: Optional[int] = Query(None, description="Filter by subject ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get grade statistics for a student."""
    return GradeService.get_grade_statistics(db, student_id, subject_id)

# Attendance endpoints
@router.post("/attendance/", response_model=Attendance, status_code=status.HTTP_201_CREATED)
def create_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new attendance record. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can record attendance"
        )
    
    try:
        return AttendanceService.create_attendance(db, attendance_data, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/attendance/bulk", response_model=List[Attendance], status_code=status.HTTP_201_CREATED)
def create_bulk_attendance(
    bulk_data: BulkAttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create attendance records for multiple students. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can record attendance"
        )
    
    try:
        return AttendanceService.create_bulk_attendance(db, bulk_data, current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/attendance/{attendance_id}", response_model=Attendance)
def get_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific attendance record by ID."""
    attendance = AttendanceService.get_attendance(db, attendance_id)
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    return attendance

@router.get("/students/{student_id}/attendance", response_model=List[Attendance])
def get_student_attendance(
    student_id: int,
    start_date: Optional[date] = Query(None, description="Start date for attendance records"),
    end_date: Optional[date] = Query(None, description="End date for attendance records"),
    class_id: Optional[int] = Query(None, description="Filter by class ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance records for a specific student."""
    return AttendanceService.get_student_attendance(
        db, 
        student_id,
        start_date=start_date,
        end_date=end_date,
        class_id=class_id
    )

@router.get("/classes/{class_id}/attendance", response_model=List[Attendance])
def get_class_attendance(
    class_id: int,
    attendance_date: date = Query(..., description="Date to get attendance for"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance for all students in a class on a specific date."""
    return AttendanceService.get_class_attendance(db, class_id, attendance_date)

@router.put("/attendance/{attendance_id}", response_model=Attendance)
def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an attendance record. Requires admin or teacher role."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and teachers can update attendance"
        )
    
    attendance = AttendanceService.update_attendance(db, attendance_id, attendance_data)
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    return attendance

@router.get("/students/{student_id}/attendance-stats", response_model=AttendanceStats)
def get_attendance_statistics(
    student_id: int,
    start_date: Optional[date] = Query(None, description="Start date for statistics"),
    end_date: Optional[date] = Query(None, description="End date for statistics"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance statistics for a student."""
    return AttendanceService.get_attendance_statistics(
        db, 
        student_id,
        start_date=start_date,
        end_date=end_date
    )
