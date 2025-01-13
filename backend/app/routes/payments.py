from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Payment
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentModel(BaseModel):
    student_id: int
    class_id: int
    amount: float
    date: datetime = datetime.now()
    status: str = "pending"  

class PaymentResponse(BaseModel):
    id: int
    student_id: int
    class_id: int
    amount: float
    date: datetime 
    status: Optional[str] = "pending" 

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }
router = APIRouter(
    tags=["Payments"]
)

db_dependency = Depends(get_db)

@router.get("/api/payments")
async def get_payments(db: Session = db_dependency) -> list[PaymentResponse]:
    """Get all payments."""
    payments = db.query(Payment).all()
    if not payments:
        raise HTTPException(status_code=404, detail="No payments found")
    return payments

@router.get("/api/payments/{payment_id}")
async def get_payment(payment_id: int, db: Session = db_dependency) -> PaymentResponse:
    """Get a payment by id."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/api/payments")
async def create_payment(payment: PaymentModel, db: Session = db_dependency) -> PaymentResponse:
    """Create a payment."""
    payment = Payment(**payment.dict())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

@router.put("/api/payments/{payment_id}")
async def update_payment(payment_id: int, payment_data: PaymentModel, db: Session = db_dependency) -> PaymentResponse:
    """Update a payment."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    for key, value in payment_data.dict(exclude_unset=True).items():
        setattr(payment, key, value)
    db.commit()
    db.refresh(payment)
    return payment

@router.delete("/api/payments/{payment_id}")
async def delete_payment(payment_id: int, db: Session = db_dependency) -> dict[str, str]:
    """Delete a payment."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    db.delete(payment)
    db.commit()
    return {"message": "Payment deleted"}