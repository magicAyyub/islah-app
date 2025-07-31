from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ClassCreate(BaseModel):
    name: str  # e.g., "Maternelle 1 - Matin"
    level: str  # e.g., "Maternelle 1"
    time_slot: str  # "10h-13h" or "14h-17h"
    capacity: int
    academic_year: str

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None
    time_slot: Optional[str] = None
    capacity: Optional[int] = None
    academic_year: Optional[str] = None

class Class(BaseModel):
    id: int
    name: str
    level: str
    time_slot: str
    capacity: int
    academic_year: str
    created_date: datetime
    enrolled_students: Optional[int] = 0  # Calculated field
    available_spots: Optional[int] = 0    # Calculated field

    model_config = ConfigDict(from_attributes=True)
