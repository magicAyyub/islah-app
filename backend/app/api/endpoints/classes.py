from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.schemas.class_schema import Class, ClassCreate, ClassUpdate
from app.services.class_service import (
    create_class, get_class, update_class, delete_class
)
from app.api.pagination import PaginatedResponse, paginate_query, create_paginated_response
from app.api.search import ClassSearchFilters, apply_class_filters
from app.database.models import Class as ClassModel, User
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=Class, status_code=201)
def create_new_class(
    class_data: ClassCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Create a new class"""
    return create_class(db=db, class_data=class_data)

@router.get("/", response_model=PaginatedResponse[Class])
def read_classes(
    # Pagination parameters
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    
    # Search parameters
    search: Optional[str] = Query(None, description="Search in class name and level"),
    level: Optional[str] = Query(None, description="Filter by level"),
    time_slot: Optional[str] = Query(None, description="Filter by time slot"),
    academic_year: Optional[str] = Query(None, description="Filter by academic year"),
    has_availability: Optional[bool] = Query(None, description="Filter by availability"),
    
    # Sorting
    sort_by: Optional[str] = Query("name", description="Sort by field"),
    sort_order: Optional[str] = Query("asc", pattern="^(asc|desc)$", description="Sort order"),
    
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Get paginated list of classes with search and filtering capabilities"""
    # Create search filters
    filters = ClassSearchFilters(
        search=search,
        level=level,
        time_slot=time_slot,
        academic_year=academic_year,
        has_availability=has_availability
    )
    
    # Start with base query
    query = db.query(ClassModel)
    
    # Apply search filters
    query = apply_class_filters(query, filters)
    
    # Apply sorting
    if sort_by and hasattr(ClassModel, sort_by):
        sort_column = getattr(ClassModel, sort_by)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    else:
        # Default sorting
        query = query.order_by(ClassModel.level.asc(), ClassModel.name.asc())
    
    # Apply pagination
    paginated_query, pagination_metadata = paginate_query(query, page, size)
    
    # Execute query and get results
    classes = paginated_query.all()
    
    # Convert to response models
    class_responses = [Class.model_validate(class_obj) for class_obj in classes]
    
    return create_paginated_response(class_responses, pagination_metadata)

@router.get("/simple", response_model=List[Class])
def get_classes_simple(
    academic_year: Optional[str] = Query(None, description="Filter by academic year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Require authentication
):
    """Get simple list of classes (for form selectors)"""
    query = db.query(ClassModel)
    
    if academic_year:
        query = query.filter(ClassModel.academic_year == academic_year)
    
    classes = query.order_by(ClassModel.level.asc(), ClassModel.name.asc()).all()
    
    # Convert to response models
    return [Class.model_validate(cls) for cls in classes]

@router.get("/{class_id}", response_model=Class)
def read_class(class_id: int, db: Session = Depends(get_db)):
    """Get a specific class by ID"""
    return get_class(db=db, class_id=class_id)

@router.put("/{class_id}", response_model=Class)
def update_existing_class(class_id: int, class_update: ClassUpdate, db: Session = Depends(get_db)):
    """Update a class"""
    return update_class(db=db, class_id=class_id, class_update=class_update)

@router.delete("/{class_id}")
def delete_existing_class(class_id: int, db: Session = Depends(get_db)):
    """Delete a class"""
    return delete_class(db=db, class_id=class_id)
