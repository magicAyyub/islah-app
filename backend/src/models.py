# src/models.py

from datetime import date, datetime, time
from typing import List, Optional
from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Float, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import relationship as orm_relationship  # Aliased to avoid potential conflicts
from sqlalchemy.sql import func

from src.utils.database import Base
from src.utils.enums import (
    UserRole, StudentGender, EnrollmentStatus, PaymentMethod, 
    PaymentType, PaymentStatus, InvoiceStatus, ReportCardStatus, 
    NotificationType, MessageType, AccessRequestStatus
)

# SQLAlchemy Models

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)

    # Relationships
    parent = orm_relationship("Parent", back_populates="user", uselist=False)
    teacher = orm_relationship("Teacher", back_populates="user", uselist=False)
    recorded_attendances = orm_relationship("Attendance", foreign_keys="Attendance.recorded_by", back_populates="recorder")
    validated_justifications = orm_relationship("AbsenceJustification", foreign_keys="AbsenceJustification.validated_by", back_populates="validator")
    recorded_payments = orm_relationship("Payment", foreign_keys="Payment.recorded_by", back_populates="recorder")
    published_report_cards = orm_relationship("ReportCard", foreign_keys="ReportCard.published_by", back_populates="publisher")
    notifications = orm_relationship("Notification", back_populates="user")
    sent_messages = orm_relationship("Message", foreign_keys="Message.sent_by", back_populates="sender")
    received_messages = orm_relationship("MessageRecipient", back_populates="user")
    processed_requests = orm_relationship("AccessRequest", foreign_keys="AccessRequest.processed_by", back_populates="processor")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(StudentGender), nullable=False)
    address = Column(String(255))
    photo = Column(String(255))
    external_id = Column(String(50), unique=True)
    is_active = Column(Boolean, default=True)
    registration_date = Column(Date, nullable=False)

    # Relationships
    parents = orm_relationship("ParentStudent", back_populates="student")
    enrollments = orm_relationship("Enrollment", back_populates="student")
    attendances = orm_relationship("Attendance", back_populates="student")
    payments = orm_relationship("Payment", back_populates="student")
    invoices = orm_relationship("Invoice", back_populates="student")
    report_cards = orm_relationship("ReportCard", back_populates="student")


class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    profession = Column(String(100))
    secondary_phone = Column(String(20))

    # Relationships
    user = orm_relationship("User", back_populates="parent")
    student_links = orm_relationship("ParentStudent", back_populates="parent")  # Renamed again


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    specialty = Column(String(100))
    hire_date = Column(Date)
    emergency_phone = Column(String(20))

    # Relationships
    user = orm_relationship("User", back_populates="teacher")
    evaluations = orm_relationship("Evaluation", back_populates="teacher")
    schedules = orm_relationship("Schedule", back_populates="teacher")
    class_assignments = orm_relationship("TeacherClassAssignment", back_populates="teacher")  # Add this line


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    level = Column(String(50), nullable=False)
    school_year = Column(String(20), nullable=False)
    time_slot = Column(String(20), nullable=False)  # morning, afternoon
    max_capacity = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    enrollments = orm_relationship("Enrollment", back_populates="class_")
    attendances = orm_relationship("Attendance", back_populates="class_")
    report_cards = orm_relationship("ReportCard", back_populates="class_")
    schedules = orm_relationship("Schedule", back_populates="class_")
    teacher_assignments = orm_relationship("TeacherClassAssignment", back_populates="class_")  # Add this line


# Add the new model for TeacherClassAssignment
class TeacherClassAssignment(Base):
    __tablename__ = "teachers_classes"

    teacher_id = Column(Integer, ForeignKey("teachers.id"), primary_key=True)
    class_id = Column(Integer, ForeignKey("classes.id"), primary_key=True)
    subject = Column(String(100), nullable=False)
    is_main_teacher = Column(Boolean, default=False)
    hours_per_week = Column(Integer)
    notes = Column(Text)

    # Relationships
    teacher = orm_relationship("Teacher", back_populates="class_assignments")
    class_ = orm_relationship("Class", back_populates="teacher_assignments")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    enrollment_date = Column(Date, nullable=False)
    status = Column(Enum(EnrollmentStatus), nullable=False)
    end_date = Column(Date)

    # Relationships
    student = orm_relationship("Student", back_populates="enrollments")
    class_ = orm_relationship("Class", back_populates="enrollments")


