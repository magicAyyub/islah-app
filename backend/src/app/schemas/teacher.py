from pydantic import BaseModel
from typing import Optional
from src.utils.enums import UserRole
from pydantic import EmailStr
from typing import List
from src.app.schemas.user import UserBase
from src.app.schemas.shared.classes import ClassroomBase, TeacherBase



class TeacherCreate(TeacherBase):
    username: str
    password: str
    user_role: UserRole = UserRole.TEACHER

class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    user_id: Optional[int] = None

class TeacherResponse(TeacherBase):
    id: int

    class Config:
        from_attributes = True

class TeacherDetailResponse(TeacherResponse):
    classrooms: List[ClassroomBase] = []
    user: Optional[UserBase] = None

    class Config:
        from_attributes = True

# Add this line to ensure forward references are resolved
# forward reference is generaly used to avoid circular dependencies
TeacherDetailResponse.update_forward_refs()