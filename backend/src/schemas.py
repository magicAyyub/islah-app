# src/schemas.py

from datetime import date, datetime, time
from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator

from src.utils.enums import (
    UserRole, StudentGender, EnrollmentStatus, PaymentMethod, 
    PaymentType, PaymentStatus, InvoiceStatus, ReportCardStatus, 
    NotificationType, MessageType, AccessRequestStatus, get_current_school_year
)

# Base schemas for CRUD operations

# User
class UserBase(BaseModel):
    email: EmailStr
    last_name: str
    first_name: str
    phone: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None
    is_active: bool

    class Config:
        from_attributes = True

# Student
class StudentBase(BaseModel):
    last_name: str
    first_name: str
    birth_date: date
    gender: StudentGender
    address: Optional[str] = None
    external_id: Optional[str] = None

class StudentCreate(StudentBase):
    photo: Optional[str] = None
    registration_date: date = Field(default_factory=date.today)

class StudentUpdate(BaseModel):
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[StudentGender] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    is_active: Optional[bool] = None

class StudentResponse(StudentBase):
    id: int
    photo: Optional[str] = None
    is_active: bool
    registration_date: date

    class Config:
        from_attributes = True

class StudentDetailResponse(StudentResponse):
    # Add related information for the detailed view
    parents: Optional[List['ParentStudentResponse']] = []
    enrollments: Optional[List['EnrollmentResponse']] = []
    
    class Config:
        from_attributes = True

# Parent
class ParentBase(BaseModel):
    user_id: int
    profession: Optional[str] = None
    secondary_phone: Optional[str] = None

class ParentCreate(ParentBase):
    pass

class ParentUpdate(BaseModel):
    profession: Optional[str] = None
    secondary_phone: Optional[str] = None

class ParentResponse(ParentBase):
    id: int

    class Config:
        from_attributes = True

class ParentDetailResponse(ParentResponse):
    user: UserResponse

    class Config:
        from_attributes = True

# Teacher
class TeacherBase(BaseModel):
    user_id: int
    specialty: Optional[str] = None
    hire_date: Optional[date] = None
    emergency_phone: Optional[str] = None

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(BaseModel):
    specialty: Optional[str] = None
    hire_date: Optional[date] = None
    emergency_phone: Optional[str] = None

class TeacherResponse(TeacherBase):
    id: int

    class Config:
        from_attributes = True

class TeacherDetailResponse(TeacherResponse):
    user: UserResponse

    class Config:
        from_attributes = True

# Class
class ClassBase(BaseModel):
    name: str
    level: str
    school_year: str = Field(default_factory=get_current_school_year)
    time_slot: str
    max_capacity: int

class ClassCreate(ClassBase):
    is_active: bool = True

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None
    school_year: Optional[str] = None
    time_slot: Optional[str] = None
    max_capacity: Optional[int] = None
    is_active: Optional[bool] = None