class ParentStudent(Base):
    __tablename__ = "parents_students"

    parent_id = Column(Integer, ForeignKey("parents.id"), primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), primary_key=True)
    relationship = Column(String(50), nullable=False)  # father, mother, guardian, etc.
    is_primary_contact = Column(Boolean, default=False)
    can_pickup = Column(Boolean, default=True)

    # Relationships
    parent = orm_relationship("Parent", back_populates="student_links")  # Updated to match renamed relationship
    student = orm_relationship("Student", back_populates="parents")


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    date = Column(Date, nullable=False)
    arrival_time = Column(Time)
    is_present = Column(Boolean, nullable=False)
    comment = Column(Text)
    recorded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    student = orm_relationship("Student", back_populates="attendances")
    class_ = orm_relationship("Class", back_populates="attendances")
    recorder = orm_relationship("User", foreign_keys=[recorded_by], back_populates="recorded_attendances")
    justifications = orm_relationship("AbsenceJustification", back_populates="attendance")


class AbsenceJustification(Base):
    __tablename__ = "absence_justifications"

    id = Column(Integer, primary_key=True, index=True)
    attendance_id = Column(Integer, ForeignKey("attendances.id"), nullable=False)
    reason = Column(String(100), nullable=False)
    description = Column(Text)
    document_url = Column(String(255))
    submission_date = Column(Date, nullable=False)
    is_validated = Column(Boolean, default=False)
    validated_by = Column(Integer, ForeignKey("users.id"))

    # Relationships
    attendance = orm_relationship("Attendance", back_populates="justifications")
    validator = orm_relationship("User", foreign_keys=[validated_by], back_populates="validated_justifications")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    reference = Column(String(100))
    type = Column(Enum(PaymentType), nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False)
    comment = Column(Text)
    recorded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    student = orm_relationship("Student", back_populates="payments")
    recorder = orm_relationship("User", foreign_keys=[recorded_by], back_populates="recorded_payments")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    amount = Column(Float, nullable=False)
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(InvoiceStatus), nullable=False)
    description = Column(Text)
    reference = Column(String(100), unique=True)

    # Relationships
    student = orm_relationship("Student", back_populates="invoices")
    items = orm_relationship("InvoiceItem", back_populates="invoice")


class ReportCard(Base):
    __tablename__ = "report_cards"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    term = Column(String(20), nullable=False)
    school_year = Column(String(20), nullable=False)
    publication_date = Column(Date)
    status = Column(Enum(ReportCardStatus), nullable=False)
    published_by = Column(Integer, ForeignKey("users.id"))

    # Relationships
    student = orm_relationship("Student", back_populates="report_cards")
    class_ = orm_relationship("Class", back_populates="report_cards")
    publisher = orm_relationship("User", foreign_keys=[published_by], back_populates="published_report_cards")
    evaluations = orm_relationship("Evaluation", back_populates="report_card")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    report_card_id = Column(Integer, ForeignKey("report_cards.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    grade = Column(String(20))  # Can be numeric or textual (e.g., "Very good")
    comment = Column(Text)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)

    # Relationships
    report_card = orm_relationship("ReportCard", back_populates="evaluations")
    teacher = orm_relationship("Teacher", back_populates="evaluations")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    day = Column(String(20), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    subject = Column(String(100), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    room = Column(String(50))

    # Relationships
    class_ = orm_relationship("Class", back_populates="schedules")
    teacher = orm_relationship("Teacher", back_populates="schedules")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    is_read = Column(Boolean, default=False)
    type = Column(Enum(NotificationType), nullable=False)
    link = Column(String(255))

    # Relationships
    user = orm_relationship("User", back_populates="notifications")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, server_default=func.now())
    type = Column(Enum(MessageType), nullable=False)
    sent_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=True)  # Add reference to conversation

    # Relationships
    sender = orm_relationship("User", foreign_keys=[sent_by], back_populates="sent_messages")
    recipients = orm_relationship("MessageRecipient", back_populates="message")
    conversation = orm_relationship("Conversation", back_populates="messages")  # Add relationship to conversation


# Add the Conversation model
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    participant1_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    participant2_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    last_message_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    participant1 = orm_relationship("User", foreign_keys=[participant1_id])
    participant2 = orm_relationship("User", foreign_keys=[participant2_id])
    messages = orm_relationship("Message", back_populates="conversation")


class MessageRecipient(Base):
    __tablename__ = "message_recipients"

    message_id = Column(Integer, ForeignKey("messages.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)

    # Relationships
    message = orm_relationship("Message", back_populates="recipients")
    user = orm_relationship("User", back_populates="received_messages")


class AccessRequest(Base):
    __tablename__ = "access_requests"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    role = Column(String(100), nullable=False)
    message = Column(Text)
    request_date = Column(DateTime, server_default=func.now())
    status = Column(Enum(AccessRequestStatus), nullable=False, default=AccessRequestStatus.PENDING)
    processed_by = Column(Integer, ForeignKey("users.id"))
    processed_at = Column(DateTime)

    # Relationships
    processor = orm_relationship("User", foreign_keys=[processed_by], back_populates="processed_requests")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)
    item_type = Column(String(50), nullable=True)  # e.g., tuition, books, uniform, activity
    
    # Relationships
    invoice = orm_relationship("Invoice", back_populates="items")

class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(Text)
    category = Column(String(50))