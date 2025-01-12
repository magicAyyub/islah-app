from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date, DECIMAL
from sqlalchemy.orm import relationship
from .database import Base

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    teacher = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    registered = Column(Integer, default=0)

    students = relationship("Student", back_populates="class_")
    payments = relationship("Payment", back_populates="class_")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"))
    birth_date = Column(Date)
    registration_date = Column(String(50))

    class_ = relationship("Class", back_populates="students")
    payments = relationship("Payment", back_populates="student")


class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    phone = Column(String(20))
    registration_date = Column(String(100))


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))
    amount = Column(DECIMAL(10, 2), nullable=False)
    date = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)

    student = relationship("Student", back_populates="payments")
    class_ = relationship("Class", back_populates="payments")