from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import level as crud
from src.app.schemas.level import (
    LevelCreate,
    LevelUpdate,
    LevelResponse
)

router = APIRouter()

@router.get("/", response_model=List[LevelResponse])
def get_levels(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get levels with optional filtering.
    """
    levels, _ = crud.get_levels(
        db=db,
        skip=skip,
        limit=limit,
        name=name
    )
    return levels

@router.post("/", response_model=LevelResponse)
def create_level(
    *,
    db: Session = Depends(deps.get_db),
    level_in: LevelCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new level.
    """
    return crud.create_level(db=db, level=level_in)

@router.put("/{level_id}", response_model=LevelResponse)
def update_level(
    *,
    db: Session = Depends(deps.get_db),
    level_id: int,
    level_in: LevelUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update level.
    """
    level = crud.get_level(db=db, level_id=level_id)
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return crud.update_level(db=db, level_id=level_id, level=level_in)

@router.delete("/{level_id}")
def delete_level(
    *,
    db: Session = Depends(deps.get_db),
    level_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete level.
    """
    level = crud.get_level(db=db, level_id=level_id)
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    if crud.delete_level(db=db, level_id=level_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete level")
