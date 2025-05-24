from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

import src.utils.dependencies as deps
from src.app.crud import payment as crud
from src.app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
    PaymentResponse
)
from src.utils.enums import PaymentType, PaymentMethod, PaymentStatus

router = APIRouter()

@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    payment_type: Optional[PaymentType] = None,
    payment_method: Optional[PaymentMethod] = None,
    status: Optional[PaymentStatus] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get payments with optional filtering.
    """
    payments, _ = crud.get_payments(
        db=db,
        skip=skip,
        limit=limit,
        student_id=student_id,
        payment_type=payment_type,
        payment_method=payment_method,
        status=status,
        start_date=start_date,
        end_date=end_date
    )
    return payments

@router.post("/", response_model=PaymentResponse)
def create_payment(
    *,
    db: Session = Depends(deps.get_db),
    payment_in: PaymentCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new payment.
    """
    return crud.create_payment(db=db, payment=payment_in)

@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(
    *,
    db: Session = Depends(deps.get_db),
    payment_id: int,
    payment_in: PaymentUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update payment.
    """
    payment = crud.get_payment(db=db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return crud.update_payment(db=db, payment_id=payment_id, payment=payment_in)

@router.delete("/{payment_id}")
def delete_payment(
    *,
    db: Session = Depends(deps.get_db),
    payment_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete payment.
    """
    payment = crud.get_payment(db=db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if crud.delete_payment(db=db, payment_id=payment_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete payment")

@router.put("/{payment_id}/status", response_model=PaymentResponse)
def update_payment_status(
    *,
    db: Session = Depends(deps.get_db),
    payment_id: int,
    status: PaymentStatus,
    current_user = Depends(deps.get_current_user),
):
    """
    Update payment status.
    """
    payment = crud.get_payment(db=db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return crud.update_payment_status(db=db, payment_id=payment_id, status=status)
