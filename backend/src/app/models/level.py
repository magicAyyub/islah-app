from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.database import Base

class Level(Base):  
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    classrooms = orm_relationship("Classroom", back_populates="level")