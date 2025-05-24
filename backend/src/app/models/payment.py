from sqlalchemy import Column, Integer, Float, Date, Enum, ForeignKey, func
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.enums import PaymentType, PaymentMethod, PaymentStatus
from src.utils.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum(PaymentType), nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    date = Column(Date, nullable=False, default=func.current_date())
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)

    # Relationships
    student = orm_relationship("Student", back_populates="payments")