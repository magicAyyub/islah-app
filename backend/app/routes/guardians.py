# routes/guardians.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils import schemas, models
from typing import List, Optional

router = APIRouter(
    prefix="/api/guardians",
    tags=["Guardians"]
)

@router.post("/", response_model=schemas.GuardianResponse)
def create_guardian(guardian_data: schemas.GuardianCreate, db: Session = Depends(get_db)):
    db_guardian = models.Guardian(**guardian_data.dict())
    db.add(db_guardian)
    try:
        db.commit()
        db.refresh(db_guardian)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_guardian

@router.get("/", response_model=List[schemas.GuardianResponse])
def get_guardians(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Guardian)
    
    if role:
        query = query.filter(models.Guardian.role == role)
    if search:
        query = query.filter(
            (models.Guardian.first_name.ilike(f"%{search}%")) |
            (models.Guardian.last_name.ilike(f"%{search}%")) |
            (models.Guardian.email.ilike(f"%{search}%")) |
            (models.Guardian.phone_number.ilike(f"%{search}%"))
        )
    if student_id:
        query = query.join(models.Guardian.students).filter(models.Student.id == student_id)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{guardian_id}", response_model=schemas.GuardianResponse)
def get_guardian(guardian_id: int, db: Session = Depends(get_db)):
    guardian = db.query(models.Guardian).filter(models.Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")
    return guardian

@router.put("/{guardian_id}", response_model=schemas.GuardianResponse)
def update_guardian(
    guardian_id: int,
    guardian_data: schemas.GuardianUpdate,
    db: Session = Depends(get_db)
):
    db_guardian = db.query(models.Guardian).filter(models.Guardian.id == guardian_id).first()
    if not db_guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")
    
    for field, value in guardian_data.dict(exclude_unset=True).items():
        setattr(db_guardian, field, value)
    
    try:
        db.commit()
        db.refresh(db_guardian)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_guardian

@router.delete("/{guardian_id}")
def delete_guardian(guardian_id: int, db: Session = Depends(get_db)):
    db_guardian = db.query(models.Guardian).filter(models.Guardian.id == guardian_id).first()
    if not db_guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")
    
    try:
        db.delete(db_guardian)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Guardian deleted successfully"}

@router.get("/{guardian_id}/students", response_model=List[schemas.StudentResponse])
def get_guardian_students(guardian_id: int, db: Session = Depends(get_db)):
    guardian = db.query(models.Guardian).filter(models.Guardian.id == guardian_id).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian not found")
    return guardian.students