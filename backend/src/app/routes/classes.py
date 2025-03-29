# src/routes/classes.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Class, Enrollment, Student
from src.schemas import ClassCreate, ClassUpdate, ClassResponse, ClassStatistics

router = APIRouter(
    prefix="/classes",
    tags=["Classes"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ClassResponse])
async def read_classes(
    skip: int = 0,
    limit: int = 100,
    level: Optional[str] = None,
    school_year: Optional[str] = None,
    time_slot: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Class).filter(Class.is_active == is_active)
    
    if level:
        query = query.filter(Class.level == level)
    
    if school_year:
        query = query.filter(Class.school_year == school_year)
    
    if time_slot:
        query = query.filter(Class.time_slot == time_slot)
    
    classes = query.offset(skip).limit(limit).all()
    return classes

@router.get("/statistics", response_model=List[ClassStatistics])
async def get_class_statistics(
    school_year: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Class).filter(Class.is_active == is_active)
    
    if school_year:
        query = query.filter(Class.school_year == school_year)
    
    classes = query.all()
    result = []
    
    for class_ in classes:
        # Count active enrollments for this class
        student_count = db.query(Enrollment).filter(
            Enrollment.class_id == class_.id,
            Enrollment.status == "active"
        ).count()
        
        fill_rate = (student_count / class_.max_capacity) * 100 if class_.max_capacity > 0 else 0
        
        result.append({
            "name": class_.name,
            "level": class_.level,
            "total_students": student_count,
            "capacity": class_.max_capacity,
            "fill_rate": fill_rate
        })
    
    return result

@router.get("/{class_id}", response_model=ClassResponse)
async def read_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    class_ = db.query(Class).filter(Class.id == class_id).first()
    if class_ is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_

@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_: ClassCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_class = Class(
        name=class_.name,
        level=class_.level,
        school_year=class_.school_year,
        time_slot=class_.time_slot,
        max_capacity=class_.max_capacity,
        is_active=class_.is_active
    )
    
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    
    return db_class

@router.put("/{class_id}", response_model=ClassResponse)
async def update_class(
    class_id: int,
    class_: ClassUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    
    update_data = class_.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_class, key, value)
    
    db.commit()
    db.refresh(db_class)
    
    return db_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if db_class is None:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Instead of deleting, mark as inactive
    db_class.is_active = False
    db.commit()
    
    return None