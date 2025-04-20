# src/routes/levels.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Level, User
from src.schemas import LevelCreate, LevelUpdate, LevelResponse

router = APIRouter(
    prefix="/levels",
    tags=["Levels"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[LevelResponse])
async def read_levels(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    levels = db.query(Level).offset(skip).limit(limit).all()
    return levels

@router.get("/{level_id}", response_model=LevelResponse)
async def read_level(
    level_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_level = db.query(Level).filter(Level.id == level_id).first()
    if db_level is None:
        raise HTTPException(status_code=404, detail="Level not found")
    return db_level

@router.post("/", response_model=LevelResponse, status_code=status.HTTP_201_CREATED)
async def create_level(
    level: LevelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    db_level = Level(name=level.name)
    
    db.add(db_level)
    db.commit()
    db.refresh(db_level)
    
    return db_level

@router.put("/{level_id}", response_model=LevelResponse)
async def update_level(
    level_id: int,
    level: LevelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    db_level = db.query(Level).filter(Level.id == level_id).first()
    if db_level is None:
        raise HTTPException(status_code=404, detail="Level not found")
    
    update_data = level.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_level, key, value)
    
    db.commit()
    db.refresh(db_level)
    
    return db_level

@router.delete("/{level_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_level(
    level_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    db_level = db.query(Level).filter(Level.id == level_id).first()
    if db_level is None:
        raise HTTPException(status_code=404, detail="Level not found")
    
    db.delete(db_level)
    db.commit()
    
    return None
