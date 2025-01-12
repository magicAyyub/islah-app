from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.models import Parent
from pydantic import BaseModel, validator
from datetime import datetime

class ParentModel(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str   
    registration_date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
    @validator('registration_date')
    def validate_registration_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise ValueError("registration_date must be in the format YYYY-MM-DD HH:MM:SS")
        return v 

class ParentResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    registration_date: str

router = APIRouter(
    tags=["Parents"],
)

db_dependency = Depends(get_db)

@router.get("/api/parents")
async def get_mentors(db: Session = db_dependency) -> list[ParentResponse]:
    """Get all mentors."""
    mentors = db.query(Parent).all()
    # if not mentors:
    #     raise HTTPException(status_code=404, detail="No mentors found")
    return mentors