from app.database.models import Payment, PaymentType
from datetime import datetime

def make_payment(db, payment):
    payment_data = payment.model_dump()
    # Convert string payment_type to enum
    payment_data['payment_type'] = PaymentType(payment_data['payment_type'])
    
    db_payment = Payment(**payment_data, payment_date=datetime.now())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
