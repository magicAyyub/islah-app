from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.schemas.class_schema import Class, ClassCreate, ClassUpdate
from app.services.class_service import (
    create_class, get_class, get_classes, update_class, delete_class
)

router = APIRouter()

@router.post("/", response_model=Class, status_code=201)
def create_new_class(class_data: ClassCreate, db: Session = Depends(get_db)):
    """Create a new class"""
    return create_class(db=db, class_data=class_data)

@router.get("/", response_model=List[Class])
def read_classes(
    academic_year: Optional[str] = None,
    level: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all classes with optional filters"""
    return get_classes(db=db, academic_year=academic_year, level=level, skip=skip, limit=limit)

@router.get("/{class_id}", response_model=Class)
def read_class(class_id: int, db: Session = Depends(get_db)):
    """Get a specific class by ID"""
    return get_class(db=db, class_id=class_id)

@router.put("/{class_id}", response_model=Class)
def update_existing_class(class_id: int, class_update: ClassUpdate, db: Session = Depends(get_db)):
    """Update a class"""
    return update_class(db=db, class_id=class_id, class_update=class_update)

@router.delete("/{class_id}")
def delete_existing_class(class_id: int, db: Session = Depends(get_db)):
    """Delete a class"""
    return delete_class(db=db, class_id=class_id)
