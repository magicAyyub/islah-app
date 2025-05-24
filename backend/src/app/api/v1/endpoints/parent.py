from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import parent as crud
from src.app.schemas.parent import (
    ParentCreate,
    ParentUpdate,
    ParentResponse
)

router = APIRouter()

@router.get("/", response_model=List[ParentResponse])
def get_parents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get parents with optional filtering.
    """
    parents, _ = crud.get_parents(
        db=db,
        skip=skip,
        limit=limit,
        name=name,
        email=email
    )
    return parents

@router.post("/", response_model=ParentResponse)
def create_parent(
    *,
    db: Session = Depends(deps.get_db),
    parent_in: ParentCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new parent.
    """
    return crud.create_parent(db=db, parent=parent_in)

@router.put("/{parent_id}", response_model=ParentResponse)
def update_parent(
    *,
    db: Session = Depends(deps.get_db),
    parent_id: int,
    parent_in: ParentUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update parent.
    """
    parent = crud.get_parent(db=db, parent_id=parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    return crud.update_parent(db=db, parent_id=parent_id, parent=parent_in)

@router.delete("/{parent_id}")
def delete_parent(
    *,
    db: Session = Depends(deps.get_db),
    parent_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete parent.
    """
    parent = crud.get_parent(db=db, parent_id=parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    if crud.delete_parent(db=db, parent_id=parent_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete parent")
