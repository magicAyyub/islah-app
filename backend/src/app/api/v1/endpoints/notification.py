from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

import src.utils.dependencies as deps
from src.app.crud import notification as crud
from src.app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse
)
from src.utils.enums import NotificationType

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    recipient_id: Optional[int] = None,
    recipient_type: Optional[str] = None,
    notification_type: Optional[NotificationType] = None,
    is_read: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get notifications with optional filtering.
    """
    try:
        notifications, _ = crud.get_notifications(
            db=db,
            skip=skip,
            limit=limit,
            recipient_id=recipient_id,
            recipient_type=recipient_type,
            notification_type=notification_type,
            is_read=is_read,
            start_date=start_date,
            end_date=end_date
        )
        return notifications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Get a specific notification by ID.
    """
    try:
        return crud.get_notification(db=db, notification_id=notification_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_in: NotificationCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new notification.
    """
    try:
        return crud.create_notification(db=db, notification=notification_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{notification_id}", response_model=NotificationResponse)
def update_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_id: int,
    notification_in: NotificationUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update notification.
    """
    try:
        return crud.update_notification(db=db, notification_id=notification_id, notification=notification_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete("/{notification_id}")
def delete_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete notification.
    """
    try:
        result = crud.delete_notification(db=db, notification_id=notification_id)
        return {"status": "success", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    *,
    db: Session = Depends(deps.get_db),
    notification_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Mark a notification as read.
    """
    try:
        return crud.mark_notification_as_read(db=db, notification_id=notification_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.put("/read-all", response_model=dict)
def mark_all_as_read(
    *,
    db: Session = Depends(deps.get_db),
    recipient_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Mark all notifications as read for a recipient.
    """
    try:
        result = crud.mark_all_notifications_as_read(db=db, recipient_id=recipient_id)
        return {"status": "success", "updated_count": result["updated_count"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
