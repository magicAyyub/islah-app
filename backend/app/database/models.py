from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(Date)
    place_of_birth = Column(String)
    gender = Column(String)
    parent_id = Column(Integer, ForeignKey('parents.id'))
    class_id = Column(Integer, ForeignKey('classes.id'))

class Parent(Base):
    __tablename__ = 'parents'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    address = Column(String)
    locality = Column(String)
    phone = Column(String)
    mobile = Column(String)
    email = Column(String)
    students = relationship("Student", backref="parent")

class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String)
    time_slot = Column(String)
    capacity = Column(Integer)
    students = relationship("Student", backref="class")

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    amount = Column(Float)
    payment_date = Column(DateTime)
    payment_method = Column(String)
