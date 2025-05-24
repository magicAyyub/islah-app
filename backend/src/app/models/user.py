from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship as orm_relationship
from datetime import datetime
from src.utils.enums import UserRole
from src.utils.database import Base

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

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}', full_name='{self.full_name}')>"
    
    def __str__(self):
        return f"{self.full_name} ({self.role})"