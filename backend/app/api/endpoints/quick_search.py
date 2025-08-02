from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_, func
from typing import Optional, List

from app.database.session import get_db
from app.database.models import Student as StudentModel, Parent as ParentModel, User
from app.api.dependencies import get_current_user
from app.schemas.student import Student
from app.schemas.parent import Parent

router = APIRouter()

@router.get("/students", response_model=List[Student])
def quick_search_students(
    search: str = Query(..., description="Search term for student names only"),
    limit: int = Query(5, ge=1, le=10, description="Maximum number of results"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Quick search for students - only matches student names, not parent names.
    This is specifically for the dashboard quick search functionality.
    """
    search_term = f"%{search.lower()}%"
    
    query = db.query(StudentModel).options(
        selectinload(StudentModel.parent),
        selectinload(StudentModel.__mapper__.relationships['class']),
        selectinload(StudentModel.flags)
    ).filter(
        or_(
            func.lower(StudentModel.first_name).like(search_term),
            func.lower(StudentModel.last_name).like(search_term),
            func.lower(func.concat(StudentModel.first_name, ' ', StudentModel.last_name)).like(search_term)
        )
    ).order_by(StudentModel.first_name.asc(), StudentModel.last_name.asc()).limit(limit)
    
    return query.all()

@router.get("/parents", response_model=List[Parent])
def quick_search_parents(
    search: str = Query(..., description="Search term for parent names only"),
    limit: int = Query(5, ge=1, le=10, description="Maximum number of results"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Quick search for parents - only matches parent names.
    This is specifically for the dashboard quick search functionality.
    """
    search_term = f"%{search.lower()}%"
    
    query = db.query(ParentModel).filter(
        or_(
            func.lower(ParentModel.first_name).like(search_term),
            func.lower(ParentModel.last_name).like(search_term),
            func.lower(func.concat(ParentModel.first_name, ' ', ParentModel.last_name)).like(search_term),
            func.lower(ParentModel.phone).like(search_term),
            func.lower(ParentModel.email).like(search_term)
        )
    ).order_by(ParentModel.first_name.asc(), ParentModel.last_name.asc()).limit(limit)
    
    # Convert to response format expected by frontend
    results = []
    for parent in query.all():
        parent_dict = {
            "id": parent.id,
            "first_name": parent.first_name,
            "last_name": parent.last_name,
            "phone": parent.phone,
            "email": parent.email,
            "address": parent.address,
            "emergency_contact": parent.mobile  # Map mobile to emergency_contact for frontend
        }
        results.append(parent_dict)
    
    return results
