from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, date
from typing import Dict, Any

from app.database.session import get_db
from app.database.models import Student, User, RegistrationStatus
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/students", response_model=Dict[str, Any])
def get_student_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get comprehensive student statistics
    """
    # Total students
    total_students = db.query(Student).count()
    
    # Students registered this month
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    new_this_month = db.query(Student).filter(
        extract('month', Student.registration_date) == current_month,
        extract('year', Student.registration_date) == current_year
    ).count()
    
    # Students by status - use enum values
    pending_students = db.query(Student).filter(
        Student.registration_status == RegistrationStatus.PENDING
    ).count()
    
    confirmed_students = db.query(Student).filter(
        Student.registration_status == RegistrationStatus.CONFIRMED
    ).count()
    
    cancelled_students = db.query(Student).filter(
        Student.registration_status == RegistrationStatus.CANCELLED
    ).count()
    
    # Students by gender
    male_students = db.query(Student).filter(Student.gender == 'M').count()
    female_students = db.query(Student).filter(Student.gender == 'F').count()
    
    # For "present today" - since we don't have attendance tracking yet,
    # we'll return 0 or could estimate based on confirmed students
    present_today = 0  # Will be implemented when attendance feature is added
    
    return {
        "total_students": total_students,
        "new_this_month": new_this_month,
        "pending": pending_students,
        "confirmed": confirmed_students,
        "cancelled": cancelled_students,
        "present_today": present_today,
        "male_students": male_students,
        "female_students": female_students,
        "stats_date": datetime.now().isoformat()
    }
