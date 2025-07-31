from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum

Base = declarative_base()

class RegistrationStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed" 
    CANCELLED = "cancelled"

class PaymentType(enum.Enum):
    INSCRIPTION = "inscription"
    QUARTERLY = "quarterly"

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    place_of_birth = Column(String)
    gender = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey('parents.id'), nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'))
    registration_status = Column(Enum(RegistrationStatus), default=RegistrationStatus.PENDING)
    registration_date = Column(DateTime, default=datetime.now)
    academic_year = Column(String, nullable=False)  # e.g., "2024-2025"
    registered_by = Column(Integer, ForeignKey('users.id'))  # Staff who registered

class Parent(Base):
    __tablename__ = 'parents'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    address = Column(String)
    locality = Column(String)
    phone = Column(String)
    mobile = Column(String)
    email = Column(String)
    students = relationship("Student", backref="parent")

class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Maternelle 1 - Matin"
    level = Column(String, nullable=False)  # e.g., "Maternelle 1"
    time_slot = Column(String, nullable=False)  # "10h-13h" or "14h-17h"
    capacity = Column(Integer, nullable=False)
    academic_year = Column(String, nullable=False)
    created_date = Column(DateTime, default=datetime.now)
    students = relationship("Student", backref="class")

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(DateTime, default=datetime.now)
    payment_method = Column(String, nullable=False)  # "Cash", "Check", "Card"
    payment_type = Column(Enum(PaymentType), nullable=False)
    receipt_number = Column(String, unique=True)  # Auto-generated receipt number
    notes = Column(String)
    processed_by = Column(Integer, ForeignKey('users.id'))  # Staff who processed payment

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "admin", "registration", "teacher"
    is_active = Column(Boolean, default=True)
    created_date = Column(DateTime, default=datetime.now)
    amount = Column(Float)
    payment_date = Column(DateTime)
    payment_method = Column(String)
