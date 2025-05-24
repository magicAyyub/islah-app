"""
Enums for various statuses and types used in the application.
These enums are used to standardize the values used in the application,
making it easier to manage and understand the different states and types
of data.
"""
import enum
from datetime import date

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    TEACHER = "TEACHER"
    PARENT = "PARENT"
    STUDENT = "STUDENT"

class Gender(str, enum.Enum):
    MALE = "MALE"   
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    WITHDRAWN = "WITHDRAWN"
    CANCELLED = "CANCELLED"

class PaymentMethod(str, enum.Enum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    MOBILE_MONEY = "MOBILE_MONEY"
    CHECK = "CHECK"

class PaymentType(str, enum.Enum):
    REGISTRATION = "REGISTRATION"
    TUITION = "TUITION"
    SUPPLIES = "SUPPLIES"
    UNIFORM = "UNIFORM"
    ACTIVITY = "ACTIVITY"
    OTHER = "OTHER"

class PaymentStatus(str, enum.Enum):
    PAID = "PAID"
    PENDING = "PENDING"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LATE = "LATE"
    EXCUSED = "EXCUSED"

class ReportCardStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class AccessRequestType(str, enum.Enum):
    STUDENT_DATA = "STUDENT_DATA"
    FINANCIAL_DATA = "FINANCIAL_DATA"
    REPORT_CARDS = "REPORT_CARDS"
    ADMIN_PANEL = "ADMIN_PANEL"
    OTHER = "OTHER"

class AccessRequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class NotificationType(str, enum.Enum):
    INFO = "INFO"
    ALERT = "ALERT"
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"

# Utility functions that might be shared between models and schemas
def get_current_school_year():
    """Returns the current school year in format YYYY-YYYY"""
    today = date.today()
    if today.month < 9:  # Before September
        return f"{today.year-1}-{today.year}"
    else:  # September or later
        return f"{today.year}-{today.year+1}"
