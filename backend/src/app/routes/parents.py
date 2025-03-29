# src/routes/parents.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Parent, Student, ParentStudent
from src.schemas import (
    ParentCreate, ParentUpdate, ParentResponse, 
    ParentDetailResponse, ParentStudentCreate  # Changed from ParentStudentRelationCreate to ParentStudentCreate
)

router = APIRouter(
    prefix="/parents",
    tags=["Parents"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ParentResponse])
async def read_parents(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
    student_id: Optional[int] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Parent).filter(Parent.is_active == is_active)
    
    if name:
        query = query.filter(
            (Parent.first_name.ilike(f"%{name}%")) | 
            (Parent.last_name.ilike(f"%{name}%"))
        )
    
    if email:
        query = query.filter(Parent.email.ilike(f"%{email}%"))
    
    if student_id:
        query = query.join(ParentStudent).filter(
            ParentStudent.student_id == student_id
        )
    
    parents = query.offset(skip).limit(limit).all()
    return parents

@router.get("/{parent_id}", response_model=ParentDetailResponse)
async def read_parent(
    parent_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if parent is None:
        raise HTTPException(status_code=404, detail="Parent not found")
    return parent

@router.post("/", response_model=ParentResponse, status_code=status.HTTP_201_CREATED)
async def create_parent(
    parent: ParentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if email is unique
    if parent.email:
        existing = db.query(Parent).filter(Parent.email == parent.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent with this email already exists"
            )
    
    db_parent = Parent(
        last_name=parent.last_name,
        first_name=parent.first_name,
        email=parent.email,
        phone=parent.phone,
        address=parent.address,
        occupation=parent.occupation,
        user_id=parent.user_id
    )
    
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    
    return db_parent

@router.put("/{parent_id}", response_model=ParentResponse)
async def update_parent(
    parent_id: int,
    parent: ParentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if db_parent is None:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Check if email is unique if it's being updated
    if parent.email and parent.email != db_parent.email:
        existing = db.query(Parent).filter(Parent.email == parent.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent with this email already exists"
            )
    
    update_data = parent.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_parent, key, value)
    
    db.commit()
    db.refresh(db_parent)
    
    return db_parent

@router.delete("/{parent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_parent(
    parent_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if db_parent is None:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Instead of deleting, mark as inactive
    db_parent.is_active = False
    db.commit()
    
    return None

@router.post("/{parent_id}/students", response_model=ParentStudentCreate)  # Changed response_model too
async def add_student_to_parent(
    parent_id: int,
    relation: ParentStudentCreate,  # Changed from ParentStudentRelationCreate to ParentStudentCreate
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if parent exists
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Check if student exists
    student = db.query(Student).filter(Student.id == relation.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if relation already exists
    existing = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent_id,
        ParentStudent.student_id == relation.student_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Relation between this parent and student already exists"
        )
    
    db_relation = ParentStudent(
        parent_id=parent_id,
        student_id=relation.student_id,
        relationship=relation.relationship,  # Changed from relationship_type to match our model
        is_primary_contact=relation.is_primary_contact,  # Changed from is_emergency_contact
        can_pickup=relation.can_pickup  # Changed from is_authorized_pickup
    )
    
    db.add(db_relation)
    db.commit()
    db.refresh(db_relation)
    
    return db_relation