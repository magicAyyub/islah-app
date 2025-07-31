from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    place_of_birth: Optional[str] = None
    gender: str
    parent_id: int
    class_id: Optional[int] = None
    academic_year: str

class Student(StudentCreate):
    id: int
    registration_status: Optional[str] = None
    registration_date: Optional[datetime] = None
    registered_by: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
