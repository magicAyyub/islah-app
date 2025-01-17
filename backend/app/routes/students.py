from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from pydantic import BaseModel
from datetime import date, datetime
from typing import List
from utils import schemas, models
from sqlalchemy.orm import Session
from utils.database import get_db
from typing import List, Optional



router = APIRouter(
    tags=["Students"]
)

db_dependency = Depends(get_db)

@router.get("/students/", response_model=List[schemas.StudentResponse])
async def get_students(
    skip: int = 0,
    limit: int = 100,
    active: Optional[bool] = None,
    class_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)
    if active is not None:
        query = query.filter(models.Student.active == active)
    if class_id:
        query = query.filter(models.Student.class_id == class_id)
    return query.offset(skip).limit(limit).all()

@router.get("/students/{student_id}", response_model=schemas.StudentWithDetails)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/students/", response_model=schemas.StudentResponse)
async def create_student(student: schemas.StudentBase, db: Session = Depends(get_db)):
    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@router.put("/students/{student_id}", response_model=schemas.StudentResponse)
async def update_student(student_id: int, student: schemas.StudentBase, db: Session = Depends(get_db)):
    student_obj = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student_obj:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(student_obj, key, value)
    db.commit()
    db.refresh(student_obj)
    return student_obj

@router.delete("/students/{student_id}")
async def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}
    
