from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from src.utils.database import get_db
from src.utils import schemas, models
from typing import List, Optional
from datetime import time

router = APIRouter(
    prefix="/api/classes",
    tags=["Classes"]
)

@router.post("/", response_model=schemas.ClassResponse)
def create_class(class_data: schemas.ClassCreate, db: Session = Depends(get_db)):
    db_class = models.Class(**class_data.dict())
    db.add(db_class)
    try:
        db.commit()
        db.refresh(db_class)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_class

@router.get("/", response_model=List[schemas.ClassResponse])
def get_classes(
    skip: int = 0,
    limit: int = 100,
    day: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Class)
    if day:
        query = query.filter(models.Class.day_of_week == day)
    return query.offset(skip).limit(limit).all()

@router.get("/{class_id}", response_model=schemas.ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    db_class = db.query(models.Class).filter(models.Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class

@router.put("/{class_id}", response_model=schemas.ClassResponse)
def update_class(
    class_id: int,
    class_data: schemas.ClassUpdate,
    db: Session = Depends(get_db)
):
    db_class = db.query(models.Class).filter(models.Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    for field, value in class_data.dict(exclude_unset=True).items():
        setattr(db_class, field, value)
    
    try:
        db.commit()
        db.refresh(db_class)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_class

@router.delete("/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db)):
    db_class = db.query(models.Class).filter(models.Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    try:
        db.delete(db_class)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Class deleted successfully"}