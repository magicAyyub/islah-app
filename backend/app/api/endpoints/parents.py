from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.parent import ParentCreate, ParentUpdate, Parent
from app.services import parent_service
from app.database.session import get_db
from app.api.pagination import PaginatedResponse, paginate_query, create_paginated_response
from app.database.models import Parent as ParentModel, User
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=Parent)
def create_parent(
    parent: ParentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Create a new parent"""
    created_parent = parent_service.create_parent(db=db, parent=parent)
    
    # Return with frontend field mapping
    return {
        "id": created_parent.id,
        "first_name": created_parent.first_name,
        "last_name": created_parent.last_name,
        "phone": created_parent.phone,
        "email": created_parent.email,
        "address": created_parent.address,
        "emergency_contact": created_parent.mobile
    }

@router.get("/", response_model=List[Parent])
def get_parents(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    search: Optional[str] = Query(None, description="Search in parent names"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """
    Get list of parents with optional search.
    For now, returning simple list since frontend expects it.
    """
    query = db.query(ParentModel)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            ParentModel.first_name.ilike(search_term) |
            ParentModel.last_name.ilike(search_term) |
            ParentModel.phone.ilike(search_term) |
            ParentModel.email.ilike(search_term)
        )
    
    # Apply pagination and ordering
    parents = query.order_by(ParentModel.first_name.asc(), ParentModel.last_name.asc()).offset(skip).limit(limit).all()
    
    # Convert to response models with frontend field mapping
    result = []
    for parent in parents:
        parent_dict = {
            "id": parent.id,
            "first_name": parent.first_name,
            "last_name": parent.last_name,
            "phone": parent.phone,
            "email": parent.email,
            "address": parent.address,
            "emergency_contact": parent.mobile  # Map mobile to emergency_contact for frontend
        }
        result.append(parent_dict)
    
    return result

@router.get("/{parent_id}", response_model=Parent)
def get_parent(
    parent_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Get a parent by ID"""
    parent = parent_service.get_parent(db=db, parent_id=parent_id)
    if parent is None:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Return with frontend field mapping
    return {
        "id": parent.id,
        "first_name": parent.first_name,
        "last_name": parent.last_name,
        "phone": parent.phone,
        "email": parent.email,
        "address": parent.address,
        "emergency_contact": parent.mobile
    }

@router.put("/{parent_id}", response_model=Parent)
def update_parent(
    parent_id: int,
    parent_update: ParentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Update an existing parent"""
    return parent_service.update_parent(db=db, parent_id=parent_id, parent_update=parent_update)

@router.delete("/{parent_id}")
def delete_parent(
    parent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Delete a parent"""
    return parent_service.delete_parent(db=db, parent_id=parent_id)
