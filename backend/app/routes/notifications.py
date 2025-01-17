from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Payment
from pydantic import BaseModel
from datetime import datetime
from utils import schemas, models
from typing import Optional, List
from datetime import date

router = APIRouter(
    tags=["Notifications"]
)

db_dependency = Depends(get_db)

@router.get("/notifications/", response_model=List[schemas.NotificationResponse])
async def get_notifications(
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
    student_id: Optional[int] = None,
    notification_type: Optional[schemas.NotificationType] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Notification)
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    if student_id:
        query = query.filter(models.Notification.student_id == student_id)
    if notification_type:
        query = query.filter(models.Notification.type == notification_type)
    return query.offset(skip).limit(limit).all()

@router.post("/notifications/{notification_id}/mark-read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    notification.read_at = datetime.now()
    db.commit()
    return {"message": "Notification marked as read"}