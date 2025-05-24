from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import teacher as crud
from src.app.schemas.teacher import (
    TeacherCreate,
    TeacherUpdate,
    TeacherResponse
)

router = APIRouter()

@router.get("/", response_model=List[TeacherResponse])
def get_teachers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get teachers with optional filtering.
    """
    teachers, _ = crud.get_teachers(
        db=db,
        skip=skip,
        limit=limit,
        name=name,
        email=email
    )
    return teachers

@router.post("/", response_model=TeacherResponse)
def create_teacher(
    *,
    db: Session = Depends(deps.get_db),
    teacher_in: TeacherCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new teacher.
    """
    return crud.create_teacher(db=db, teacher=teacher_in)

@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(
    *,
    db: Session = Depends(deps.get_db),
    teacher_id: int,
    teacher_in: TeacherUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update teacher.
    """
    teacher = crud.get_teacher(db=db, teacher_id=teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return crud.update_teacher(db=db, teacher_id=teacher_id, teacher=teacher_in)

@router.delete("/{teacher_id}")
def delete_teacher(
    *,
    db: Session = Depends(deps.get_db),
    teacher_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete teacher.
    """
    teacher = crud.get_teacher(db=db, teacher_id=teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    if crud.delete_teacher(db=db, teacher_id=teacher_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete teacher")
