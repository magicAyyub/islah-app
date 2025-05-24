from pydantic import BaseModel
from typing import Optional
from datetime import date
from src.utils.enums import Gender, EnrollmentStatus
from pydantic import Field
from src.app.schemas.shared.classes import ClassroomBase, StudentBase, ParentBase





class StudentCreate(StudentBase):
    enrolled_at: date = Field(default_factory=date.today)

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[Gender] = None
    status: Optional[EnrollmentStatus] = None
    parent_id: Optional[int] = None
    current_class_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    enrolled_at: date

    class Config:
        from_attributes = True

class StudentDetailResponse(StudentResponse):
    parent: Optional[ParentBase] = None
    current_class: Optional[ClassroomBase] = None
    
    class Config:
        from_attributes = True

StudentDetailResponse.update_forward_refs()