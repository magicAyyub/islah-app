from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Optional
from enum import Enum

class GradeTypeEnum(str, Enum):
    QUIZ = "quiz"
    TEST = "test"
    EXAM = "exam"
    HOMEWORK = "homework"
    PROJECT = "project"
    PARTICIPATION = "participation"

class AcademicPeriodEnum(str, Enum):
    FIRST_TERM = "first_term"
    SECOND_TERM = "second_term"
    THIRD_TERM = "third_term"
    FIRST_SEMESTER = "first_semester"
    SECOND_SEMESTER = "second_semester"

class AttendanceStatusEnum(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

# Subject Schemas
class SubjectBase(BaseModel):
    name: str = Field(..., description="Subject name")
    code: str = Field(..., description="Subject code (unique)")
    description: Optional[str] = Field(None, description="Subject description")
    teacher_id: Optional[int] = Field(None, description="Assigned teacher ID")
    class_id: Optional[int] = Field(None, description="Class ID")
    academic_year: str = Field(..., description="Academic year")

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None

class Subject(SubjectBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime

# Grade Schemas
class GradeBase(BaseModel):
    student_id: int = Field(..., description="Student ID")
    subject_id: int = Field(..., description="Subject ID")
    grade_value: float = Field(..., ge=0, description="Grade value")
    max_grade: float = Field(20, gt=0, description="Maximum possible grade")
    grade_type: GradeTypeEnum = Field(..., description="Type of assessment")
    academic_period: AcademicPeriodEnum = Field(..., description="Academic period")
    academic_year: str = Field(..., description="Academic year")
    assessment_date: date = Field(..., description="Date of assessment")
    comments: Optional[str] = Field(None, description="Teacher comments")

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade_value: Optional[float] = Field(None, ge=0)
    max_grade: Optional[float] = Field(None, gt=0)
    grade_type: Optional[GradeTypeEnum] = None
    academic_period: Optional[AcademicPeriodEnum] = None
    assessment_date: Optional[date] = None
    comments: Optional[str] = None

class Grade(GradeBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    recorded_by: Optional[int]
    created_at: datetime
    updated_at: datetime

# Attendance Schemas
class AttendanceBase(BaseModel):
    student_id: int = Field(..., description="Student ID")
    class_id: int = Field(..., description="Class ID")
    attendance_date: date = Field(..., description="Attendance date")
    status: AttendanceStatusEnum = Field(..., description="Attendance status")
    arrival_time: Optional[datetime] = Field(None, description="Arrival time for late students")
    notes: Optional[str] = Field(None, description="Additional notes")

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatusEnum] = None
    arrival_time: Optional[datetime] = None
    notes: Optional[str] = None

class Attendance(AttendanceBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    recorded_by: Optional[int]
    created_at: datetime
    updated_at: datetime

# Response models with relationships
class GradeWithDetails(Grade):
    student: Optional[dict] = None
    subject: Optional[dict] = None

class AttendanceWithDetails(Attendance):
    student: Optional[dict] = None
    class_attended: Optional[dict] = None

class SubjectWithDetails(Subject):
    teacher: Optional[dict] = None
    class_assigned: Optional[dict] = None

# Bulk operations
class BulkAttendanceCreate(BaseModel):
    class_id: int = Field(..., description="Class ID")
    attendance_date: date = Field(..., description="Attendance date")
    attendance_records: list[dict] = Field(..., description="List of {student_id, status, notes}")

class BulkGradeCreate(BaseModel):
    subject_id: int = Field(..., description="Subject ID")
    grade_type: GradeTypeEnum = Field(..., description="Type of assessment")
    academic_period: AcademicPeriodEnum = Field(..., description="Academic period")
    academic_year: str = Field(..., description="Academic year")
    assessment_date: date = Field(..., description="Date of assessment")
    max_grade: float = Field(20, gt=0, description="Maximum possible grade")
    grades: list[dict] = Field(..., description="List of {student_id, grade_value, comments}")

# Statistics and Reports
class AttendanceStats(BaseModel):
    total_days: int
    present_days: int
    absent_days: int
    late_days: int
    excused_days: int
    attendance_rate: float

class GradeStats(BaseModel):
    subject_name: str
    average_grade: float
    highest_grade: float
    lowest_grade: float
    total_assessments: int
