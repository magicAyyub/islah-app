from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils import schemas, models
from typing import List, Optional
from datetime import date

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.post("/", response_model=schemas.StudentResponse)
def create_student(student_data: schemas.StudentCreate, db: Session = Depends(get_db)):
    # Verify all guardians exist
    for guardian_id in student_data.guardian_ids:
        guardian = db.query(models.Guardian).filter(models.Guardian.id == guardian_id).first()
        if not guardian:
            raise HTTPException(status_code=404, detail=f"Guardian with id {guardian_id} not found")

    # Create student without guardian_ids
    student_dict = student_data.dict(exclude={'guardian_ids'})
    db_student = models.Student(**student_dict)
    
    # Add guardians to the student
    guardians = db.query(models.Guardian).filter(models.Guardian.id.in_(student_data.guardian_ids)).all()
    db_student.guardians = guardians

    db.add(db_student)
    try:
        db.commit()
        db.refresh(db_student)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_student

@router.get("/", response_model=List[schemas.StudentResponse])
def get_students(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    gender: Optional[str] = None,
    guardian_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)
    
    if search:
        query = query.filter(
            (models.Student.first_name.ilike(f"%{search}%")) |
            (models.Student.last_name.ilike(f"%{search}%"))
        )
    if gender:
        query = query.filter(models.Student.gender == gender)
    if guardian_id:
        query = query.join(models.Student.guardians).filter(models.Guardian.id == guardian_id)
        
    return query.offset(skip).limit(limit).all()

@router.get("/{student_id}", response_model=schemas.StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student(
    student_id: int,
    student_data: schemas.StudentUpdate,
    db: Session = Depends(get_db)
):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    update_data = student_data.dict(exclude_unset=True)
    
    # Handle guardian updates separately
    if 'guardian_ids' in update_data:
        guardian_ids = update_data.pop('guardian_ids')
        # Verify all guardians exist
        guardians = db.query(models.Guardian).filter(models.Guardian.id.in_(guardian_ids)).all()
        if len(guardians) != len(guardian_ids):
            raise HTTPException(status_code=404, detail="Some guardians not found")
        db_student.guardians = guardians

    # Update other fields
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    try:
        db.commit()
        db.refresh(db_student)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    try:
        db.delete(db_student)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Student deleted successfully"}