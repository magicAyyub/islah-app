from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Parent
from pydantic import BaseModel
from datetime import datetime

class ParentModel(BaseModel):
    last_name: str
    first_name: str
    email: str
    phone: str   
    registration_date: datetime = datetime.now()

class ParentResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    email: str
    phone: str
    registration_date: datetime

    class Config:
        from_attributes = True  # This enables ORM mode
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }

router = APIRouter(
    tags=["Parents"],
)

db_dependency = Depends(get_db)

@router.get("/api/parents")
async def get_parents(db: Session = db_dependency) -> list[ParentResponse]:
    """Get all parents."""
    parents = db.query(Parent).all()
    if not parents:
        raise HTTPException(status_code=404, detail="No parents found")
    return parents

@router.get("/api/parents/{parent_id}")
async def get_parent(parent_id: int, db: Session = db_dependency) -> ParentResponse:
    """Get a parent by id."""
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="parent not found")
    return parent

@router.post("/api/parents")
async def create_parent(parent: ParentModel, db: Session = db_dependency) -> ParentResponse:
    """Create a parent."""
    parent = Parent(**parent.dict())
    db.add(parent)
    db.commit()
    db.refresh(parent)
    return parent

@router.put("/api/parents/{parent_id}")
async def update_parent(parent_id: int, parent: ParentModel, db: Session = db_dependency) -> ParentResponse:
    """Update a parent."""
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="parent not found")
    for key, value in parent.dict().items():
        if key in parent.dict():
            setattr(parent, key, value)
    db.commit()
    db.refresh(parent)
    return parent

@router.delete("/api/parents/{parent_id}")
async def delete_parent(parent_id: int, db: Session = db_dependency) -> dict[str, str]:
    """Delete a parent."""
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="parent not found")
    db.delete(parent)
    db.commit()
    return {"message": "parent deleted"}
