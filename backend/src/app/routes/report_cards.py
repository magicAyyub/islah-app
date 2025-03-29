# src/routes/report_cards.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_teacher_role
from src.models import ReportCard, Student, Class, Evaluation
from src.schemas import (
    ReportCardCreate, ReportCardUpdate, ReportCardResponse, 
    ReportCardDetailResponse, EvaluationCreate, EvaluationResponse
)

router = APIRouter(
    prefix="/report-cards",
    tags=["Report Cards"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ReportCardResponse])
async def read_report_cards(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    class_id: Optional[int] = None,
    term: Optional[str] = None,
    school_year: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(ReportCard)
    
    if student_id:
        query = query.filter(ReportCard.student_id == student_id)
    
    if class_id:
        query = query.filter(ReportCard.class_id == class_id)
    
    if term:
        query = query.filter(ReportCard.term == term)
    
    if school_year:
        query = query.filter(ReportCard.school_year == school_year)
    
    if status:
        query = query.filter(ReportCard.status == status)
    
    report_cards = query.offset(skip).limit(limit).all()
    return report_cards

@router.get("/{report_card_id}", response_model=ReportCardDetailResponse)
async def read_report_card(
    report_card_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    report_card = db.query(ReportCard).filter(ReportCard.id == report_card_id).first()
    if report_card is None:
        raise HTTPException(status_code=404, detail="Report card not found")
    return report_card

@router.post("/", response_model=ReportCardResponse, status_code=status.HTTP_201_CREATED)
async def create_report_card(
    report_card: ReportCardCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    # Check if student exists
    student = db.query(Student).filter(Student.id == report_card.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if class exists
    class_ = db.query(Class).filter(Class.id == report_card.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if report card already exists for this student, term and school year
    existing = db.query(ReportCard).filter(
        ReportCard.student_id == report_card.student_id,
        ReportCard.term == report_card.term,
        ReportCard.school_year == report_card.school_year
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report card already exists for this student, term and school year"
        )
    
    db_report_card = ReportCard(
        student_id=report_card.student_id,
        class_id=report_card.class_id,
        term=report_card.term,
        school_year=report_card.school_year,
        status=report_card.status,
        publication_date=report_card.publication_date,
        published_by=report_card.published_by
    )
    
    db.add(db_report_card)
    db.commit()
    db.refresh(db_report_card)
    
    return db_report_card

@router.put("/{report_card_id}", response_model=ReportCardResponse)
async def update_report_card(
    report_card_id: int,
    report_card: ReportCardUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    db_report_card = db.query(ReportCard).filter(ReportCard.id == report_card_id).first()
    if db_report_card is None:
        raise HTTPException(status_code=404, detail="Report card not found")
    
    update_data = report_card.dict(exclude_unset=True)
    
    # If status is being updated to "published", set publication date and publisher
    if update_data.get("status") == "published" and db_report_card.status != "published":
        update_data["publication_date"] = date.today()
        update_data["published_by"] = current_user.id
    
    for key, value in update_data.items():
        setattr(db_report_card, key, value)
    
    db.commit()
    db.refresh(db_report_card)
    
    return db_report_card

@router.post("/{report_card_id}/evaluations", response_model=EvaluationResponse)
async def add_evaluation(
    report_card_id: int,
    evaluation: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    # Check if report card exists
    report_card = db.query(ReportCard).filter(ReportCard.id == report_card_id).first()
    if not report_card:
        raise HTTPException(status_code=404, detail="Report card not found")
    
    # Check if evaluation for this subject already exists
    existing = db.query(Evaluation).filter(
        Evaluation.report_card_id == report_card_id,
        Evaluation.subject == evaluation.subject
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evaluation for this subject already exists"
        )
    
    db_evaluation = Evaluation(
        report_card_id=report_card_id,
        subject=evaluation.subject,
        grade=evaluation.grade,
        comment=evaluation.comment,
        teacher_id=evaluation.teacher_id
    )
    
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    
    return db_evaluation