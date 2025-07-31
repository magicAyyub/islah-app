from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database.models import Class, Student, RegistrationStatus
from app.schemas.class_schema import ClassCreate, ClassUpdate
from fastapi import HTTPException
from datetime import datetime

def create_class(db: Session, class_data: ClassCreate):
    """Create a new class"""
    
    # Check if class with same name and academic year already exists
    existing_class = db.query(Class).filter(
        and_(
            Class.name == class_data.name,
            Class.academic_year == class_data.academic_year
        )
    ).first()
    
    if existing_class:
        raise HTTPException(
            status_code=400, 
            detail=f"Class '{class_data.name}' already exists for academic year {class_data.academic_year}"
        )
    
    # Create new class
    db_class = Class(**class_data.model_dump(), created_date=datetime.now())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    
    return _get_class_with_enrollment(db, db_class)

def get_class(db: Session, class_id: int):
    """Get a single class by ID"""
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    return _get_class_with_enrollment(db, db_class)

def get_classes(db: Session, academic_year: str = None, level: str = None, skip: int = 0, limit: int = 100):
    """Get all classes with optional filters"""
    query = db.query(Class)
    
    if academic_year:
        query = query.filter(Class.academic_year == academic_year)
    if level:
        query = query.filter(Class.level == level)
    
    classes = query.offset(skip).limit(limit).all()
    
    return [_get_class_with_enrollment(db, class_obj) for class_obj in classes]

def update_class(db: Session, class_id: int, class_update: ClassUpdate):
    """Update a class"""
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if there are confirmed students and capacity is being reduced
    if class_update.capacity is not None and class_update.capacity < db_class.capacity:
        confirmed_students = db.query(Student).filter(
            and_(
                Student.class_id == class_id,
                Student.registration_status == RegistrationStatus.CONFIRMED
            )
        ).count()
        
        if confirmed_students > class_update.capacity:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot reduce capacity to {class_update.capacity}. There are {confirmed_students} confirmed students."
            )
    
    # Update fields
    update_data = class_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_class, field, value)
    
    db.commit()
    db.refresh(db_class)
    
    return _get_class_with_enrollment(db, db_class)

def delete_class(db: Session, class_id: int):
    """Delete a class"""
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if there are any students registered
    student_count = db.query(Student).filter(Student.class_id == class_id).count()
    if student_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete class. There are {student_count} students registered."
        )
    
    db.delete(db_class)
    db.commit()
    
    return {"message": f"Class '{db_class.name}' deleted successfully"}

def _get_class_with_enrollment(db: Session, class_obj: Class):
    """Helper function to add enrollment data to class object"""
    confirmed_students = db.query(Student).filter(
        and_(
            Student.class_id == class_obj.id,
            Student.registration_status == RegistrationStatus.CONFIRMED
        )
    ).count()
    
    available_spots = class_obj.capacity - confirmed_students
    
    # Convert to dict and add enrollment data
    class_dict = {
        "id": class_obj.id,
        "name": class_obj.name,
        "level": class_obj.level,
        "time_slot": class_obj.time_slot,
        "capacity": class_obj.capacity,
        "academic_year": class_obj.academic_year,
        "created_date": class_obj.created_date,
        "enrolled_students": confirmed_students,
        "available_spots": available_spots
    }
    
    return class_dict
