# src/routes/teachers.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Optional, Any
import bcrypt

from src.utils.database import get_db
from src.utils.pagination import get_pagination_meta
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Teacher, User
from src.schemas import TeacherCreate, TeacherUpdate, TeacherResponse, TeacherDetailResponse
from src.utils.error_handlers import (
    ResourceNotFoundError,
    ResourceAlreadyExistsError,
    ValidationError,
    DatabaseError,

)
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/teachers",
    tags=["Teachers"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Teacher not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[TeacherResponse],
    summary="Get all teachers",
    description="Retrieve a list of all teachers with optional filtering and pagination"
)
async def read_teachers(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    name: Optional[str] = Query(None, description="Filter by name (first or last)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Teacher)
        
        # Apply filters
        if name:
            query = query.filter(
                (Teacher.first_name.ilike(f"%{name}%")) | 
                (Teacher.last_name.ilike(f"%{name}%"))
            )
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        teachers = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        
        return PaginatedResponse(
            success=True,
            data=teachers,
            message=f"Retrieved {len(teachers)} teachers",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving teachers", original_error=str(e))

@router.get(
    "/count", 
    response_model=APIResponse[int],
    summary="Count teachers",
    description="Get the total number of teachers"
)
async def count_teachers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        total_teachers = db.query(Teacher).count()
        return APIResponse(
            success=True,
            data=total_teachers,
            message="Total number of teachers"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error counting teachers", original_error=str(e))

@router.get(
    "/{teacher_id}", 
    response_model=APIResponse[TeacherDetailResponse],
    summary="Get teacher by ID",
    description="Retrieve detailed information about a specific teacher"
)
async def read_teacher(
    teacher_id: int = Path(..., ge=1, description="The ID of the teacher to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if db_teacher is None:
            raise ResourceNotFoundError("Teacher", teacher_id)
        
        return APIResponse(
            success=True,
            data=db_teacher,
            message=f"Retrieved teacher {teacher_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving teacher {teacher_id}", original_error=str(e))

@router.post(
    "/", 
    response_model=APIResponse[TeacherDetailResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new teacher",
    description="Create a new teacher profile with the provided details"
)
async def create_teacher(
    teacher: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if username exists
        existing_user = db.query(User).filter(User.username == teacher.username).first()
        if existing_user:
            raise ResourceAlreadyExistsError("User", "username", teacher.username)
        
        # Check if teacher with same email exists
        if teacher.email:
            existing_teacher = db.query(Teacher).filter(Teacher.email == teacher.email).first()
            if existing_teacher:
                raise ResourceAlreadyExistsError("Teacher", "email", teacher.email)
        
        # Create user
        hashed_password = bcrypt.hashpw(teacher.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        full_name = f"{teacher.first_name} {teacher.last_name}"
        
        new_user = User(
            username=teacher.username,
            password_hash=hashed_password,
            full_name=full_name,
            role=teacher.user_role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create teacher profile
        db_teacher = Teacher(
            first_name=teacher.first_name,
            last_name=teacher.last_name,
            phone=teacher.phone,
            email=teacher.email,
            user_id=new_user.id
        )
        
        db.add(db_teacher)
        db.commit()
        db.refresh(db_teacher)
        
        return APIResponse(
            success=True,
            data=db_teacher,
            message=f"Teacher {teacher.first_name} {teacher.last_name} created successfully"
        )
    except ResourceAlreadyExistsError as e:
        db.rollback()
        raise e
    except ValidationError as e:
        db.rollback()
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating teacher", original_error=str(e))

@router.put(
    "/{teacher_id}", 
    response_model=APIResponse[TeacherResponse],
    summary="Update a teacher",
    description="Update an existing teacher profile with the provided details"
)
async def update_teacher(
    teacher_id: int = Path(..., ge=1, description="The ID of the teacher to update"),
    teacher: TeacherUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if teacher exists
        db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if db_teacher is None:
            raise ResourceNotFoundError("Teacher", teacher_id)
        
        # Check email uniqueness if changing email
        if teacher.email and teacher.email != db_teacher.email:
            existing_teacher = db.query(Teacher).filter(Teacher.email == teacher.email).first()
            if existing_teacher and existing_teacher.id != teacher_id:
                raise ResourceAlreadyExistsError("Teacher", "email", teacher.email)
        
        # Update teacher
        update_data = teacher.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_teacher, key, value)
        
        # If first_name or last_name changed, update user's full_name
        if 'first_name' in update_data or 'last_name' in update_data:
            user = db.query(User).filter(User.id == db_teacher.user_id).first()
            if user:
                user.full_name = f"{db_teacher.first_name} {db_teacher.last_name}"
                db.add(user)
        
        db.commit()
        db.refresh(db_teacher)
        
        return APIResponse(
            success=True,
            data=db_teacher,
            message=f"Teacher {teacher_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ResourceAlreadyExistsError as e:
        db.rollback()
        raise e
    except ValidationError as e:
        db.rollback()
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating teacher {teacher_id}", original_error=str(e))

@router.delete(
    "/{teacher_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a teacher",
    description="Delete a teacher profile by ID"
)
async def delete_teacher(
    teacher_id: int = Path(..., ge=1, description="The ID of the teacher to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if teacher exists
        db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if db_teacher is None:
            raise ResourceNotFoundError("Teacher", teacher_id)
        
        # Check if teacher has associated classes or courses
        # This would require importing the relevant models
        # classes = db.query(Class).filter(Class.teacher_id == teacher_id).count()
        # if classes > 0:
        #     raise ValidationError(f"Cannot delete teacher with ID {teacher_id} because they have {classes} associated classes")
        
        # Get user ID for later deletion
        user_id = db_teacher.user_id
        
        # Delete teacher
        db.delete(db_teacher)
        
        # Delete associated user if exists
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                db.delete(user)
        
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": teacher_id},
            message=f"Teacher {teacher_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ValidationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting teacher {teacher_id}", original_error=str(e))
