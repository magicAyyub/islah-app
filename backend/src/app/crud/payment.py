from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

from src.app.models.payment import Payment
from src.app.models.student import Student
from src.app.schemas.payment import PaymentCreate, PaymentUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query
from src.utils.enums import PaymentType, PaymentMethod, PaymentStatus

def get_payments(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    payment_type: Optional[PaymentType] = None,
    payment_method: Optional[PaymentMethod] = None,
    status: Optional[PaymentStatus] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Tuple[List[Payment], Dict[str, Any]]:
    """
    Get payments with optional filtering and pagination.
    Returns a tuple of (payments, pagination_meta).
    """
    try:
        query = db.query(Payment)
        
        if student_id:
            query = query.filter(Payment.student_id == student_id)
        
        if payment_type:
            query = query.filter(Payment.type == payment_type)
        
        if payment_method:
            query = query.filter(Payment.method == payment_method)
        
        if status:
            query = query.filter(Payment.status == status)
        
        if start_date:
            query = query.filter(Payment.date >= start_date)
        
        if end_date:
            query = query.filter(Payment.date <= end_date)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving payments", original_error=e)

def get_payment(db: Session, payment_id: int) -> Payment:
    """Get a single payment by ID."""
    try:
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if db_payment is None:
            raise ResourceNotFoundError("Payment", payment_id)
        return db_payment
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving payment {payment_id}", original_error=e)

def validate_payment_data(db: Session, payment_data: PaymentCreate | PaymentUpdate) -> None:
    """Validate payment data before creation or update."""
    validation_errors = []
    
    if hasattr(payment_data, 'student_id') and payment_data.student_id is not None:
        if payment_data.student_id <= 0:
            validation_errors.append({
                "field": "student_id",
                "message": f"Invalid student_id: {payment_data.student_id}. Must be a positive integer."
            })
        else:
            student = db.query(Student).filter(Student.id == payment_data.student_id).first()
            if not student:
                validation_errors.append({
                    "field": "student_id",
                    "message": f"Student with ID {payment_data.student_id} does not exist."
                })
    
    if hasattr(payment_data, 'amount') and payment_data.amount is not None:
        if payment_data.amount <= 0:
            validation_errors.append({
                "field": "amount",
                "message": "Payment amount must be greater than zero."
            })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_payment(db: Session, payment: PaymentCreate) -> Payment:
    """Create a new payment."""
    try:
        validate_payment_data(db, payment)
        
        db_payment = Payment(
            student_id=payment.student_id,
            amount=payment.amount,
            type=payment.type,
            method=payment.method,
            date=payment.date,
            status=payment.status if hasattr(payment, 'status') else PaymentStatus.PENDING
        )
        
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating payment: {str(e)}")

def update_payment(db: Session, payment_id: int, payment: PaymentUpdate) -> Payment:
    """Update an existing payment."""
    try:
        db_payment = get_payment(db, payment_id)
        validate_payment_data(db, payment)
        
        update_data = payment.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_payment, key, value)
        
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating payment: {str(e)}")

def delete_payment(db: Session, payment_id: int) -> Dict[str, Any]:
    """Delete a payment."""
    try:
        db_payment = get_payment(db, payment_id)
        db.delete(db_payment)
        db.commit()
        return {"id": payment_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting payment: {str(e)}")

def update_payment_status(db: Session, payment_id: int, status: PaymentStatus) -> Payment:
    """Update the status of a payment."""
    try:
        db_payment = get_payment(db, payment_id)
        db_payment.status = status
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating payment status: {str(e)}") 