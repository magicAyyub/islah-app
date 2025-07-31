from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_method: str
    payment_type: str  # "inscription" or "quarterly"

class Payment(PaymentCreate):
    id: int
    payment_date: datetime

    model_config = ConfigDict(from_attributes=True)
