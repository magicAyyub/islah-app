from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.enums import NotificationType
from src.utils.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_type = Column(String(50), nullable=False)  # 'user', 'parent', 'teacher'
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    read_at = Column(DateTime, nullable=True)
    type = Column(Enum(NotificationType), nullable=False, default=NotificationType.INFO)

    # Relationships
    recipient = orm_relationship("User", back_populates="notifications")