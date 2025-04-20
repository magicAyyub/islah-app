# -*- coding: utf-8 -*-
import enum
from datetime import date

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    TEACHER = "teacher"
    PARENT = "parent"
    STUDENT = "student"

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    COMPLETED = "completed"
    WITHDRAWN = "withdrawn"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    MOBILE_MONEY = "mobile_money"
    CHECK = "check"

class PaymentType(str, enum.Enum):
    REGISTRATION = "registration"
    TUITION = "tuition"
    SUPPLIES = "supplies"
    UNIFORM = "uniform"
    ACTIVITY = "activity"
    OTHER = "other"

class PaymentStatus(str, enum.Enum):
    PAID = "paid"
    PENDING = "pending"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class ReportCardStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class AccessRequestType(str, enum.Enum):
    STUDENT_DATA = "student_data"
    FINANCIAL_DATA = "financial_data"
    REPORT_CARDS = "report_cards"
    ADMIN_PANEL = "admin_panel"
    OTHER = "other"

class AccessRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class NotificationType(str, enum.Enum):
    INFO = "info"
    ALERT = "alert"
    SUCCESS = "success"
    ERROR = "error"

# Utility functions that might be shared between models and schemas
def get_current_school_year():
    """Returns the current school year in format YYYY-YYYY"""
    today = date.today()
    if today.month < 9:  # Before September
        return f"{today.year-1}-{today.year}"
    else:  # September or later
        return f"{today.year}-{today.year+1}"
