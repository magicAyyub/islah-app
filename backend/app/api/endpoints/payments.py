from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services import payment_service
from app.database.session import get_db
from app.api.pagination import PaginatedResponse, paginate_query, create_paginated_response
from app.api.search import PaymentSearchFilters, apply_payment_filters
from app.database.models import Payment, User
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=PaymentResponse)
def make_payment(
    payment: PaymentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    return payment_service.make_payment(db=db, payment=payment)

@router.get("/", response_model=PaginatedResponse[PaymentResponse])
def get_payments(
    # Pagination parameters
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    
    # Search parameters
    search: Optional[str] = Query(None, description="Search in student names and receipt numbers"),
    student_id: Optional[int] = Query(None, description="Filter by student ID"),
    payment_type: Optional[str] = Query(None, description="Filter by payment type"),
    payment_method: Optional[str] = Query(None, description="Filter by payment method"),
    date_from: Optional[date] = Query(None, description="Filter payments from date"),
    date_to: Optional[date] = Query(None, description="Filter payments to date"),
    amount_min: Optional[float] = Query(None, ge=0, description="Minimum payment amount"),
    amount_max: Optional[float] = Query(None, ge=0, description="Maximum payment amount"),
    
    # Sorting
    sort_by: Optional[str] = Query("payment_date", description="Sort by field"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$", description="Sort order"),
    
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """
    Get paginated list of payments with search and filtering capabilities.
    """
    # Create search filters
    filters = PaymentSearchFilters(
        search=search,
        student_id=student_id,
        payment_type=payment_type,
        payment_method=payment_method,
        date_from=date_from,
        date_to=date_to,
        amount_min=amount_min,
        amount_max=amount_max
    )
    
    # Start with base query
    query = db.query(Payment)
    
    # Apply search filters
    query = apply_payment_filters(query, filters)
    
    # Apply sorting
    if sort_by and hasattr(Payment, sort_by):
        sort_column = getattr(Payment, sort_by)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    else:
        # Default sorting by payment date (newest first)
        query = query.order_by(Payment.payment_date.desc())
    
    # Apply pagination
    paginated_query, pagination_metadata = paginate_query(query, page, size)
    
    # Execute query and get results
    payments = paginated_query.all()
    
    # Convert to response models
    payment_responses = [PaymentResponse.model_validate(payment) for payment in payments]
    
    return create_paginated_response(payment_responses, pagination_metadata)

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = payment_service.get_payment(db=db, payment_id=payment_id)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment
