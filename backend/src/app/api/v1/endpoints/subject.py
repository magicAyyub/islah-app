from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import subject as crud
from src.app.schemas.subject import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse
)

router = APIRouter()

@router.get("/", response_model=List[SubjectResponse])
def get_subjects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get subjects with optional filtering.
    """
    subjects, _ = crud.get_subjects(
        db=db,
        skip=skip,
        limit=limit,
        name=name
    )
    return subjects

@router.post("/", response_model=SubjectResponse)
def create_subject(
    *,
    db: Session = Depends(deps.get_db),
    subject_in: SubjectCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new subject.
    """
    return crud.create_subject(db=db, subject=subject_in)

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    *,
    db: Session = Depends(deps.get_db),
    subject_id: int,
    subject_in: SubjectUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update subject.
    """
    subject = crud.get_subject(db=db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return crud.update_subject(db=db, subject_id=subject_id, subject=subject_in)

@router.delete("/{subject_id}")
def delete_subject(
    *,
    db: Session = Depends(deps.get_db),
    subject_id: int,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete subject.
    """
    subject = crud.get_subject(db=db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    if crud.delete_subject(db=db, subject_id=subject_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete subject")
