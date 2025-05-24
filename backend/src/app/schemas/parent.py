from pydantic import BaseModel
from typing import Optional
from src.utils.enums import UserRole
from pydantic import EmailStr
from typing import List

from src.app.schemas.user import UserBase
from src.app.schemas.shared.classes import StudentBase, ParentBase




class ParentCreate(ParentBase):
    # Informations pour la création automatique du compte utilisateur
    username: str
    password: str
    user_role: UserRole = UserRole.PARENT

class ParentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    user_id: Optional[int] = None

class ParentResponse(ParentBase):
    id: int

    class Config:
        from_attributes = True

class ParentDetailResponse(ParentResponse):
    students: List[StudentBase] = []
    user: Optional[UserBase] = None

    class Config:
        from_attributes = True

ParentDetailResponse.update_forward_refs()
