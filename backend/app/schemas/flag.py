from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class StudentFlagCreate(BaseModel):
    flag_type: str
    reason: str

class StudentFlagUpdate(BaseModel):
    flag_type: Optional[str] = None
    reason: Optional[str] = None
    is_active: Optional[bool] = None

class StudentFlag(BaseModel):
    id: int
    student_id: int
    flag_type: str
    reason: str
    flagged_date: datetime
    flagged_by: int
    is_active: bool
    resolved_date: Optional[datetime] = None
    resolved_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)
