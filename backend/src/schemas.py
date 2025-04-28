# -*- coding: utf-8 -*-

from datetime import date, datetime, time
from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator

from src.utils.enums import (
    UserRole, Gender, EnrollmentStatus, PaymentMethod, 
    PaymentType, PaymentStatus, AttendanceStatus, ReportCardStatus, 
    NotificationType, AccessRequestStatus, AccessRequestType, get_current_school_year
)

# Token schema - this is important for OAuth2 authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Base schemas for CRUD operations

# User
class UserBase(BaseModel):
    username: str
    role: UserRole
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Student
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    gender: Gender
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE
    parent_id: Optional[int] = None
    current_class_id: Optional[int] = None

class StudentCreate(StudentBase):
    enrolled_at: date = Field(default_factory=date.today)

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[Gender] = None
    status: Optional[EnrollmentStatus] = None
    parent_id: Optional[int] = None
    current_class_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    enrolled_at: date

    class Config:
        from_attributes = True

class StudentDetailResponse(StudentResponse):
    parent: Optional['ParentResponse'] = None
    current_class: Optional['ClassroomResponse'] = None
    
    class Config:
        from_attributes = True

# Parent
class ParentBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class ParentCreate(ParentBase):
    # Informations pour la création automatique du compte utilisateur
    username: str
    password: str
    user_role: UserRole = UserRole.PARENT

class ParentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    user_id: Optional[int] = None

class ParentResponse(ParentBase):
    id: int

    class Config:
        from_attributes = True

class ParentDetailResponse(ParentResponse):
    students: List['StudentResponse'] = []
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Teacher
class TeacherBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class TeacherCreate(TeacherBase):
    # Informations pour la création automatique du compte utilisateur
    username: str
    password: str
    user_role: UserRole = UserRole.TEACHER

class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    user_id: Optional[int] = None

class TeacherResponse(TeacherBase):
    id: int

    class Config:
        from_attributes = True

class TeacherDetailResponse(TeacherResponse):
    classrooms: List['ClassroomResponse'] = []
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Level
class LevelBase(BaseModel):
    name: str

class LevelCreate(LevelBase):
    pass

class LevelUpdate(BaseModel):
    name: Optional[str] = None

class LevelResponse(LevelBase):
    id: int

    class Config:
        from_attributes = True

# Classroom
class ClassroomBase(BaseModel):
    label: str
    level_id: int
    schedule: Optional[str] = None
    capacity: int = 30
    teacher_id: Optional[int] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(BaseModel):
    label: Optional[str] = None
    level_id: Optional[int] = None
    schedule: Optional[str] = None
    capacity: Optional[int] = None
    teacher_id: Optional[int] = None

class ClassroomResponse(ClassroomBase):
    id: int

    class Config:
        from_attributes = True

class ClassroomDetailResponse(ClassroomResponse):
    level: LevelResponse
    teacher: Optional[TeacherResponse] = None
    students: List[StudentResponse] = []

    class Config:
        from_attributes = True

# Subject
class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: int

    class Config:
        from_attributes = True

# Grade
class GradeBase(BaseModel):
    student_id: int
    subject_id: int
    term: str
    score: Optional[float] = None
    comment: Optional[str] = None

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    term: Optional[str] = None
    score: Optional[float] = None
    comment: Optional[str] = None

class GradeResponse(GradeBase):
    id: int

    class Config:
        from_attributes = True

class GradeDetailResponse(GradeResponse):
    student: StudentResponse
    subject: SubjectResponse

    class Config:
        from_attributes = True

# Payment
class PaymentBase(BaseModel):
    student_id: int
    amount: float
    type: PaymentType
    method: PaymentMethod
    payment_date: date = Field(default_factory=date.today)
    status: PaymentStatus = PaymentStatus.PENDING

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[PaymentType] = None
    method: Optional[PaymentMethod] = None
    payment_date: Optional[date] = None
    status: Optional[PaymentStatus] = None

class PaymentResponse(PaymentBase):
    id: int

    class Config:
        from_attributes = True

class PaymentDetailResponse(PaymentResponse):
    student: StudentResponse

    class Config:
        from_attributes = True

# Attendance
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

# Notification
class NotificationBase(BaseModel):
    recipient_type: str
    recipient_id: int
    message: str
    type: NotificationType = NotificationType.INFO

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    message: Optional[str] = None
    read_at: Optional[datetime] = None
    type: Optional[NotificationType] = None

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Add this at the end of the file (for forward references)
StudentDetailResponse.update_forward_refs()
ParentDetailResponse.update_forward_refs()
TeacherDetailResponse.update_forward_refs()
ClassroomDetailResponse.update_forward_refs()
