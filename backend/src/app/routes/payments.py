# src/routes/payments.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.utils.pagination import get_pagination_meta
from src.models import Payment, User, Student
from src.schemas import PaymentCreate, PaymentUpdate, PaymentResponse, PaymentDetailResponse
from src.utils.error_handlers import ResourceNotFoundError, ForeignKeyViolationError, DatabaseError
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Payment not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[PaymentResponse],
    summary="Get all payments",
    description="Retrieve a list of all payments with optional filtering and pagination"
)
async def read_payments(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    student_id: Optional[int] = Query(None, description="Filter by student ID"),
    payment_type: Optional[str] = Query(None, description="Filter by payment type"),
    status: Optional[str] = Query(None, description="Filter by payment status"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Payment)
        
        # Apply filters
        if student_id:
            query = query.filter(Payment.student_id == student_id)
        
        if payment_type:
            query = query.filter(Payment.type == payment_type)
        
        if status:
            query = query.filter(Payment.status == status)
        
        if start_date:
            query = query.filter(Payment.date >= start_date)
        
        if end_date:
            query = query.filter(Payment.date <= end_date)
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        payments = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        
        # Build response
        return PaginatedResponse(
            success=True,
            data=payments,
            message=f"Retrieved {len(payments)} payments",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving payments", original_error=e)

@router.get(
    "/{payment_id}", 
    response_model=APIResponse[PaymentDetailResponse],
    summary="Get payment by ID",
    description="Retrieve detailed information about a specific payment"
)
async def read_payment(
    payment_id: int = Path(..., ge=1, description="The ID of the payment to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if db_payment is None:
            raise ResourceNotFoundError("Payment", payment_id)
        
        return APIResponse(
            success=True,
            data=db_payment,
            message=f"Retrieved payment {payment_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving payment {payment_id}", original_error=e)

@router.post(
    "/", 
    response_model=APIResponse[PaymentResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new payment",
    description="Create a new payment record with the provided details"
)
async def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Validate student exists
        student = db.query(Student).filter(Student.id == payment.student_id).first()
        if not student:
            raise ForeignKeyViolationError(
                resource_type="Payment",
                field="student_id",
                value=payment.student_id,
                referenced_resource="Student"
            )
        
        # Create payment
        db_payment = Payment(
            student_id=payment.student_id,
            amount=payment.amount,
            type=payment.type,
            method=payment.method,
            date=payment.date,
            status=payment.status
        )
        
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        return APIResponse(
            success=True,
            data=db_payment,
            message="Payment created successfully"
        )
    except ForeignKeyViolationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating payment", original_error=e)

@router.put(
    "/{payment_id}", 
    response_model=APIResponse[PaymentResponse],
    summary="Update a payment",
    description="Update an existing payment with the provided details"
)
async def update_payment(
    payment_id: int = Path(..., ge=1, description="The ID of the payment to update"),
    payment: PaymentUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if payment exists
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if db_payment is None:
            raise ResourceNotFoundError("Payment", payment_id)
        
        # Validate student exists if student_id is being updated
        if payment.student_id is not None:
            student = db.query(Student).filter(Student.id == payment.student_id).first()
            if not student:
                raise ForeignKeyViolationError(
                    resource_type="Payment",
                    field="student_id",
                    value=payment.student_id,
                    referenced_resource="Student"
                )
        
        # Update payment
        update_data = payment.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_payment, key, value)
        
        db.commit()
        db.refresh(db_payment)
        
        return APIResponse(
            success=True,
            data=db_payment,
            message=f"Payment {payment_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ForeignKeyViolationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating payment {payment_id}", original_error=e)

@router.delete(
    "/{payment_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a payment",
    description="Delete an existing payment record"
)
async def delete_payment(
    payment_id: int = Path(..., ge=1, description="The ID of the payment to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if payment exists
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if db_payment is None:
            raise ResourceNotFoundError("Payment", payment_id)
        
        # Delete payment
        db.delete(db_payment)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": payment_id},
            message=f"Payment {payment_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting payment {payment_id}", original_error=e)
