# src/routes/notifications.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Notification, User
from src.schemas import (
    NotificationCreate, NotificationUpdate, NotificationResponse, 
    BulkNotificationCreate
)
from src.utils.notifications import send_notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[NotificationResponse])
async def read_notifications(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    is_read: Optional[bool] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Notification)
    
    # If no user_id is provided, show only current user's notifications
    if user_id:
        if current_user.role != "admin" and user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view other users' notifications"
            )
        query = query.filter(Notification.user_id == user_id)
    else:
        query = query.filter(Notification.user_id == current_user.id)
    
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    
    if category:
        query = query.filter(Notification.category == category)
    
    notifications = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    return notifications

@router.get("/unread-count", response_model=int)
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    return count

@router.get("/{notification_id}", response_model=NotificationResponse)
async def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Check if user is authorized to view this notification
    if notification.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this notification"
        )
    
    return notification

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification: NotificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if user exists
    user = db.query(User).filter(User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_notification = Notification(
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        category=notification.category,
        link=notification.link,
        created_at=datetime.utcnow(),
        is_read=False
    )
    
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    # Send notification in background
    background_tasks.add_task(
        send_notification,
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message
    )
    
    return db_notification

@router.post("/bulk", response_model=List[NotificationResponse], status_code=status.HTTP_201_CREATED)
async def create_bulk_notifications(
    notification: BulkNotificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    created_notifications = []
    
    for user_id in notification.user_ids:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            continue  # Skip non-existent users
        
        db_notification = Notification(
            user_id=user_id,
            title=notification.title,
            message=notification.message,
            category=notification.category,
            link=notification.link,
            created_at=datetime.utcnow(),
            is_read=False
        )
        
        db.add(db_notification)
        created_notifications.append(db_notification)
        
        # Send notification in background
        background_tasks.add_task(
            send_notification,
            user_id=user_id,
            title=notification.title,
            message=notification.message
        )
    
    db.commit()
    
    # Refresh all notifications
    for notification in created_notifications:
        db.refresh(notification)
    
    return created_notifications

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Check if user is authorized to update this notification
    if notification.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this notification"
        )
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    
    db.commit()
    db.refresh(notification)
    
    return notification

@router.put("/mark-all-read", response_model=int)
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    
    db.commit()
    
    return result  # Returns number of updated notifications