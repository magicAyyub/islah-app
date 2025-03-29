# src/routes/teachers.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_role
from src.models import Teacher, Class, TeacherClassAssignment
from src.schemas import (
    TeacherCreate, TeacherUpdate, TeacherResponse, 
    TeacherDetailResponse, TeacherClassAssignmentCreate
)

router = APIRouter(
    prefix="/teachers",
    tags=["Teachers"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[TeacherResponse])
async def read_teachers(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    subject: Optional[str] = None,
    class_id: Optional[int] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Teacher).filter(Teacher.is_active == is_active)
    
    if name:
        query = query.filter(
            (Teacher.first_name.ilike(f"%{name}%")) | 
            (Teacher.last_name.ilike(f"%{name}%"))
        )
    
    if subject:
        query = query.filter(Teacher.subjects.contains([subject]))
    
    if class_id:
        query = query.join(TeacherClassAssignment).filter(
            TeacherClassAssignment.class_id == class_id
        )
    
    teachers = query.offset(skip).limit(limit).all()
    return teachers

@router.get("/{teacher_id}", response_model=TeacherDetailResponse)
async def read_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.post("/", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
async def create_teacher(
    teacher: TeacherCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    # Check if email is unique
    if teacher.email:
        existing = db.query(Teacher).filter(Teacher.email == teacher.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Teacher with this email already exists"
            )
    
    db_teacher = Teacher(
        last_name=teacher.last_name,
        first_name=teacher.first_name,
        email=teacher.email,
        phone=teacher.phone,
        address=teacher.address,
        hire_date=teacher.hire_date,
        subjects=teacher.subjects,
        qualifications=teacher.qualifications,
        user_id=teacher.user_id
    )
    
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    
    return db_teacher

@router.put("/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(
    teacher_id: int,
    teacher: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check if email is unique if it's being updated
    if teacher.email and teacher.email != db_teacher.email:
        existing = db.query(Teacher).filter(Teacher.email == teacher.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Teacher with this email already exists"
            )
    
    update_data = teacher.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_teacher, key, value)
    
    db.commit()
    db.refresh(db_teacher)
    
    return db_teacher

@router.delete("/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Instead of deleting, mark as inactive
    db_teacher.is_active = False
    db.commit()
    
    return None

@router.post("/{teacher_id}/classes", response_model=TeacherClassAssignmentCreate)
async def assign_teacher_to_class(
    teacher_id: int,
    assignment: TeacherClassAssignmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    # Check if teacher exists
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check if class exists
    class_ = db.query(Class).filter(Class.id == assignment.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if assignment already exists
    existing = db.query(TeacherClassAssignment).filter(
        TeacherClassAssignment.teacher_id == teacher_id,
        TeacherClassAssignment.class_id == assignment.class_id,
        TeacherClassAssignment.subject == assignment.subject
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teacher is already assigned to this class for this subject"
        )
    
    db_assignment = TeacherClassAssignment(
        teacher_id=teacher_id,
        class_id=assignment.class_id,
        subject=assignment.subject,
        is_main_teacher=assignment.is_main_teacher,
        school_year=assignment.school_year
    )
    
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    
    return db_assignment