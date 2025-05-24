from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

from src.app.models.notification import Notification
from src.app.models.user import User
from src.app.schemas.notification import NotificationCreate, NotificationUpdate
from src.utils.error_handlers import ResourceNotFoundError, ValidationError, DatabaseError
from src.utils.pagination import paginate_query
from src.utils.enums import NotificationType

def get_notifications(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    recipient_id: Optional[int] = None,
    recipient_type: Optional[str] = None,
    notification_type: Optional[NotificationType] = None,
    is_read: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> Tuple[List[Notification], Dict[str, Any]]:
    """
    Get notifications with optional filtering and pagination.
    Returns a tuple of (notifications, pagination_meta).
    """
    try:
        query = db.query(Notification)
        
        if recipient_id:
            query = query.filter(Notification.recipient_id == recipient_id)
        
        if recipient_type:
            query = query.filter(Notification.recipient_type == recipient_type)
        
        if notification_type:
            query = query.filter(Notification.type == notification_type)
        
        if is_read is not None:
            if is_read:
                query = query.filter(Notification.read_at.isnot(None))
            else:
                query = query.filter(Notification.read_at.is_(None))
        
        if start_date:
            query = query.filter(Notification.created_at >= start_date)
        
        if end_date:
            query = query.filter(Notification.created_at <= end_date)
        
        return paginate_query(query, skip, limit)
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving notifications", original_error=e)

def get_notification(db: Session, notification_id: int) -> Notification:
    """Get a single notification by ID."""
    try:
        db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_notification is None:
            raise ResourceNotFoundError("Notification", notification_id)
        return db_notification
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving notification {notification_id}", original_error=e)

def validate_notification_data(db: Session, notification_data: NotificationCreate | NotificationUpdate) -> None:
    """Validate notification data before creation or update."""
    validation_errors = []
    
    if hasattr(notification_data, 'recipient_id') and notification_data.recipient_id is not None:
        if notification_data.recipient_id <= 0:
            validation_errors.append({
                "field": "recipient_id",
                "message": f"Invalid recipient_id: {notification_data.recipient_id}. Must be a positive integer."
            })
        else:
            user = db.query(User).filter(User.id == notification_data.recipient_id).first()
            if not user:
                validation_errors.append({
                    "field": "recipient_id",
                    "message": f"User with ID {notification_data.recipient_id} does not exist."
                })
    
    if validation_errors:
        raise ValidationError(errors=validation_errors)

def create_notification(db: Session, notification: NotificationCreate) -> Notification:
    """Create a new notification."""
    try:
        validate_notification_data(db, notification)
        
        db_notification = Notification(
            recipient_type=notification.recipient_type,
            recipient_id=notification.recipient_id,
            message=notification.message,
            type=notification.type if hasattr(notification, 'type') else NotificationType.INFO
        )
        
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification
    except (ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating notification: {str(e)}")

def update_notification(db: Session, notification_id: int, notification: NotificationUpdate) -> Notification:
    """Update an existing notification."""
    try:
        db_notification = get_notification(db, notification_id)
        validate_notification_data(db, notification)
        
        update_data = notification.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_notification, key, value)
        
        db.commit()
        db.refresh(db_notification)
        return db_notification
    except (ResourceNotFoundError, ValidationError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating notification: {str(e)}")

def delete_notification(db: Session, notification_id: int) -> Dict[str, Any]:
    """Delete a notification."""
    try:
        db_notification = get_notification(db, notification_id)
        db.delete(db_notification)
        db.commit()
        return {"id": notification_id}
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting notification: {str(e)}")

def mark_notification_as_read(db: Session, notification_id: int) -> Notification:
    """Mark a notification as read."""
    try:
        db_notification = get_notification(db, notification_id)
        db_notification.read_at = datetime.utcnow()
        db.commit()
        db.refresh(db_notification)
        return db_notification
    except (ResourceNotFoundError, DatabaseError) as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error marking notification as read: {str(e)}")

def mark_all_notifications_as_read(db: Session, recipient_id: int) -> Dict[str, Any]:
    """Mark all notifications as read for a recipient."""
    try:
        result = db.query(Notification).filter(
            Notification.recipient_id == recipient_id,
            Notification.read_at.is_(None)
        ).update({"read_at": datetime.utcnow()})
        
        db.commit()
        return {"updated_count": result}
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error marking notifications as read: {str(e)}") 