class ClassResponse(ClassBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# TeacherClassAssignment
class TeacherClassAssignmentBase(BaseModel):
    teacher_id: int
    class_id: int
    subject: str
    is_main_teacher: bool = False
    hours_per_week: Optional[int] = None
    notes: Optional[str] = None

class TeacherClassAssignmentCreate(TeacherClassAssignmentBase):
    pass

class TeacherClassAssignmentUpdate(BaseModel):
    subject: Optional[str] = None
    is_main_teacher: Optional[bool] = None
    hours_per_week: Optional[int] = None
    notes: Optional[str] = None

class TeacherClassAssignmentResponse(TeacherClassAssignmentBase):
    class Config:
        from_attributes = True

class TeacherClassAssignmentDetailResponse(TeacherClassAssignmentResponse):
    teacher: TeacherResponse
    class_: ClassResponse

    class Config:
        from_attributes = True
        fields = {'class_': {'alias': 'class'}}

# Enrollment
class EnrollmentBase(BaseModel):
    student_id: int
    class_id: int
    enrollment_date: date = Field(default_factory=date.today)
    status: EnrollmentStatus = EnrollmentStatus.ACTIVE

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None
    end_date: Optional[date] = None

class EnrollmentResponse(EnrollmentBase):
    id: int
    end_date: Optional[date] = None

    class Config:
        from_attributes = True

class EnrollmentDetailResponse(EnrollmentResponse):
    student: StudentResponse
    class_: ClassResponse

    class Config:
        from_attributes = True
        fields = {'class_': {'alias': 'class'}}

# ParentStudent
class ParentStudentBase(BaseModel):
    parent_id: int
    student_id: int
    relationship: str
    is_primary_contact: bool = False
    can_pickup: bool = True

class ParentStudentCreate(ParentStudentBase):
    pass

class ParentStudentUpdate(BaseModel):
    relationship: Optional[str] = None
    is_primary_contact: Optional[bool] = None
    can_pickup: Optional[bool] = None

class ParentStudentResponse(ParentStudentBase):
    class Config:
        from_attributes = True

class ParentStudentDetailResponse(ParentStudentResponse):
    parent: ParentResponse
    student: StudentResponse

    class Config:
        from_attributes = True

# Attendance
class AttendanceBase(BaseModel):
    student_id: int
    class_id: int
    date: date
    is_present: bool
    recorded_by: int

class AttendanceCreate(AttendanceBase):
    arrival_time: Optional[time] = None
    comment: Optional[str] = None

class AttendanceUpdate(BaseModel):
    is_present: Optional[bool] = None
    arrival_time: Optional[time] = None
    comment: Optional[str] = None

class AttendanceResponse(AttendanceBase):
    id: int
    arrival_time: Optional[time] = None
    comment: Optional[str] = None

    class Config:
        from_attributes = True

class AttendanceDetailResponse(AttendanceResponse):
    student: StudentResponse
    class_: ClassResponse

    class Config:
        from_attributes = True
        fields = {'class_': {'alias': 'class'}}

# AbsenceJustification
class AbsenceJustificationBase(BaseModel):
    attendance_id: int
    reason: str
    submission_date: date = Field(default_factory=date.today)

class AbsenceJustificationCreate(AbsenceJustificationBase):
    description: Optional[str] = None
    document_url: Optional[str] = None

class AbsenceJustificationUpdate(BaseModel):
    reason: Optional[str] = None
    description: Optional[str] = None
    document_url: Optional[str] = None
    is_validated: Optional[bool] = None
    validated_by: Optional[int] = None

class AbsenceJustificationResponse(AbsenceJustificationBase):
    id: int
    description: Optional[str] = None
    document_url: Optional[str] = None
    is_validated: bool
    validated_by: Optional[int] = None

    class Config:
        from_attributes = True

# Payment
class PaymentBase(BaseModel):
    student_id: int
    amount: float
    payment_date: date = Field(default_factory=date.today)
    method: PaymentMethod
    type: PaymentType
    status: PaymentStatus
    recorded_by: int

class PaymentCreate(PaymentBase):
    reference: Optional[str] = None
    comment: Optional[str] = None

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_date: Optional[date] = None
    method: Optional[PaymentMethod] = None
    reference: Optional[str] = None
    type: Optional[PaymentType] = None
    status: Optional[PaymentStatus] = None
    comment: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    reference: Optional[str] = None
    comment: Optional[str] = None

    class Config:
        from_attributes = True

class PaymentDetailResponse(PaymentResponse):
    student: StudentResponse

    class Config:
        from_attributes = True

# Invoice
class InvoiceItemBase(BaseModel):
    description: str
    quantity: float = Field(ge=0)
    unit_price: float = Field(ge=0)
    item_type: Optional[str] = None

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int
    amount: float
    
    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    student_id: int
    invoice_number: str
    issue_date: Optional[date] = None
    due_date: date
    total_amount: float = Field(ge=0)
    status: Optional[str] = "pending"
    description: Optional[str] = None
    notes: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    items: Optional[List[InvoiceItemCreate]] = None

class InvoiceUpdate(BaseModel):
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    total_amount: Optional[float] = Field(None, ge=0)
    status: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class InvoiceResponse(InvoiceBase):
    id: int
    reminder_count: Optional[int] = None
    last_reminder_date: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class InvoiceDetailResponse(InvoiceResponse):
    items: List[InvoiceItemResponse] = []
    
    class Config:
        from_attributes = True

class InvoiceReminderCreate(BaseModel):
    message: Optional[str] = None

# ReportCard
class ReportCardBase(BaseModel):
    student_id: int
    class_id: int
    term: str
    school_year: str = Field(default_factory=get_current_school_year)
    status: ReportCardStatus = ReportCardStatus.DRAFT

class ReportCardCreate(ReportCardBase):
    published_by: Optional[int] = None
    publication_date: Optional[date] = None

class ReportCardUpdate(BaseModel):
    term: Optional[str] = None
    status: Optional[ReportCardStatus] = None
    published_by: Optional[int] = None
    publication_date: Optional[date] = None

class ReportCardResponse(ReportCardBase):
    id: int
    publication_date: Optional[date] = None
    published_by: Optional[int] = None

    class Config:
        from_attributes = True

class ReportCardDetailResponse(ReportCardResponse):
    student: StudentResponse
    class_: ClassResponse

    class Config:
        from_attributes = True
        fields = {'class_': {'alias': 'class'}}

# Evaluation
class EvaluationBase(BaseModel):
    report_card_id: int
    subject: str
    teacher_id: int

class EvaluationCreate(EvaluationBase):
    grade: Optional[str] = None
    comment: Optional[str] = None

class EvaluationUpdate(BaseModel):
    subject: Optional[str] = None
    grade: Optional[str] = None
    comment: Optional[str] = None
    teacher_id: Optional[int] = None

class EvaluationResponse(EvaluationBase):
    id: int
    grade: Optional[str] = None
    comment: Optional[str] = None

    class Config:
        from_attributes = True

# Schedule
class ScheduleBase(BaseModel):
    class_id: int
    day: str
    start_time: time
    end_time: time
    subject: str
    teacher_id: int
    room: Optional[str] = None

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseModel):
    day: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    subject: Optional[str] = None
    teacher_id: Optional[int] = None
    room: Optional[str] = None

