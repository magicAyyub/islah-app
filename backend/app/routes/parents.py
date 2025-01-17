from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from pydantic import BaseModel
from datetime import date, datetime
from typing import List
from utils import schemas, models
from sqlalchemy.orm import Session
from utils.database import get_db
from typing import List, Optional

router = APIRouter(
    tags=["Parents"],
)

db_dependency = Depends(get_db)

@router.get("/parents/", response_model=List[schemas.ParentResponse])

async def get_parents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(models.Parent).offset(skip).limit(limit).all()

@router.post("/parents/", response_model=schemas.ParentResponse)
async def create_parent(
    parent: schemas.ParentBase,
    db: Session = Depends(get_db)
):
    db_parent = models.Parent(**parent.dict())
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    return db_parent