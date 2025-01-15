from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Student, Parent
from pydantic import BaseModel
from datetime import date, datetime
from typing import List
from .parents import ParentResponse

class StudentModel(BaseModel):
    last_name: str
    first_name: str
    class_id: int
    birth_date: date
    registration_date: datetime = datetime.now() 


class StudentResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    class_id: int
    birth_date: date
    registration_date: datetime 

    class Config:
        from_attributes = True  # This enables ORM mode
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }
class StudentParentAssociation(BaseModel):
    student_id: int
    parent_id: int
    relationship_type: str  # e.g., "Mother", "Father", "Guardian"

router = APIRouter(
    tags=["Students"]
)

db_dependency = Depends(get_db)

@router.get("/api/students")
async def get_students(db: Session = db_dependency) -> list[StudentResponse]:
    """Get all students."""
    students = db.query(Student).all()
    if students is None:
        raise HTTPException(status_code=404, detail="No students found")
    return students

@router.get("/api/students/search", response_model=List[StudentResponse])
async def search_student(q: str = Query(..., min_length=1), db: Session = db_dependency):
    """Search for a student."""
    students = db.query(Student).filter(Student.first_name.ilike(f"%{q}%") | Student.last_name.ilike(f"%{q}%")).all()
    return students

@router.get("/api/students/{student_id}")
async def get_student(student_id: int, db: Session = db_dependency) -> StudentResponse:
    """Get a student by id."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/api/students")
async def create_student(student: StudentModel, db: Session = db_dependency) -> StudentResponse:
    """Create a student."""
    student = Student(**student.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.put("/api/students/{student_id}")
async def update_student(student_id: int, student: StudentModel, db: Session = db_dependency) -> StudentResponse:
    """Update a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        if key in student.dict():
            setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/api/students/{student_id}")
async def delete_student(student_id: int, db: Session = db_dependency) -> dict[str, str]:
    """Delete a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

# Add these new endpoints to your router
@router.post("/api/students/{student_id}/associate-parent")
async def associate_parent_with_student(
    student_id: int,
    association: StudentParentAssociation,
    db: Session = db_dependency
) -> dict:
    """Associate a parent with a student."""
    # Verify student exists
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Verify parent exists
    parent = db.query(Parent).filter(Parent.id == association.parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Check if association already exists TODO: revoir cette partie créer une table de relation
    existing_association = db.query(Student).filter(
        Student.id == student_id,
        Student.parents.any(Parent.id == association.parent_id)
    ).first()

    if existing_association:
        raise HTTPException(
            status_code=400,
            detail="This parent is already associated with this student"
        )

    # Add the relationship
    student.parents.append(parent)
    db.commit()

    return {
        "message": "Parent successfully associated with student",
        "student_id": student_id,
        "parent_id": association.parent_id,
        "relationship_type": association.relationship_type
    }

@router.get("/api/students/{student_id}/parents")
async def get_student_parents(
    student_id: int,
    db: Session = db_dependency
) -> List[ParentResponse]:
    """Get all parents associated with a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student.parents

@router.delete("/api/students/{student_id}/parents/{parent_id}")
async def remove_parent_association(
    student_id: int,
    parent_id: int,
    db: Session = db_dependency
) -> dict:
    """Remove association between a student and a parent."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    if parent not in student.parents:
        raise HTTPException(
            status_code=404,
            detail="This parent is not associated with this student"
        )

    student.parents.remove(parent)
    db.commit()

    return {
        "message": "Parent association successfully removed",
        "student_id": student_id,
        "parent_id": parent_id
    }

@router.get("/api/students/by-parent/{parent_id}")
async def get_students_by_parent(
    parent_id: int,
    db: Session = db_dependency
) -> List[StudentResponse]:
    """Get all students associated with a specific parent."""
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    return parent.students