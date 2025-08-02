from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional, List

# Import the related schemas for relationships
from .parent import Parent
from .class_schema import Class

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    place_of_birth: Optional[str] = None
    gender: str
    parent_id: int
    class_id: Optional[int] = None
    academic_year: str

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    place_of_birth: Optional[str] = None
    gender: Optional[str] = None
    parent_id: Optional[int] = None
    class_id: Optional[int] = None
    academic_year: Optional[str] = None

# Simple flag info for student display (avoid circular imports)
class StudentFlagInfo(BaseModel):
    id: int
    flag_type: str
    reason: str
    flagged_date: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)

class Student(StudentCreate):
    id: int
    registration_status: Optional[str] = None
    registration_date: Optional[datetime] = None
    registered_by: Optional[int] = None
    
    # Relationships - use different field name to avoid Python keyword
    parent: Optional[Parent] = None
    student_class: Optional[Class] = Field(None, alias="class")
    flags: List[StudentFlagInfo] = []
    
    # Computed properties
    @property
    def has_active_flags(self) -> bool:
        return any(flag.is_active for flag in self.flags)
    
    @property 
    def active_flag_types(self) -> List[str]:
        return [flag.flag_type for flag in self.flags if flag.is_active]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
