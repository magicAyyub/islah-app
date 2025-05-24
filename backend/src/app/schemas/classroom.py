from pydantic import BaseModel
from typing import Optional
from typing import List

from src.app.schemas.level import LevelBase
from src.app.schemas.shared.classes import StudentBase, ClassroomBase, TeacherBase


class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(BaseModel):
    label: Optional[str] = None
    level_id: Optional[int] = None
    schedule: Optional[str] = None
    capacity: Optional[int] = None
    teacher_id: Optional[int] = None

class ClassroomResponse(ClassroomBase):
    id: int

    class Config:
        from_attributes = True

class ClassroomDetailResponse(ClassroomResponse):
    level: LevelBase
    teacher: Optional[TeacherBase] = None
    students: List[StudentBase] = []

    class Config:
        from_attributes = True

ClassroomDetailResponse.update_forward_refs()