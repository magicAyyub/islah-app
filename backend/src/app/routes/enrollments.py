from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from src.utils.database import get_db
from src.utils import schemas, models
from typing import List, Optional
from datetime import date

router = APIRouter(
    prefix="/api/enrollments",
    tags=["Enrollments"]
)

@router.post("/", response_model=schemas.EnrollmentResponse, operation_id="create_enrollment")
async def create_enrollment(
    enrollment_data: schemas.EnrollmentCreate,
    db: Session = Depends(get_db)
):
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == enrollment_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Verify class exists and has capacity
    class_ = db.query(models.Class).filter(models.Class.id == enrollment_data.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    if class_.registered >= class_.capacity:
        raise HTTPException(status_code=400, detail="Class is full")

    db_enrollment = models.Enrollment(**enrollment_data.dict())
    db.add(db_enrollment)
    
    try:
        # Update class registered count
        class_.registered += 1
        db.commit()
        db.refresh(db_enrollment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    return db_enrollment

@router.get("/", response_model=List[schemas.EnrollmentResponse], operation_id="list_enrollments")
async def get_enrollments(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    class_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Enrollment)
    if student_id:
        query = query.filter(models.Enrollment.student_id == student_id)
    if class_id:
        query = query.filter(models.Enrollment.class_id == class_id)
    if status:
        query = query.filter(models.Enrollment.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/{enrollment_id}", response_model=schemas.EnrollmentResponse, operation_id="retrieve_enrollment")
async def get_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@router.put("/{enrollment_id}", response_model=schemas.EnrollmentResponse, operation_id="modify_enrollment")
async def update_enrollment(
    enrollment_id: int,
    enrollment_data: schemas.EnrollmentUpdate,
    db: Session = Depends(get_db)
):
    db_enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    old_class_id = db_enrollment.class_id
    
    for field, value in enrollment_data.dict(exclude_unset=True).items():
        setattr(db_enrollment, field, value)
    
    try:
        # If class changed, update registered counts
        if 'class_id' in enrollment_data.dict(exclude_unset=True) and old_class_id != enrollment_data.class_id:
            old_class = db.query(models.Class).filter(models.Class.id == old_class_id).first()
            new_class = db.query(models.Class).filter(models.Class.id == enrollment_data.class_id).first()
            
            if new_class.registered >= new_class.capacity:
                raise HTTPException(status_code=400, detail="New class is full")
                
            old_class.registered -= 1
            new_class.registered += 1
            
        db.commit()
        db.refresh(db_enrollment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_enrollment

@router.delete("/{enrollment_id}", operation_id="remove_enrollment")
async def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    db_enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    try:
        # Update class registered count
        class_ = db.query(models.Class).filter(models.Class.id == db_enrollment.class_id).first()
        class_.registered -= 1
        
        db.delete(db_enrollment)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Enrollment deleted successfully"}