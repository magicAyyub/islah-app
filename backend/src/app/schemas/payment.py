from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from src.utils.enums import PaymentType, PaymentMethod, PaymentStatus
from src.app.schemas.shared.classes import StudentBase

class PaymentBase(BaseModel):
    student_id: int
    amount: float
    type: PaymentType
    method: PaymentMethod
    payment_date: date = Field(default_factory=date.today)
    status: PaymentStatus = PaymentStatus.PENDING

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[PaymentType] = None
    method: Optional[PaymentMethod] = None
    payment_date: Optional[date] = None
    status: Optional[PaymentStatus] = None

class PaymentResponse(PaymentBase):
    id: int

    class Config:
        from_attributes = True

class PaymentDetailResponse(PaymentResponse):
    student: StudentBase

    class Config:
        from_attributes = True