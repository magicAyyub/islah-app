from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Boolean, ForeignKey, Enum, Text
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

class AttendanceStatus(enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class GradeType(enum.Enum):
    QUIZ = "quiz"
    TEST = "test"
    EXAM = "exam"
    HOMEWORK = "homework"
    PROJECT = "project"
    PARTICIPATION = "participation"

class AcademicPeriod(enum.Enum):
    FIRST_TERM = "first_term"
    SECOND_TERM = "second_term"
    THIRD_TERM = "third_term"
    FIRST_SEMESTER = "first_semester"
    SECOND_SEMESTER = "second_semester"

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

class StudentFlag(Base):
    __tablename__ = 'student_flags'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    flag_type = Column(String, nullable=False)  # "payment_issue", "bounced_check", "late_payment", "behavior", etc.
    reason = Column(String, nullable=False)
    flagged_date = Column(DateTime, default=datetime.now)
    flagged_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    is_active = Column(Boolean, default=True)
    resolved_date = Column(DateTime, nullable=True)
    resolved_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Relationships
    student = relationship("Student", backref="flags")
    flagged_by_user = relationship("User", foreign_keys=[flagged_by])
    resolved_by_user = relationship("User", foreign_keys=[resolved_by])

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "admin", "registration", "teacher"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)

class Subject(Base):
    __tablename__ = 'subjects'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # "Mathematics", "Arabic", "French"
    code = Column(String, unique=True, nullable=False)  # "MATH", "ARAB", "FREN"
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey('users.id'))  # Assigned teacher
    class_id = Column(Integer, ForeignKey('classes.id'))  # Class this subject is taught in
    academic_year = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    teacher = relationship("User", backref="subjects_taught")
    class_assigned = relationship("Class", backref="subjects")
    grades = relationship("Grade", backref="subject")

class Grade(Base):
    __tablename__ = 'grades'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    grade_value = Column(Float, nullable=False)  # The actual grade (0-20, 0-100, etc.)
    max_grade = Column(Float, nullable=False, default=20)  # Maximum possible grade
    grade_type = Column(Enum(GradeType), nullable=False)
    academic_period = Column(Enum(AcademicPeriod), nullable=False)
    academic_year = Column(String, nullable=False)
    assessment_date = Column(Date, nullable=False)
    comments = Column(Text)  # Teacher comments
    recorded_by = Column(Integer, ForeignKey('users.id'))  # Teacher who recorded
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    student = relationship("Student", backref="grades")
    recorded_by_user = relationship("User", backref="grades_recorded")

class Attendance(Base):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    attendance_date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)
    arrival_time = Column(DateTime)  # For late arrivals
    notes = Column(String)  # Reason for absence, etc.
    recorded_by = Column(Integer, ForeignKey('users.id'))  # Staff who recorded
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    student = relationship("Student", backref="attendance_records")
    class_attended = relationship("Class", backref="attendance_records")
    recorded_by_user = relationship("User", backref="attendance_recorded")
    
    # Ensure one attendance record per student per day per class
    __table_args__ = (
        {'extend_existing': True}
    )
