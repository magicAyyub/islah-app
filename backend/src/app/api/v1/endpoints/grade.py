from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import grade as crud
from src.app.schemas.grade import (
    GradeCreate,
    GradeUpdate,
    GradeResponse
)

router = APIRouter()

@router.get("/", response_model=List[GradeResponse])
def get_grades(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    term: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get grades with optional filtering.
    """
    try:
        grades, _ = crud.get_grades(
            db=db,
            skip=skip,
            limit=limit,
            student_id=student_id,
            subject_id=subject_id,
            term=term
        )
        return grades
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{grade_id}", response_model=GradeResponse)
def get_grade(
    *,
    db: Session = Depends(deps.get_db),
    grade_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Get a specific grade by ID.
    """
    try:
        return crud.get_grade(db=db, grade_id=grade_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
def create_grade(
    *,
    db: Session = Depends(deps.get_db),
    grade_in: GradeCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new grade.
    """
    try:
        return crud.create_grade(db=db, grade=grade_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{grade_id}", response_model=GradeResponse)
def update_grade(
    *,
    db: Session = Depends(deps.get_db),
    grade_id: int,
    grade_in: GradeUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update grade.
    """
    try:
        return crud.update_grade(db=db, grade_id=grade_id, grade=grade_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete("/{grade_id}")
def delete_grade(
    *,
    db: Session = Depends(deps.get_db),
    grade_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete grade.
    """
    try:
        result = crud.delete_grade(db=db, grade_id=grade_id)
        return {"status": "success", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/student/{student_id}", response_model=List[GradeResponse])
def get_student_grades(
    *,
    db: Session = Depends(deps.get_db),
    student_id: int,
    term: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get all grades for a specific student.
    """
    try:
        return crud.get_student_grades(db=db, student_id=student_id, term=term)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
