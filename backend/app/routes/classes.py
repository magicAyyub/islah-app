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
    # if not courses:
    #     raise HTTPException(status_code=404, detail="No courses found")
    return courses