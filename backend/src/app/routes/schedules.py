# src/routes/schedules.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, time

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_teacher_role
from src.models import Schedule, Class, Teacher
from src.schemas import (
    ScheduleCreate, ScheduleUpdate, ScheduleResponse, 
    ScheduleDetailResponse, WeeklyScheduleResponse
)

router = APIRouter(
    prefix="/schedules",
    tags=["Schedules"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ScheduleResponse])
async def read_schedules(
    skip: int = 0,
    limit: int = 100,
    class_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    day_of_week: Optional[int] = None,
    subject: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Schedule)
    
    if class_id:
        query = query.filter(Schedule.class_id == class_id)
    
    if teacher_id:
        query = query.filter(Schedule.teacher_id == teacher_id)
    
    if day_of_week is not None:
        query = query.filter(Schedule.day_of_week == day_of_week)
    
    if subject:
        query = query.filter(Schedule.subject == subject)
    
    schedules = query.order_by(Schedule.day_of_week, Schedule.start_time).offset(skip).limit(limit).all()
    return schedules

@router.get("/weekly", response_model=WeeklyScheduleResponse)
async def get_weekly_schedule(
    class_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not class_id and not teacher_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either class_id or teacher_id must be provided"
        )
    
    query = db.query(Schedule)
    
    if class_id:
        query = query.filter(Schedule.class_id == class_id)
    
    if teacher_id:
        query = query.filter(Schedule.teacher_id == teacher_id)
    
    schedules = query.order_by(Schedule.day_of_week, Schedule.start_time).all()
    
    # Group schedules by day of week
    weekly_schedule = {day: [] for day in range(1, 8)}  # 1=Monday, 7=Sunday
    
    for schedule in schedules:
        weekly_schedule[schedule.day_of_week].append(schedule)
    
    return {"weekly_schedule": weekly_schedule}

@router.get("/{schedule_id}", response_model=ScheduleDetailResponse)
async def read_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    # Check if class exists
    class_ = db.query(Class).filter(Class.id == schedule.class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if teacher exists
    teacher = db.query(Teacher).filter(Teacher.id == schedule.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check for schedule conflicts for the class
    class_conflicts = db.query(Schedule).filter(
        Schedule.class_id == schedule.class_id,
        Schedule.day_of_week == schedule.day_of_week,
        Schedule.start_time < schedule.end_time,
        Schedule.end_time > schedule.start_time
    ).all()
    
    if class_conflicts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule conflicts with existing class schedule"
        )
    
    # Check for schedule conflicts for the teacher
    teacher_conflicts = db.query(Schedule).filter(
        Schedule.teacher_id == schedule.teacher_id,
        Schedule.day_of_week == schedule.day_of_week,
        Schedule.start_time < schedule.end_time,
        Schedule.end_time > schedule.start_time
    ).all()
    
    if teacher_conflicts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule conflicts with existing teacher schedule"
        )
    
    db_schedule = Schedule(
        class_id=schedule.class_id,
        teacher_id=schedule.teacher_id,
        subject=schedule.subject,
        day_of_week=schedule.day_of_week,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        room=schedule.room,
        is_recurring=schedule.is_recurring
    )
    
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(
    schedule_id: int,
    schedule: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    update_data = schedule.dict(exclude_unset=True)
    
    # Check for conflicts if time or day is being updated
    if "day_of_week" in update_data or "start_time" in update_data or "end_time" in update_data:
        day = update_data.get("day_of_week", db_schedule.day_of_week)
        start = update_data.get("start_time", db_schedule.start_time)
        end = update_data.get("end_time", db_schedule.end_time)
        
        # Check for class conflicts
        class_conflicts = db.query(Schedule).filter(
            Schedule.class_id == db_schedule.class_id,
            Schedule.id != schedule_id,
            Schedule.day_of_week == day,
            Schedule.start_time < end,
            Schedule.end_time > start
        ).all()
        
        if class_conflicts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Schedule conflicts with existing class schedule"
            )
        
        # Check for teacher conflicts
        teacher_conflicts = db.query(Schedule).filter(
            Schedule.teacher_id == db_schedule.teacher_id,
            Schedule.id != schedule_id,
            Schedule.day_of_week == day,
            Schedule.start_time < end,
            Schedule.end_time > start
        ).all()
        
        if teacher_conflicts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Schedule conflicts with existing teacher schedule"
            )
    
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_teacher_role)
):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(db_schedule)
    db.commit()
    
    return None