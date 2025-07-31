from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.payment import PaymentCreate
from app.services import payment_service
from app.database.session import get_db

router = APIRouter()

@router.post("/")
def make_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    return payment_service.make_payment(db=db, payment=payment)
