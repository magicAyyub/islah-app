from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils import schemas, models
from typing import List, Optional

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)

@router.post("/", response_model=schemas.NotificationResponse)
def create_notification(
    notification_data: schemas.NotificationCreate,
    db: Session = Depends(get_db)
):
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == notification_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_notification = models.Notification(**notification_data.dict())
    db.add(db_notification)
    try:
        db.commit()
        db.refresh(db_notification)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_notification

@router.get("/", response_model=List[schemas.NotificationResponse])
def get_notifications(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Notification)
    if student_id:
        query = query.filter(models.Notification.student_id == student_id)
    if type:
        query = query.filter(models.Notification.type == type)
    if status:
        query = query.filter(models.Notification.status == status)
    return query.offset(skip).limit(limit).all()

@router.put("/{notification_id}", response_model=schemas.NotificationResponse)
def update_notification_status(
    notification_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    db_notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db_notification.status = status
    try:
        db.commit()
        db.refresh(db_notification)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_notification