class ScheduleResponse(ScheduleBase):
    id: int

    class Config:
        from_attributes = True

class ScheduleDetailResponse(ScheduleResponse):
    class_: ClassResponse
    teacher: TeacherResponse

    class Config:
        from_attributes = True
        fields = {'class_': {'alias': 'class'}}

# Weekly schedule response
class WeeklyScheduleResponse(BaseModel):
    class_id: Optional[int] = None
    teacher_id: Optional[int] = None
    weekdays: Dict[str, List[ScheduleResponse]]
    
    class Config:
        from_attributes = True

# Notification
class NotificationBase(BaseModel):
    user_id: int
    title: str
    content: str
    type: NotificationType
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

# Add the missing BulkNotificationCreate schema
class BulkNotificationCreate(BaseModel):
    user_ids: List[int]  # List of user IDs to receive the notification
    title: str
    content: str
    type: NotificationType
    link: Optional[str] = None

class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_read: Optional[bool] = None
    type: Optional[NotificationType] = None
    link: Optional[str] = None

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

class NotificationDetailResponse(NotificationResponse):
    user: UserResponse

    class Config:
        from_attributes = True

# Message
class MessageBase(BaseModel):
    title: str
    content: str
    type: MessageType
    sent_by: int

class MessageCreate(MessageBase):
    recipients: List[int]  # List of user IDs to receive the message

class MessageUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[MessageType] = None

class MessageResponse(MessageBase):
    id: int
    sent_at: datetime

    class Config:
        from_attributes = True

# Add Conversation schemas
class ConversationBase(BaseModel):
    participant1_id: int
    participant2_id: int

class ConversationCreate(BaseModel):
    other_user_id: int  # Only need the other user's ID since the current user is inferred from the token

class ConversationResponse(BaseModel):
    id: int
    participant1_id: int
    participant2_id: int
    created_at: datetime
    last_message_at: datetime
    
    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True

# MessageRecipient
class MessageRecipientBase(BaseModel):
    message_id: int
    user_id: int

class MessageRecipientCreate(MessageRecipientBase):
    pass

class MessageRecipientUpdate(BaseModel):
    is_read: Optional[bool] = None
    read_at: Optional[datetime] = None

class MessageRecipientResponse(MessageRecipientBase):
    is_read: bool
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# AccessRequest
class AccessRequestBase(BaseModel):
    email: EmailStr
    last_name: str
    first_name: str
    phone: Optional[str] = None
    role: str
    message: Optional[str] = None

class AccessRequestCreate(AccessRequestBase):
    pass

class AccessRequestUpdate(BaseModel):
    status: Optional[AccessRequestStatus] = None
    processed_by: Optional[int] = None
    processed_at: Optional[datetime] = None

class AccessRequestResponse(AccessRequestBase):
    id: int
    request_date: datetime
    status: AccessRequestStatus
    processed_by: Optional[int] = None
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Configuration
class ConfigurationBase(BaseModel):
    key: str
    value: str
    category: Optional[str] = None
    description: Optional[str] = None

class ConfigurationCreate(ConfigurationBase):
    pass

class ConfigurationUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class ConfigurationResponse(ConfigurationBase):
    id: int

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Statistics and dashboard schemas
class AttendanceStatistics(BaseModel):
    total_students: int
    present: int
    absent: int
    justified: int
    attendance_rate: float

class PaymentStatistics(BaseModel):
    total_paid: float
    pending: float
    overdue: float
    collection_rate: float

class ClassStatistics(BaseModel):
    name: str
    level: str
    total_students: int
    capacity: int
    fill_rate: float

class Dashboard(BaseModel):
    total_students: int
    total_classes: int
    global_attendance_rate: float
    global_collection_rate: float
    classes: List[ClassStatistics]
    attendance: AttendanceStatistics
    payments: PaymentStatistics

# Add this at the end of the file (for forward references)
StudentDetailResponse.update_forward_refs()
