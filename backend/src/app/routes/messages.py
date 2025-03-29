# src/routes/messages.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from src.utils.database import get_db
from src.utils.dependencies import get_current_user
from src.models import Message, User, Conversation
from src.schemas import (
    MessageCreate, MessageResponse, ConversationCreate, 
    ConversationResponse, ConversationDetailResponse
)
from src.utils.notifications import send_message_notification

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get all conversations where the current user is a participant
    conversations = db.query(Conversation).filter(
        (Conversation.participant1_id == current_user.id) | 
        (Conversation.participant2_id == current_user.id)
    ).order_by(Conversation.last_message_at.desc()).offset(skip).limit(limit).all()
    
    return conversations

@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if other user exists
    other_user = db.query(User).filter(User.id == conversation.other_user_id).first()
    if not other_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if conversation already exists
    existing = db.query(Conversation).filter(
        ((Conversation.participant1_id == current_user.id) & 
         (Conversation.participant2_id == conversation.other_user_id)) |
        ((Conversation.participant1_id == conversation.other_user_id) & 
         (Conversation.participant2_id == current_user.id))
    ).first()
    
    if existing:
        return existing
    
    # Create new conversation
    db_conversation = Conversation(
        participant1_id=current_user.id,
        participant2_id=conversation.other_user_id,
        created_at=datetime.utcnow(),
        last_message_at=datetime.utcnow()
    )
    
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    return db_conversation

@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if conversation exists and user is a participant
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        ((Conversation.participant1_id == current_user.id) | 
         (Conversation.participant2_id == current_user.id))
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages for this conversation
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    # Mark unread messages as read
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    
    db.commit()
    
    return {
        "conversation": conversation,
        "messages": messages
    }

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: int,
    message: MessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if conversation exists and user is a participant
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        ((Conversation.participant1_id == current_user.id) | 
         (Conversation.participant2_id == current_user.id))
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Create new message
    db_message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=message.content,
        created_at=datetime.utcnow(),
        is_read=False
    )
    
    # Update conversation last message time
    conversation.last_message_at = datetime.utcnow()
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Determine recipient
    recipient_id = conversation.participant1_id
    if recipient_id == current_user.id:
        recipient_id = conversation.participant2_id
    
    # Send notification in background
    background_tasks.add_task(
        send_message_notification,
        user_id=recipient_id,
        sender_name=f"{current_user.first_name} {current_user.last_name}",
        message_preview=message.content[:50] + "..." if len(message.content) > 50 else message.content
    )
    
    return db_message

@router.get("/unread-count", response_model=int)
async def get_unread_messages_count(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get all conversations where the current user is a participant
    conversations = db.query(Conversation).filter(
        (Conversation.participant1_id == current_user.id) | 
        (Conversation.participant2_id == current_user.id)
    ).all()
    
    conversation_ids = [conv.id for conv in conversations]
    
    # Count unread messages
    count = db.query(Message).filter(
        Message.conversation_id.in_(conversation_ids),
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).count()
    
    return count