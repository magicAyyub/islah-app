# src/routes/notifications.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Optional, Any
from datetime import datetime

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.utils.pagination import get_pagination_meta
from src.models import Notification, User
from src.schemas import NotificationCreate, NotificationUpdate, NotificationResponse
from src.utils.error_handlers import (
    ResourceNotFoundError,
    ValidationError,
    DatabaseError
)
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Notification not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[NotificationResponse],
    summary="Get all notifications",
    description="Retrieve a list of all notifications with optional filtering and pagination"
)
async def read_notifications(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    recipient_id: Optional[int] = Query(None, description="Filter by recipient ID"),
    recipient_type: Optional[str] = Query(None, description="Filter by recipient type"),
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Notification)
        
        # Apply filters
        if recipient_id:
            query = query.filter(Notification.recipient_id == recipient_id)
        
        if recipient_type:
            query = query.filter(Notification.recipient_type == recipient_type)
        
        if is_read is not None:
            query = query.filter(Notification.read_at != None if is_read else Notification.read_at == None)
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        notifications = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        
        return PaginatedResponse(
            success=True,
            data=notifications,
            message=f"Retrieved {len(notifications)} notification records",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving notifications", original_error=str(e))

@router.get(
    "/count",
    response_model=APIResponse[int],
    summary="Count notifications",
    description="Get the total number of notifications with optional filtering"
)
async def count_notifications(
    recipient_id: Optional[int] = Query(None, description="Filter by recipient ID"),
    recipient_type: Optional[str] = Query(None, description="Filter by recipient type"),
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        query = db.query(Notification)
        
        # Apply filters
        if recipient_id:
            query = query.filter(Notification.recipient_id == recipient_id)
        
        if recipient_type:
            query = query.filter(Notification.recipient_type == recipient_type)
        
        if is_read is not None:
            query = query.filter(Notification.read_at != None if is_read else Notification.read_at == None)
            
        total_notifications = query.count()
        
        return APIResponse(
            success=True,
            data=total_notifications,
            message="Total number of notifications"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error counting notifications", original_error=str(e))

@router.get(
    "/{notification_id}", 
    response_model=APIResponse[NotificationResponse],
    summary="Get notification by ID",
    description="Retrieve detailed information about a specific notification"
)
async def read_notification(
    notification_id: int = Path(..., ge=1, description="The ID of the notification to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_notification is None:
            raise ResourceNotFoundError("Notification", notification_id)
        
        # Check authorization - users can only view their own notifications unless admin/staff
        if db_notification.recipient_id != current_user.id and current_user.role not in ["admin", "staff"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this notification"
            )
        
        return APIResponse(
            success=True,
            data=db_notification,
            message=f"Retrieved notification {notification_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except HTTPException as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving notification {notification_id}", original_error=str(e))

@router.post(
    "/", 
    response_model=APIResponse[NotificationResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new notification",
    description="Create a new notification with the provided details"
)
async def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Validate recipient existence if needed
        # (Add logic here if you need to validate recipient_id exists in its respective table)
        
        # Create notification
        db_notification = Notification(
            recipient_type=notification.recipient_type,
            recipient_id=notification.recipient_id,
            message=notification.message,
            type=notification.type,
            created_at=datetime.now()
        )
        
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        return APIResponse(
            success=True,
            data=db_notification,
            message=f"Notification created successfully for {notification.recipient_type} {notification.recipient_id}"
        )
    except ValidationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating notification", original_error=str(e))

@router.put(
    "/{notification_id}", 
    response_model=APIResponse[NotificationResponse],
    summary="Update a notification",
    description="Update an existing notification with the provided details"
)
async def update_notification(
    notification_id: int = Path(..., ge=1, description="The ID of the notification to update"),
    notification: NotificationUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if notification exists
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_notification is None:
            raise ResourceNotFoundError("Notification", notification_id)
        
        # Only allow updating read status if the notification belongs to the current user
        if db_notification.recipient_id != current_user.id and current_user.role not in ["admin", "staff"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this notification"
            )
        
        # Update notification
        update_data = notification.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_notification, key, value)
        
        db.commit()
        db.refresh(db_notification)
        
        return APIResponse(
            success=True,
            data=db_notification,
            message=f"Notification {notification_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except HTTPException as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating notification {notification_id}", original_error=str(e))

@router.delete(
    "/{notification_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a notification",
    description="Delete a notification by ID"
)
async def delete_notification(
    notification_id: int = Path(..., ge=1, description="The ID of the notification to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if notification exists
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_notification is None:
            raise ResourceNotFoundError("Notification", notification_id)
        
        # Delete notification
        db.delete(db_notification)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": notification_id},
            message=f"Notification {notification_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting notification {notification_id}", original_error=str(e))

@router.post(
    "/{notification_id}/mark-as-read", 
    response_model=APIResponse[NotificationResponse],
    summary="Mark notification as read",
    description="Mark a notification as read by setting the read_at timestamp"
)
async def mark_notification_as_read(
    notification_id: int = Path(..., ge=1, description="The ID of the notification to mark as read"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if notification exists
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_notification is None:
            raise ResourceNotFoundError("Notification", notification_id)
        
        # Only allow marking as read if the notification belongs to the current user
        if db_notification.recipient_id != current_user.id and current_user.role not in ["admin", "staff"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this notification"
            )
        
        # Mark as read
        db_notification.read_at = datetime.now()
        
        db.commit()
        db.refresh(db_notification)
        
        return APIResponse(
            success=True,
            data=db_notification,
            message=f"Notification {notification_id} marked as read"
        )
    except ResourceNotFoundError as e:
        raise e
    except HTTPException as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error marking notification {notification_id} as read", original_error=str(e))

@router.get(
    "/unread/count",
    response_model=APIResponse[int],
    summary="Count unread notifications",
    description="Get the total number of unread notifications for the current user"
)
async def count_unread_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        query = db.query(Notification).filter(
            Notification.recipient_id == current_user.id,
            Notification.read_at == None
        )
        
        unread_count = query.count()
        
        return APIResponse(
            success=True,
            data=unread_count,
            message="Number of unread notifications"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error counting unread notifications", original_error=str(e))

@router.post(
    "/mark-all-as-read",
    response_model=APIResponse[Dict[str, Any]],
    summary="Mark all notifications as read",
    description="Mark all notifications of the current user as read"
)
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Find all unread notifications for this user
        unread_notifications = db.query(Notification).filter(
            Notification.recipient_id == current_user.id,
            Notification.read_at == None
        ).all()
        
        # Mark all as read
        now = datetime.now()
        count = 0
        
        for notification in unread_notifications:
            notification.read_at = now
            count += 1
        
        db.commit()
        
        return APIResponse(
            success=True,
            data={"count": count},
            message=f"{count} notifications marked as read"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error marking all notifications as read", original_error=str(e))
