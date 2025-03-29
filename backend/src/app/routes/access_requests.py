# src/routes/access_requests.py

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_role
from src.models import AccessRequest, User
from src.schemas import (
    AccessRequestCreate, AccessRequestUpdate, AccessRequestResponse
)
from src.utils.notifications import send_access_request_notification

router = APIRouter(
    prefix="/access-requests",
    tags=["Access Requests"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[AccessRequestResponse])
async def read_access_requests(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(AccessRequest)
    
    # Regular users can only see their own requests
    if current_user.role != "admin":
        query = query.filter(AccessRequest.requester_id == current_user.id)
    
    if status:
        query = query.filter(AccessRequest.status == status)
    
    requests = query.order_by(AccessRequest.created_at.desc()).offset(skip).limit(limit).all()
    return requests

@router.get("/{request_id}", response_model=AccessRequestResponse)
async def read_access_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    request = db.query(AccessRequest).filter(AccessRequest.id == request_id).first()
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    
    # Check if user is authorized to view this request
    if request.requester_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this access request"
        )
    
    return request

@router.post("/", response_model=AccessRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_access_request(
    request: AccessRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Create new access request
    db_request = AccessRequest(
        requester_id=current_user.id,
        request_type=request.request_type,
        resource_id=request.resource_id,
        justification=request.justification,
        status="pending",
        created_at=datetime.utcnow()
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    # Notify admins about the new access request
    admin_users = db.query(User).filter(User.role == "admin").all()
    for admin in admin_users:
        background_tasks.add_task(
            send_access_request_notification,
            admin_id=admin.id,
            requester_name=f"{current_user.first_name} {current_user.last_name}",
            request_type=request.request_type
        )
    
    return db_request

@router.put("/{request_id}", response_model=AccessRequestResponse)
async def update_access_request(
    request_id: int,
    request: AccessRequestUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    db_request = db.query(AccessRequest).filter(AccessRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    
    update_data = request.dict(exclude_unset=True)
    
    # If status is being updated, set the reviewer and review date
    if "status" in update_data and update_data["status"] != db_request.status:
        update_data["reviewer_id"] = current_user.id
        update_data["reviewed_at"] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_request, key, value)
    
    db.commit()
    db.refresh(db_request)
    
    # Notify requester about the status update
    if "status" in update_data:
        requester = db.query(User).filter(User.id == db_request.requester_id).first()
        if requester:
            background_tasks.add_task(
                send_access_request_notification,
                admin_id=requester.id,
                requester_name="",
                request_type=db_request.request_type,
                is_update=True,
                status=update_data["status"]
            )
    
    return db_request