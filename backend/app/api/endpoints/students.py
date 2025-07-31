from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.student import StudentCreate, Student
from app.services import student_service
from app.database.session import get_db

router = APIRouter()

@router.post("/", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    return student_service.create_student(db=db, student=student)
