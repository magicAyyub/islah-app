from pydantic import BaseModel
from typing import Optional
from src.app.schemas.shared.classes import StudentBase
from src.app.schemas.subject import SubjectBase

class GradeBase(BaseModel):
    student_id: int
    subject_id: int
    term: str
    score: Optional[float] = None
    comment: Optional[str] = None
    
class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    term: Optional[str] = None
    score: Optional[float] = None
    comment: Optional[str] = None

class GradeResponse(GradeBase):
    id: int

    class Config:
        from_attributes = True

class GradeDetailResponse(GradeResponse):
    student: StudentBase
    subject: SubjectBase

    class Config:
        from_attributes = True