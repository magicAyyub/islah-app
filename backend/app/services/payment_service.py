from app.database.models import Payment, PaymentType
from datetime import datetime
from fastapi import HTTPException

def make_payment(db, payment):
    payment_data = payment.model_dump()
    # Convert string payment_type to enum
    payment_data['payment_type'] = PaymentType(payment_data['payment_type'])
    
    db_payment = Payment(**payment_data, payment_date=datetime.now())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payment(db, payment_id: int):
    """Get a payment by ID"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment
