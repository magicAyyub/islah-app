from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from src.utils.database import get_db
from src.utils import schemas, models
from typing import List, Optional
from datetime import date

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"]
)

@router.post("/", response_model=schemas.PaymentResponse)
def create_payment(payment_data: schemas.PaymentCreate, db: Session = Depends(get_db)):
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == payment_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_payment = models.Payment(**payment_data.dict())
    db.add(db_payment)
    try:
        db.commit()
        db.refresh(db_payment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_payment

@router.get("/", response_model=List[schemas.PaymentResponse])
def get_payments(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    method: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Payment)
    if student_id:
        query = query.filter(models.Payment.student_id == student_id)
    if start_date:
        query = query.filter(models.Payment.payment_date >= start_date)
    if end_date:
        query = query.filter(models.Payment.payment_date <= end_date)
    if method:
        query = query.filter(models.Payment.method == method)
    return query.offset(skip).limit(limit).all()

@router.get("/{payment_id}", response_model=schemas.PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.put("/{payment_id}", response_model=schemas.PaymentResponse)
def update_payment(
    payment_id: int,
    payment_data: schemas.PaymentUpdate,
    db: Session = Depends(get_db)
):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    for field, value in payment_data.dict(exclude_unset=True).items():
        setattr(db_payment, field, value)
    
    try:
        db.commit()
        db.refresh(db_payment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_payment