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
    registration_date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @validator('registration_date')
    def validate_registration_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise ValueError("registration_date must be in the format YYYY-MM-DD HH:MM:SS")
        return v

class StudentResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    class_id: int
    birth_date: date
    registration_date: str 

router = APIRouter(
    tags=["Students"]
)

db_dependency = Depends(get_db)

@router.get("/api/students")
async def get_students(db: Session = db_dependency) -> list[StudentResponse]:
    """Get all students."""
    students = db.query(Student).all()
    print(students)
    # if not students:
    #     raise HTTPException(status_code=404, detail="No students found")
    return students
