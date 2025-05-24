from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from datetime import datetime
from src.utils.enums import Gender, EnrollmentStatus
from src.utils.database import Base

class Parent(Base):     
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    address = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    user = orm_relationship("User", back_populates="parent")
    students = orm_relationship("Student", back_populates="parent")