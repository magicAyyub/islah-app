from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Payment
from pydantic import BaseModel,validator
from datetime import datetime

class PaymentModel(BaseModel):
    amount: float
    student_id: int
    class_id: int
    amount: float
    date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    @validator('date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise ValueError("date must be in the format YYYY-MM-DD HH:MM:SS")
        return v
    status: str 

class PaymentResponse(BaseModel):
    id: int
    student_id: int
    class_id: int
    amount: float
    date: str 
    status: str

router = APIRouter(
    tags=["Payments"]
)

db_dependency = Depends(get_db)

@router.get("/api/payments")
async def get_payments(db: Session = db_dependency) -> list[PaymentResponse]:
    """Get all payments."""
    payments = db.query(Payment).all()
    # if not payments:
    #     raise HTTPException(status_code=404, detail="No payments found")
    return payments