from sqlalchemy import Column, Integer, Float, Text, ForeignKey, String
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.database import Base

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