from pydantic import BaseModel, EmailStr, constr, validator, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class PaymentStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"

class RelationType(str, Enum):
    mother = "mother"
    father = "father"
    guardian = "guardian"
    other = "other"

class NotificationType(str, Enum):
    payment_due = "payment_due"
    payment_overdue = "payment_overdue"
    payment_received = "payment_received"
    payment_failed = "payment_failed"

class AttendanceStatus(str, Enum):
    present = "present"
    absent = "absent"
    late = "late"
    excused = "excused"

# Base Models (for request bodies)
class ClassBase(BaseModel):
    name: str
    teacher: str
    description: Optional[str] = None
    capacity: int = Field(gt=0)
    start_date: date
    end_date: date

    @validator('end_date')
    def validate_dates(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class StudentBase(BaseModel):
    last_name: str
    first_name: str
    class_id: Optional[int] = None
    birth_date: date
    notes: Optional[str] = None

class ParentBase(BaseModel):
    last_name: str
    first_name: str
    email: EmailStr
    phone: constr = Field(..., pattern=r'^\+?1?\d{9,15}$')
    address: Optional[str] = None

class PaymentBase(BaseModel):
    student_id: int
    class_id: int
    amount: float = Field(gt=0)
    due_date: date
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class AttendanceBase(BaseModel):
    student_id: int
    class_id: int
    attendance_date: date
    status: AttendanceStatus
    notes: Optional[str] = None

# Response Models (for responses)
class ClassResponse(ClassBase):
    id: int
    registered: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StudentResponse(StudentBase):
    id: int
    active: bool
    registration_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ParentResponse(ParentBase):
    id: int
    registration_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaymentResponse(PaymentBase):
    id: int
    status: PaymentStatus
    payment_date: datetime
    transaction_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    student_id: int
    payment_id: int
    type: NotificationType
    message: str
    is_read: bool
    is_sent: bool
    created_at: datetime
    sent_at: Optional[datetime]
    read_at: Optional[datetime]

    class Config:
        from_attributes = True

# Additional Models for specific operations
class StudentParentAssociation(BaseModel):
    student_id: int
    parent_id: int
    relationship_type: RelationType
    is_primary_contact: bool = False

class StudentWithDetails(StudentResponse):
    class_: Optional[ClassResponse] = None
    parents: List[ParentResponse] = []
    payments: List[PaymentResponse] = []
    notifications: List[NotificationResponse] = []

    class Config:
        from_attributes = True

class PaymentWithDetails(PaymentResponse):
    student: StudentResponse
    notifications: List[NotificationResponse] = []

    class Config:
        from_attributes = True