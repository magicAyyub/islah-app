from sqlalchemy import (
    Boolean, Column, ForeignKey, Integer, String, DateTime, Date, 
    DECIMAL, Text, Enum, Table, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

# Enums for static values
class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"

class RelationType(str, enum.Enum):
    mother = "mother"
    father = "father"
    guardian = "guardian"
    other = "other"

class NotificationType(str, enum.Enum):
    payment_due = "payment_due"
    payment_overdue = "payment_overdue"
    payment_received = "payment_received"
    payment_failed = "payment_failed"

# Association table for student-parent relationship
student_parents = Table(
    'student_parents',
    Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id', ondelete='CASCADE')),
    Column('parent_id', Integer, ForeignKey('parents.id', ondelete='CASCADE')),
    Column('relationship_type', Enum(RelationType), nullable=False),
    Column('is_primary_contact', Boolean, default=False),
    Column('created_at', DateTime, server_default=func.now())
)

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    teacher = Column(String(100), nullable=False)
    description = Column(Text)
    capacity = Column(Integer, nullable=False)
    registered = Column(Integer, default=0)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    students = relationship("Student", back_populates="class_")
    payments = relationship("Payment", back_populates="class_")
    attendance_records = relationship("Attendance", back_populates="class_")

    # Constraints
    __table_args__ = (
        CheckConstraint('capacity > 0', name='check_positive_capacity'),
        CheckConstraint('registered >= 0', name='check_positive_registered'),
        CheckConstraint('registered <= capacity', name='check_capacity_not_exceeded'),
        CheckConstraint('end_date >= start_date', name='check_valid_date_range'),
    )

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="SET NULL"))
    birth_date = Column(Date, nullable=False)
    registration_date = Column(DateTime, server_default=func.now())
    active = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    class_ = relationship("Class", back_populates="students")
    payments = relationship("Payment", back_populates="student")
    parents = relationship("Parent", secondary=student_parents, back_populates="students")
    attendance_records = relationship("Attendance", back_populates="student")
    notifications = relationship("Notification", back_populates="student")

    # Constraints
    __table_args__ = (
        CheckConstraint('birth_date <= CURRENT_DATE', name='check_valid_birth_date'),
    )

class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(20), nullable=False)
    address = Column(Text)
    registration_date = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    students = relationship("Student", secondary=student_parents, back_populates="parents")

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'",
            name='check_valid_email'
        ),
    )

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="RESTRICT"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="RESTRICT"), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    payment_date = Column(DateTime, server_default=func.now())
    due_date = Column(Date, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    payment_method = Column(String(50))
    transaction_id = Column(String(100), unique=True)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("Student", back_populates="payments")
    class_ = relationship("Class", back_populates="payments")
    notifications = relationship("Notification", back_populates="payment")

    # Constraints
    __table_args__ = (
        CheckConstraint('amount > 0', name='check_positive_amount'),
    )

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    class_ = relationship("Class", back_populates="attendance_records")

    # Constraints
    __table_args__ = (
        UniqueConstraint('student_id', 'class_id', 'attendance_date', name='unique_attendance_record'),
        CheckConstraint(
            "status IN ('present', 'absent', 'late', 'excused')",
            name='check_valid_attendance_status'
        ),
    )

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    sent_at = Column(DateTime)
    read_at = Column(DateTime)

    # Relationships
    student = relationship("Student", back_populates="notifications")
    payment = relationship("Payment", back_populates="notifications")