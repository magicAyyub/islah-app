from datetime import time
from pydantic import BaseModel, EmailStr, constr, validator, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

# Enums
class Role(str, Enum):
    ADMIN = 'admin'
    AGENT = 'agent'
    DIRECTION = 'direction'

class GuardianRole(str, Enum):
    FATHER = 'father'
    MOTHER = 'mother'
    GUARDIAN = 'guardian'

class Gender(str, Enum):
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'

class DayOfWeek(str, Enum):
    MONDAY = 'monday'
    TUESDAY = 'tuesday'
    WEDNESDAY = 'wednesday'
    THURSDAY = 'thursday'
    FRIDAY = 'friday'
    SATURDAY = 'saturday'
    SUNDAY = 'sunday'

class EnrollmentStatus(str, Enum):
    ACTIVE = 'active'
    COMPLETED = 'completed'
    WITHDRAWN = 'withdrawn'

class PaymentMethod(str, Enum):
    CASH = 'cash'
    CARD = 'card'
    CHEQUE = 'cheque'

class NotificationType(str, Enum):
    PAYMENT_REMINDER = 'payment_reminder'
    RE_ENROLLMENT_REMINDER = 're_enrollment_reminder'

class NotificationStatus(str, Enum):
    PENDING = 'pending'
    SENT = 'sent'

# Base Models
class UserBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    role: Role

class GuardianBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    role: GuardianRole
    phone_number: str = Field(..., pattern=r'^\+?1?\d{9,15}$')
    email: Optional[EmailStr] = None

class StudentBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    gender: Gender
    date_of_birth: date

class ClassBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    capacity: int = Field(..., gt=0)
    day_of_week: DayOfWeek
    start_time: str = Field(..., pattern='^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
    end_time: str = Field(..., pattern='^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')

class EnrollmentBase(BaseModel):
    student_id: int
    class_id: int
    status: EnrollmentStatus

class PaymentBase(BaseModel):
    student_id: int
    amount: float = Field(..., gt=0)
    due_date: date
    method: PaymentMethod
    description: Optional[str] = None

class NotificationBase(BaseModel):
    student_id: int
    type: NotificationType
    created_by: int
    content: str

# Response Models
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GuardianResponse(GuardianBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class StudentResponse(StudentBase):
    id: int
    created_at: datetime
    guardians: List[GuardianResponse]

    class Config:
        from_attributes = True

class ClassResponse(ClassBase):
    id: int
    registered: int
    created_at: datetime
    start_time: str
    end_time: str

    class Config:
        from_attributes = True

    @validator('start_time', 'end_time', pre=True)
    def convert_time_to_string(cls, v):
        if isinstance(v, time):
            return v.strftime('%H:%M')
        return v

class EnrollmentResponse(EnrollmentBase):
    id: int
    enrollment_date: date

    class Config:
        from_attributes = True

class PaymentResponse(PaymentBase):
    id: int
    payment_date: Optional[datetime]

    class Config:
        from_attributes = True

class NotificationResponse(NotificationBase):
    id: int
    status: NotificationStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Create Models
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class GuardianCreate(GuardianBase):
    pass

class StudentCreate(StudentBase):
    guardian_ids: List[int]

class ClassCreate(ClassBase):
    pass

class EnrollmentCreate(EnrollmentBase):
    pass

class PaymentCreate(PaymentBase):
    pass

class NotificationCreate(NotificationBase):
    pass

# Update Models
class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    role: Optional[Role] = None

class GuardianUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    role: Optional[GuardianRole] = None
    phone_number: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    email: Optional[EmailStr] = None

class StudentUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    gender: Optional[Gender] = None
    date_of_birth: Optional[date] = None
    guardian_ids: Optional[List[int]] = None

class ClassUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    capacity: Optional[int] = Field(None, gt=0)
    day_of_week: Optional[DayOfWeek] = None
    start_time: Optional[str] = Field(None, pattern='^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$') # 09:00
    end_time: Optional[str] = Field(None, pattern='^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$') # 18:00

    
class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None

class PaymentUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    due_date: Optional[date] = None
    method: Optional[PaymentMethod] = None
    description: Optional[str] = None