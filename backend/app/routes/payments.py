from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Payment
from pydantic import BaseModel
from datetime import datetime
from utils import schemas, models
from typing import Optional, List
from datetime import date


router = APIRouter(
    tags=["Payments"]
)

db_dependency = Depends(get_db)

@router.get("/payments/", response_model=List[schemas.PaymentResponse])
async def get_payments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.PaymentStatus] = None,
    student_id: Optional[int] = None,
    class_id: Optional[int] = None,
    due_before: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Payment)
    if status:
        query = query.filter(models.Payment.status == status)
    if student_id:
        query = query.filter(models.Payment.student_id == student_id)
    if class_id:
        query = query.filter(models.Payment.class_id == class_id)
    if due_before:
        query = query.filter(models.Payment.due_date <= due_before)
    return query.offset(skip).limit(limit).all()

@router.post("/payments/", response_model=schemas.PaymentResponse)
async def create_payment(
    payment: schemas.PaymentBase,
    db: Session = Depends(get_db)
):
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment