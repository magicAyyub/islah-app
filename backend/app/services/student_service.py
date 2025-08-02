from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException
from app.database.models import Student, Parent, Class
from app.schemas.student import StudentCreate, StudentUpdate

def create_student(db: Session, student: StudentCreate):
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_student(db: Session, student_id: int):
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class'])
    ).filter(Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class'])
    ).offset(skip).limit(limit).all()

def update_student(db: Session, student_id: int, student_update: StudentUpdate):
    db_student = db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class'])
    ).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update only the fields that are provided
    update_data = student_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    # Re-fetch with relationships
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class'])
    ).filter(Student.id == student_id).first()

def delete_student(db: Session, student_id: int):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}
