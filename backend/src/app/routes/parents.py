from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any
import bcrypt

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.utils.pagination import get_pagination_meta
from src.models import Parent, User
from src.schemas import ParentCreate, ParentUpdate, ParentResponse, ParentDetailResponse
from src.utils.error_handlers import (
    ResourceNotFoundError, 
    ResourceAlreadyExistsError,
    ValidationError,
    DatabaseError
)
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/parents",
    tags=["Parents"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Parent not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[ParentResponse],
    summary="Get all parents",
    description="Retrieve a list of all parents with optional filtering and pagination"
)
async def read_parents(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    name: Optional[str] = Query(None, description="Filter by name (first or last)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Parent)
        
        # Apply filters
        if name:
            query = query.filter(
                (Parent.first_name.ilike(f"%{name}%")) | 
                (Parent.last_name.ilike(f"%{name}%"))
            )
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        parents = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        
        return PaginatedResponse(
            success=True,
            data=parents,
            message=f"Retrieved {len(parents)} parents",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving parents", original_error=e)

@router.get(
    "/count", 
    response_model=APIResponse[int],
    summary="Count parents",
    description="Get the total number of parents"
)
async def count_parents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        total_parents = db.query(Parent).count()
        return APIResponse(
            success=True,
            data=total_parents,
            message="Total number of parents"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error counting parents", original_error=e)

@router.get(
    "/{parent_id}", 
    response_model=APIResponse[ParentDetailResponse],
    summary="Get parent by ID",
    description="Retrieve detailed information about a specific parent"
)
async def read_parent(
    parent_id: int = Path(..., ge=1, description="The ID of the parent to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
        if db_parent is None:
            raise ResourceNotFoundError("Parent", parent_id)
        
        return APIResponse(
            success=True,
            data=db_parent,
            message=f"Retrieved parent {parent_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving parent {parent_id}", original_error=e)

@router.post(
    "/", 
    response_model=APIResponse[ParentDetailResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new parent",
    description="Create a new parent profile with the provided details"
)
async def create_parent(
    parent: ParentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if username exists
        existing_user = db.query(User).filter(User.username == parent.username).first()
        if existing_user:
            raise ResourceAlreadyExistsError("User", "username", parent.username)
        
        # Create user
        hashed_password = bcrypt.hashpw(parent.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        full_name = f"{parent.first_name} {parent.last_name}"
        
        new_user = User(
            username=parent.username,
            password_hash=hashed_password,
            full_name=full_name,
            role=parent.user_role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create parent profile
        db_parent = Parent(
            first_name=parent.first_name,
            last_name=parent.last_name,
            phone=parent.phone,
            email=parent.email,
            address=parent.address,
            user_id=new_user.id
        )
        
        db.add(db_parent)
        db.commit()
        db.refresh(db_parent)
        
        return APIResponse(
            success=True,
            data=db_parent,
            message=f"Parent {parent.first_name} {parent.last_name} created successfully"
        )
    except ResourceAlreadyExistsError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating parent", original_error=e)

@router.put(
    "/{parent_id}", 
    response_model=APIResponse[ParentResponse],
    summary="Update a parent",
    description="Update an existing parent profile with the provided details"
)
async def update_parent(
    parent_id: int = Path(..., ge=1, description="The ID of the parent to update"),
    parent: ParentUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if parent exists
        db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
        if db_parent is None:
            raise ResourceNotFoundError("Parent", parent_id)
        
        # Update parent
        update_data = parent.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_parent, key, value)
        
        db.commit()
        db.refresh(db_parent)
        
        return APIResponse(
            success=True,
            data=db_parent,
            message=f"Parent {parent_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating parent {parent_id}", original_error=e)

@router.delete(
    "/{parent_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a parent",
    description="Delete a parent profile by ID"
)
async def delete_parent(
    parent_id: int = Path(..., ge=1, description="The ID of the parent to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if parent exists
        db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
        if db_parent is None:
            raise ResourceNotFoundError("Parent", parent_id)
        
        # Delete parent
        db.delete(db_parent)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": parent_id},
            message=f"Parent {parent_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting parent {parent_id}", original_error=e)
