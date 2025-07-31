from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class ParentCreate(BaseModel):
    first_name: str
    last_name: str
    address: Optional[str] = None
    locality: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    place_of_birth: Optional[str] = None
    gender: str
    class_id: int
    academic_year: str

class RegistrationCreate(BaseModel):
    student: StudentCreate
    parent: ParentCreate
    existing_parent_id: Optional[int] = None  # If parent already exists

class RegistrationResponse(BaseModel):
    student_id: int
    parent_id: int
    registration_status: str
    registration_date: datetime
    class_name: str
    academic_year: str
    
    model_config = ConfigDict(from_attributes=True)
