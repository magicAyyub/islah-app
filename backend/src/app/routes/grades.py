# src/routes/grades.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_teacher_role
from src.models import Grade, User
from src.schemas import GradeCreate, GradeUpdate, GradeResponse, GradeDetailResponse

router = APIRouter(
    prefix="/grades",
    tags=["Grades"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[GradeResponse])
async def read_grades(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = Query(None, description="Filter by student ID"),
    subject_id: Optional[int] = Query(None, description="Filter by subject ID"),
    term: Optional[str] = Query(None, description="Filter by term"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Grade)
    
    if student_id:
        query = query.filter(Grade.student_id == student_id)
    
    if subject_id:
        query = query.filter(Grade.subject_id == subject_id)
    
    if term:
        query = query.filter(Grade.term == term)
    
    grades = query.offset(skip).limit(limit).all()
    return grades

@router.get("/{grade_id}", response_model=GradeDetailResponse)
async def read_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if db_grade is None:
        raise HTTPException(status_code=404, detail="Grade not found")
    return db_grade

@router.post("/", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
async def create_grade(
    grade: GradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    db_grade = Grade(
        student_id=grade.student_id,
        subject_id=grade.subject_id,
        term=grade.term,
        score=grade.score,
        comment=grade.comment
    )
    
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    
    return db_grade

@router.put("/{grade_id}", response_model=GradeResponse)
async def update_grade(
    grade_id: int,
    grade: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if db_grade is None:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    update_data = grade.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_grade, key, value)
    
    db.commit()
    db.refresh(db_grade)
    
    return db_grade

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_teacher_role)
):
    db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if db_grade is None:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    db.delete(db_grade)
    db.commit()
    
    return None
