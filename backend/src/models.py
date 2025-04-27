# src/models.py

from datetime import date, datetime, time
from typing import List, Optional
from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Float, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import relationship as orm_relationship
from sqlalchemy.sql import func

from src.utils.database import Base
from src.utils.enums import (
    UserRole, Gender, EnrollmentStatus, PaymentMethod, 
    PaymentType, PaymentStatus, AttendanceStatus, ReportCardStatus, 
    NotificationType, AccessRequestStatus, AccessRequestType
)

# SQLAlchemy Models

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    full_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    teacher = orm_relationship("Teacher", back_populates="user", uselist=False)
    parent = orm_relationship("Parent", back_populates="user", uselist=False)
    notifications = orm_relationship("Notification", back_populates="recipient")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    status = Column(Enum(EnrollmentStatus), nullable=False, default=EnrollmentStatus.ACTIVE)
    enrolled_at = Column(Date, nullable=False, default=func.current_date())
    current_class_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    parent_id = Column(Integer, ForeignKey("parents.id"), nullable=True)

    # Relationships
    parent = orm_relationship("Parent", back_populates="students")
    current_class = orm_relationship("Classroom", back_populates="students")
    grades = orm_relationship("Grade", back_populates="student")
    payments = orm_relationship("Payment", back_populates="student")
    attendances = orm_relationship("Attendance", back_populates="student")


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


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    user = orm_relationship("User", back_populates="teacher")
    classrooms = orm_relationship("Classroom", back_populates="teacher")


class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    classrooms = orm_relationship("Classroom", back_populates="level")


class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False)
    level_id = Column(Integer, ForeignKey("levels.id"), nullable=False)
    schedule = Column(String(255), nullable=True)
    capacity = Column(Integer, nullable=False, default=30)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    # Relationships
    level = orm_relationship("Level", back_populates="classrooms")
    teacher = orm_relationship("Teacher", back_populates="classrooms")
    students = orm_relationship("Student", back_populates="current_class")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    grades = orm_relationship("Grade", back_populates="subject")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    term = Column(String(20), nullable=False)
    score = Column(Float, nullable=True)
    comment = Column(Text, nullable=True)

    # Relationships
    student = orm_relationship("Student", back_populates="grades")
    subject = orm_relationship("Subject", back_populates="grades")


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


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(Date, nullable=False, default=func.current_date())
    status = Column(Enum(AttendanceStatus), nullable=False, default=AttendanceStatus.PRESENT)

    # Relationships
    student = orm_relationship("Student", back_populates="attendances")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_type = Column(String(50), nullable=False)  # 'user', 'parent', 'teacher'
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    read_at = Column(DateTime, nullable=True)
    type = Column(Enum(NotificationType), nullable=False, default=NotificationType.INFO)

    # Relationships
    recipient = orm_relationship("User", back_populates="notifications")
