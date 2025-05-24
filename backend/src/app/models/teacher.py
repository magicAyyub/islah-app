from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.database import Base

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
