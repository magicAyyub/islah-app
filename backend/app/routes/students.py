from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Student
from pydantic import BaseModel, validator
from datetime import date, datetime

class StudentModel(BaseModel):
    last_name: str
    first_name: str
    class_id: int
    birth_date: date
    registration_date: datetime = datetime.now() 


class StudentResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    class_id: int
    birth_date: date
    registration_date: datetime 

    class Config:
        from_attributes = True  # This enables ORM mode
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }

router = APIRouter(
    tags=["Students"]
)

db_dependency = Depends(get_db)

@router.get("/api/students")
async def get_students(db: Session = db_dependency) -> list[StudentResponse]:
    """Get all students."""
    students = db.query(Student).all()
    if students is None:
        raise HTTPException(status_code=404, detail="No students found")
    return students

@router.get("/api/students/{student_id}")
async def get_student(student_id: int, db: Session = db_dependency) -> StudentResponse:
    """Get a student by id."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/api/students")
async def create_student(student: StudentModel, db: Session = db_dependency) -> StudentResponse:
    """Create a student."""
    student = Student(**student.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.put("/api/students/{student_id}")
async def update_student(student_id: int, student: StudentModel, db: Session = db_dependency) -> StudentResponse:
    """Update a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        if key in student.dict():
            setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/api/students/{student_id}")
async def delete_student(student_id: int, db: Session = db_dependency) -> dict[str, str]:
    """Delete a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}
