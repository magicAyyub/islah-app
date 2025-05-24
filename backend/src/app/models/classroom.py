from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.database import Base

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