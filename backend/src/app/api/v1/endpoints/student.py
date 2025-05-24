from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import student as crud
from src.app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse
)

router = APIRouter()

@router.get("/", response_model=List[StudentResponse])
def get_students(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    email: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get students with optional filtering.
    """
    students, _ = crud.get_students(
        db=db,
        skip=skip,
        limit=limit,
        name=name,
        email=email
    )
    return students

@router.post("/", response_model=StudentResponse)
def create_student(
    *,
    db: Session = Depends(deps.get_db),
    student_in: StudentCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new student.
    """
    return crud.create_student(db=db, student=student_in)

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    *,
    db: Session = Depends(deps.get_db),
    student_id: int,
    student_in: StudentUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update student.
    """
    student = crud.get_student(db=db, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return crud.update_student(db=db, student_id=student_id, student=student_in)

@router.delete("/{student_id}")
def delete_student(
    *,
    db: Session = Depends(deps.get_db),
    student_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete student.
    """
    student = crud.get_student(db=db, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if crud.delete_student(db=db, student_id=student_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete student")
