from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    grades = orm_relationship("Grade", back_populates="subject")

    def __repr__(self):
        return f"<Subject(id={self.id}, name='{self.name}')>"