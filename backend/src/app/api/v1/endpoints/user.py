from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import user as crud
from src.app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse
)
from src.utils.enums import UserRole
from src.utils.response_models import APIResponse

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users(  
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    username: Optional[str] = None,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get users with optional filtering.
    """
    try:
        users, _ = crud.get_users(
            db=db,
            skip=skip,
            limit=limit,
            username=username,
            role=role,
            is_active=is_active
        )
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Get a specific user by ID.
    """
    try:
        return crud.get_user(db=db, user_id=user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new user.
    """
    try:
        return crud.create_user(db=db, user=user_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update user.
    """
    try:
        return crud.update_user(db=db, user_id=user_id, user=user_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete("/{user_id}", response_model=APIResponse)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete user.
    """
    try:
        result = crud.delete_user(db=db, user_id=user_id)
        return APIResponse(
            success=True,
            data=result,
            message="User deleted successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.put("/{user_id}/activate", response_model=UserResponse)
def activate_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Activate a user account.
    """
    try:
        return crud.update_user(
            db=db,
            user_id=user_id,
            user=UserUpdate(is_active=True)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.put("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Deactivate a user account.
    """
    try:
        return crud.update_user(
            db=db,
            user_id=user_id,
            user=UserUpdate(is_active=False)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
