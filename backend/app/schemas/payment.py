from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_method: str

class Payment(PaymentCreate):
    id: int
    payment_date: datetime

    model_config = ConfigDict(from_attributes=True)
