from pydantic import BaseModel
from typing import Optional
from datetime import date
from pydantic import EmailStr, Field
from src.utils.enums import PaymentType, PaymentMethod, PaymentStatus,Gender, EnrollmentStatus

class ClassroomBase(BaseModel):
    label: str
    level_id: int
    schedule: Optional[str] = None
    capacity: int = 30
    teacher_id: Optional[int] = None

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    gender: Gender
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE
    parent_id: Optional[int] = None
    current_class_id: Optional[int] = None

class ParentBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class TeacherBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None