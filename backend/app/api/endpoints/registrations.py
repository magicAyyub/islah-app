from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.registration import RegistrationCreate, RegistrationResponse
from app.services import registration_service
from app.database.session import get_db

router = APIRouter()

@router.post("/register", response_model=RegistrationResponse)
def register_student(registration: RegistrationCreate, db: Session = Depends(get_db)):
    """Register a new student (creates parent if needed)"""
    return registration_service.register_student(db=db, registration=registration)

@router.get("/registrations", response_model=List[RegistrationResponse])
def get_registrations(
    status: Optional[str] = None,
    academic_year: Optional[str] = None,
    class_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all registrations with optional filters"""
    return registration_service.get_registrations(
        db=db, status=status, academic_year=academic_year, class_id=class_id
    )

@router.put("/registrations/{student_id}/confirm")
def confirm_registration(student_id: int, db: Session = Depends(get_db)):
    """Confirm student registration after payment"""
    return registration_service.confirm_registration(db=db, student_id=student_id)

@router.get("/classes/available")
def get_available_classes(academic_year: str, db: Session = Depends(get_db)):
    """Get classes with available spots"""
    return registration_service.get_available_classes(db=db, academic_year=academic_year)
