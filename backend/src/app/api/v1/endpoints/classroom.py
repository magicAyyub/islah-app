from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import classroom as crud
from src.app.schemas.classroom import (
    ClassroomCreate,
    ClassroomUpdate,
    ClassroomResponse
)
from src.app.schemas.student import StudentResponse

router = APIRouter()

@router.get("/", response_model=List[ClassroomResponse])
def get_classrooms(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    label: Optional[str] = None,
    level_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get classrooms with optional filtering.
    """
    classrooms, _ = crud.get_classrooms(
        db=db,
        skip=skip,
        limit=limit,
        label=label,
        level_id=level_id,
        teacher_id=teacher_id
    )
    return classrooms

@router.post("/", response_model=ClassroomResponse)
def create_classroom(
    *,
    db: Session = Depends(deps.get_db),
    classroom_in: ClassroomCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new classroom.
    """
    return crud.create_classroom(db=db, classroom=classroom_in)

@router.put("/{classroom_id}", response_model=ClassroomResponse)
def update_classroom(
    *,
    db: Session = Depends(deps.get_db),
    classroom_id: int,
    classroom_in: ClassroomUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update classroom.
    """
    classroom = crud.get_classroom(db=db, classroom_id=classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return crud.update_classroom(db=db, classroom_id=classroom_id, classroom=classroom_in)

@router.delete("/{classroom_id}")
def delete_classroom(
    *,
    db: Session = Depends(deps.get_db),
    classroom_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete classroom.
    """
    classroom = crud.get_classroom(db=db, classroom_id=classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    if crud.delete_classroom(db=db, classroom_id=classroom_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete classroom")

@router.get("/{classroom_id}/students", response_model=List[StudentResponse])
def get_classroom_students(
    *,
    db: Session = Depends(deps.get_db),
    classroom_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Get all students in a classroom.
    """
    classroom = crud.get_classroom(db=db, classroom_id=classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return crud.get_classroom_students(db=db, classroom_id=classroom_id)
