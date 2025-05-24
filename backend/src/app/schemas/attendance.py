from pydantic import BaseModel
from typing import Optional
from datetime import date
from src.utils.enums import AttendanceStatus
from pydantic import Field
from src.app.schemas.student import StudentResponse


class AttendanceBase(BaseModel):
    student_id: int
    attendance_date: date = Field(default_factory=date.today)
    status: AttendanceStatus = AttendanceStatus.PRESENT

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    attendance_date: Optional[date] = None
    status: Optional[AttendanceStatus] = None

class AttendanceResponse(AttendanceBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceDetailResponse(AttendanceResponse):
    student: StudentResponse

    class Config:
        from_attributes = True