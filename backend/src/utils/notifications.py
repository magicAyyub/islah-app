# src/utils/notifications.py

import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

async def send_notification(user_id: int, title: str, message: str):
    """
    Send a notification to a user.
    This is a placeholder function that would be implemented with a real notification service.
    """
    # In a real application, this would send a push notification, email, or SMS
    logger.info(f"Sending notification to user {user_id}: {title} - {message}")
    # Example: await push_service.send_notification(user_id, title, message)
    return True

async def send_message_notification(user_id: int, sender_name: str, message_preview: str):
    """
    Send a notification about a new message.
    """
    title = f"New message from {sender_name}"
    message = message_preview
    return await send_notification(user_id, title, message)

async def send_access_request_notification(
    admin_id: int, 
    requester_name: str, 
    request_type: str,
    is_update: bool = False,
    status: Optional[str] = None
):
    """
    Send a notification about an access request.
    """
    if is_update:
        title = f"Access Request Update: {request_type}"
        message = f"Your access request has been {status}"
    else:
        title = f"New Access Request: {request_type}"
        message = f"{requester_name} has requested access to {request_type}"
    
    return await send_notification(admin_id, title, message)

async def send_invoice_notification(
    user_id: int, 
    student_name: str, 
    invoice_number: str, 
    amount: float, 
    due_date: datetime,
    is_reminder: bool = False,
    message: Optional[str] = None
):
    """
    Send a notification about an invoice.
    """
    if is_reminder:
        title = f"Payment Reminder: Invoice #{invoice_number}"
        notification_message = message or f"Reminder: Payment of ${amount:.2f} for {student_name} is due on {due_date.strftime('%Y-%m-%d')}"
    else:
        title = f"New Invoice: #{invoice_number}"
        notification_message = f"A new invoice of ${amount:.2f} for {student_name} has been issued. Due date: {due_date.strftime('%Y-%m-%d')}"
    
    return await send_notification(user_id, title, notification_message)