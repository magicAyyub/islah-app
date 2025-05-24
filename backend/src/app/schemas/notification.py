from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from src.utils.enums import NotificationType

class NotificationBase(BaseModel):
    recipient_type: str
    recipient_id: int
    message: str
    type: NotificationType = NotificationType.INFO

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    message: Optional[str] = None
    read_at: Optional[datetime] = None
    type: Optional[NotificationType] = None
    
class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True