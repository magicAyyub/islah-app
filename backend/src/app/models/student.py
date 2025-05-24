from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, func
from sqlalchemy.orm import relationship as orm_relationship
from datetime import datetime
from src.utils.enums import Gender, EnrollmentStatus
from src.utils.database import Base

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