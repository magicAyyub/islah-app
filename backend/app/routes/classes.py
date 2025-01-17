from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils import models, schemas
from pydantic import BaseModel
from typing import List

router = APIRouter(
    tags=["Classes"]
)

db_dependency = Depends(get_db)

@router.get("/classes/", response_model=List[schemas.ClassResponse])
async def get_classes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(models.Class).offset(skip).limit(limit).all()

@router.post("/classes/", response_model=schemas.ClassResponse)
async def create_class(
    class_: schemas.ClassBase,
    db: Session = Depends(get_db)
):
    db_class = models.Class(**class_.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class