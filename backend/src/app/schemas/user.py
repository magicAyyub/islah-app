from pydantic import BaseModel
from typing import Optional
from src.utils.enums import UserRole
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: UserRole
    full_name: str

class UserCreate(UserBase):
    password_hash: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True