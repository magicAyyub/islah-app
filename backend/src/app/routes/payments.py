# src/routes/payments.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Payment, Student
from src.schemas import (
    PaymentCreate, PaymentUpdate, PaymentResponse, 
    PaymentDetailResponse, PaymentStatistics
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[PaymentResponse])
async def read_payments(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    payment_type: Optional[str] = None,
    payment_status: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Payment)
    
    if student_id:
        query = query.filter(Payment.student_id == student_id)
    
    if payment_type:
        query = query.filter(Payment.type == payment_type)
    
    if payment_status:
        query = query.filter(Payment.status == payment_status)
    
    if date_from:
        query = query.filter(Payment.payment_date >= date_from)
    
    if date_to:
        query = query.filter(Payment.payment_date <= date_to)
    
    payments = query.order_by(Payment.payment_date.desc()).offset(skip).limit(limit).all()
    return payments

@router.get("/statistics", response_model=PaymentStatistics)
async def get_payment_statistics(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    query = db.query(Payment)
    
    if date_from:
        query = query.filter(Payment.payment_date >= date_from)
    
    if date_to:
        query = query.filter(Payment.payment_date <= date_to)
    
    total_paid = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "paid"
    ).scalar() or 0
    
    pending = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "pending"
    ).scalar() or 0
    
    overdue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "overdue"
    ).scalar() or 0
    
    total_expected = total_paid + pending + overdue
    collection_rate = (total_paid / total_expected) * 100 if total_expected > 0 else 0
    
    return {
        "total_paid": total_paid,
        "pending": pending,
        "overdue": overdue,
        "collection_rate": collection_rate
    }

@router.get("/{payment_id}", response_model=PaymentDetailResponse)
async def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if student exists
    student = db.query(Student).filter(Student.id == payment.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db_payment = Payment(
        student_id=payment.student_id,
        amount=payment.amount,
        payment_date=payment.payment_date,
        method=payment.method,
        reference=payment.reference,
        type=payment.type,
        status=payment.status,
        comment=payment.comment,
        recorded_by=current_user.id  # Use the current user's ID
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    return db_payment

@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: int,
    payment: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    update_data = payment.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_payment, key, value)
    
    db.commit()
    db.refresh(db_payment)
    
    return db_payment

@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    db.delete(db_payment)
    db.commit()
    
    return None