from app.database.models import Payment
from datetime import datetime

def make_payment(db, payment):
    db_payment = Payment(**payment.model_dump(), payment_date=datetime.now())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
