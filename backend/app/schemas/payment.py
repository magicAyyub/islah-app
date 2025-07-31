from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_method: str
    payment_type: str  # "inscription" or "quarterly"
    notes: Optional[str] = None

class Payment(PaymentCreate):
    id: int
    payment_date: datetime
    receipt_number: Optional[str] = None
    processed_by: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

# Alias for response model
PaymentResponse = Payment
