from typing import Optional, List
from sqlalchemy.orm import Query
from sqlalchemy import or_, and_, func
from datetime import datetime, date

class SearchFilters:
    """Base class for search filters."""
    pass

class StudentSearchFilters(SearchFilters):
    """Search filters for students."""
    
    def __init__(
        self,
        search: Optional[str] = None,
        class_id: Optional[int] = None,
        academic_year: Optional[str] = None,
        registration_status: Optional[str] = None,
        gender: Optional[str] = None,
        age_min: Optional[int] = None,
        age_max: Optional[int] = None
    ):
        self.search = search
        self.class_id = class_id
        self.academic_year = academic_year
        self.registration_status = registration_status
        self.gender = gender
        self.age_min = age_min
        self.age_max = age_max

class PaymentSearchFilters(SearchFilters):
    """Search filters for payments."""
    
    def __init__(
        self,
        search: Optional[str] = None,
        student_id: Optional[int] = None,
        payment_type: Optional[str] = None,
        payment_method: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        amount_min: Optional[float] = None,
        amount_max: Optional[float] = None
    ):
        self.search = search
        self.student_id = student_id
        self.payment_type = payment_type
        self.payment_method = payment_method
        self.date_from = date_from
        self.date_to = date_to
        self.amount_min = amount_min
        self.amount_max = amount_max

class ClassSearchFilters(SearchFilters):
    """Search filters for classes."""
    
    def __init__(
        self,
        search: Optional[str] = None,
        level: Optional[str] = None,
        time_slot: Optional[str] = None,
        academic_year: Optional[str] = None,
        has_availability: Optional[bool] = None
    ):
        self.search = search
        self.level = level
        self.time_slot = time_slot
        self.academic_year = academic_year
        self.has_availability = has_availability

def apply_student_filters(query: Query, filters: StudentSearchFilters) -> Query:
    """Apply search filters to student query."""
    from ..database.models import Student, Parent, Class
    
    # Text search across student and parent names
    if filters.search:
        search_term = f"%{filters.search.lower()}%"
        query = query.join(Parent).filter(
            or_(
                func.lower(Student.first_name).like(search_term),
                func.lower(Student.last_name).like(search_term),
                func.lower(Parent.first_name).like(search_term),
                func.lower(Parent.last_name).like(search_term),
                func.lower(func.concat(Student.first_name, ' ', Student.last_name)).like(search_term),
                func.lower(func.concat(Parent.first_name, ' ', Parent.last_name)).like(search_term)
            )
        )
    
    # Filter by class
    if filters.class_id:
        query = query.filter(Student.class_id == filters.class_id)
    
    # Filter by academic year
    if filters.academic_year:
        query = query.filter(Student.academic_year == filters.academic_year)
    
    # Filter by registration status
    if filters.registration_status:
        query = query.filter(Student.registration_status == filters.registration_status)
    
    # Filter by gender
    if filters.gender:
        query = query.filter(Student.gender.ilike(filters.gender))
    
    # Filter by age range
    if filters.age_min is not None or filters.age_max is not None:
        today = date.today()
        
        if filters.age_min is not None:
            min_birth_date = date(today.year - filters.age_min, today.month, today.day)
            query = query.filter(Student.date_of_birth <= min_birth_date)
        
        if filters.age_max is not None:
            max_birth_date = date(today.year - filters.age_max - 1, today.month, today.day)
            query = query.filter(Student.date_of_birth > max_birth_date)
    
    return query

def apply_payment_filters(query: Query, filters: PaymentSearchFilters) -> Query:
    """Apply search filters to payment query."""
    from ..database.models import Payment, Student
    
    # Text search across student names and receipt numbers
    if filters.search:
        search_term = f"%{filters.search.lower()}%"
        query = query.join(Student).filter(
            or_(
                func.lower(Student.first_name).like(search_term),
                func.lower(Student.last_name).like(search_term),
                func.lower(func.concat(Student.first_name, ' ', Student.last_name)).like(search_term),
                func.lower(Payment.receipt_number).like(search_term)
            )
        )
    
    # Filter by student
    if filters.student_id:
        query = query.filter(Payment.student_id == filters.student_id)
    
    # Filter by payment type
    if filters.payment_type:
        query = query.filter(Payment.payment_type == filters.payment_type)
    
    # Filter by payment method
    if filters.payment_method:
        query = query.filter(Payment.payment_method.ilike(filters.payment_method))
    
    # Filter by date range
    if filters.date_from:
        query = query.filter(func.date(Payment.payment_date) >= filters.date_from)
    
    if filters.date_to:
        query = query.filter(func.date(Payment.payment_date) <= filters.date_to)
    
    # Filter by amount range
    if filters.amount_min is not None:
        query = query.filter(Payment.amount >= filters.amount_min)
    
    if filters.amount_max is not None:
        query = query.filter(Payment.amount <= filters.amount_max)
    
    return query

def apply_class_filters(query: Query, filters: ClassSearchFilters) -> Query:
    """Apply search filters to class query."""
    from ..database.models import Class, Student
    from sqlalchemy import select, func as sql_func
    
    # Text search across class name and level
    if filters.search:
        search_term = f"%{filters.search.lower()}%"
        query = query.filter(
            or_(
                func.lower(Class.name).like(search_term),
                func.lower(Class.level).like(search_term)
            )
        )
    
    # Filter by level
    if filters.level:
        query = query.filter(Class.level.ilike(f"%{filters.level}%"))
    
    # Filter by time slot
    if filters.time_slot:
        query = query.filter(Class.time_slot.ilike(f"%{filters.time_slot}%"))
    
    # Filter by academic year
    if filters.academic_year:
        query = query.filter(Class.academic_year == filters.academic_year)
    
    # Filter by availability
    if filters.has_availability is not None:
        if filters.has_availability:
            # Classes that have available spots
            subquery = select(sql_func.count(Student.id)).where(Student.class_id == Class.id).scalar_subquery()
            query = query.filter(Class.capacity > subquery)
        else:
            # Classes that are full
            subquery = select(sql_func.count(Student.id)).where(Student.class_id == Class.id).scalar_subquery()
            query = query.filter(Class.capacity <= subquery)
    
    return query
