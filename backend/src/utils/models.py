from sqlalchemy import (
    Column, ForeignKey, Integer, String, Date,
    Text, CheckConstraint, TIMESTAMP, Enum, Numeric, Time
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from src.utils.database import Base

# Enum classes
class RoleEnum(enum.Enum):
    admin = "admin"
    agent = "agent"
    direction = "direction"

class GuardianRoleEnum(enum.Enum):
    father = "father"
    mother = "mother"
    guardian = "guardian"

class GenderEnum(enum.Enum):
    male = "male"
    female = "female"
    other = "other"

class DayOfWeekEnum(enum.Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"

class EnrollmentStatusEnum(enum.Enum):
    active = "active"
    completed = "completed"
    withdrawn = "withdrawn"

class PaymentMethodEnum(enum.Enum):
    cash = "cash"
    card = "card"
    transfer = "transfer"

class NotificationTypeEnum(enum.Enum):
    payment_reminder = "payment_reminder"
    re_enrollment_reminder = "re_enrollment_reminder"

class NotificationStatusEnum(enum.Enum):
    pending = "pending"
    sent = "sent"

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(Enum(GuardianRoleEnum), nullable=False)
    phone_number = Column(String(15), nullable=False)
    email = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    students = relationship("Student", secondary="student_guardians", back_populates="guardians")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    guardians = relationship("Guardian", secondary="student_guardians", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")
    payments = relationship("Payment", back_populates="student")
    notifications = relationship("Notification", back_populates="student")

class StudentGuardian(Base):
    __tablename__ = "student_guardians"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    guardian_id = Column(Integer, ForeignKey("guardians.id", ondelete="CASCADE"), nullable=False)

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    registered = Column(Integer, default=0)
    day_of_week = Column(Enum(DayOfWeekEnum), nullable=False)
    start_time = Column(String(5), nullable=False)
    end_time = Column(String(5), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    __table_args__ = (
        CheckConstraint('capacity > 0', name='capacity_positive'),
        CheckConstraint('registered >= 0', name='registered_positive'),
        CheckConstraint('registered <= capacity', name='registered_not_exceed_capacity'),
    )

    enrollments = relationship("Enrollment", back_populates="class_")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    enrollment_date = Column(Date, server_default=func.current_date())
    status = Column(Enum(EnrollmentStatusEnum), nullable=False)

    student = relationship("Student", back_populates="enrollments")
    class_ = relationship("Class", back_populates="enrollments")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    due_date = Column(Date, nullable=False)
    payment_date = Column(TIMESTAMP, server_default=func.current_timestamp())
    method = Column(Enum(PaymentMethodEnum), nullable=False)
    description = Column(Text)

    student = relationship("Student", back_populates="payments")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NotificationTypeEnum), nullable=False)
    created_by = Column(Integer, nullable=False)
    status = Column(Enum(NotificationStatusEnum), nullable=False, default="pending")
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    student = relationship("Student", back_populates="notifications")