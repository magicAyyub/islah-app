# src/routes/students.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Student, Enrollment, Class
from src.schemas import StudentCreate, StudentUpdate, StudentResponse, StudentDetailResponse

router = APIRouter(
    prefix="/students",
    tags=["Students"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[StudentResponse])
async def read_students(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    class_id: Optional[int] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Student).filter(Student.is_active == is_active)
    
    if name:
        query = query.filter(
            (Student.first_name.ilike(f"%{name}%")) | 
            (Student.last_name.ilike(f"%{name}%"))
        )
    
    if class_id:
        query = query.join(Enrollment).join(Class).filter(
            Enrollment.class_id == class_id,
            Enrollment.status == "active"
        )
    
    students = query.offset(skip).limit(limit).all()
    return students

@router.get("/{student_id}", response_model=StudentDetailResponse)
async def read_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if external_id is provided and unique
    if student.external_id:
        existing = db.query(Student).filter(Student.external_id == student.external_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student with this external ID already exists"
            )
    
    db_student = Student(
        last_name=student.last_name,
        first_name=student.first_name,
        birth_date=student.birth_date,
        gender=student.gender,
        address=student.address,
        photo=student.photo,
        external_id=student.external_id,
        registration_date=student.registration_date
    )
    
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    
    return db_student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Instead of deleting, mark as inactive
    db_student.is_active = False
    db.commit()
    
    return None