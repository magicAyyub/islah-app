from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Class
from pydantic import BaseModel

class ClassModel(BaseModel):
    name: str
    teacher: str
    capacity: int
    registered: int

class ClassResponse(BaseModel):
    id: int
    name: str
    teacher: str
    capacity: int
    registered: int

router = APIRouter(
    tags=["Classes"]
)

db_dependency = Depends(get_db)

@router.get("/api/classes")
async def get_courses(db: Session = db_dependency) -> list[ClassResponse]:
    """Get all courses."""
    courses = db.query(Class).all()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")
    return courses

@router.get("/api/classes/{class_id}")
async def get_course(class_id: int, db: Session = db_dependency) -> ClassResponse:
    """Get a course by id."""
    course = db.query(Class).filter(Class.id == class_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/api/classes")
async def create_course(course: ClassModel, db: Session = db_dependency) -> ClassResponse:
    """Create a course."""
    course = Class(**course.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.put("/api/classes/{class_id}")
async def update_course(class_id: int, course_data: ClassModel, db: Session = db_dependency) -> ClassResponse:
    """Update a course."""
    course = db.query(Class).filter(Class.id == class_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in course_data.dict(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course

@router.delete("/api/classes/{class_id}")
async def delete_course(class_id: int, db: Session = db_dependency) -> dict[str, str]:
    """Delete a course."""
    course = db.query(Class).filter(Class.id == class_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}