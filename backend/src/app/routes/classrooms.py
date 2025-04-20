# src/routes/classrooms.py

from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.utils.pagination import get_pagination_meta
from src.models import Classroom, User, Level, Teacher
from src.schemas import ClassroomCreate, ClassroomUpdate, ClassroomResponse, ClassroomDetailResponse
from src.utils.error_handlers import ResourceNotFoundError, ForeignKeyViolationError, DatabaseError
from src.utils.response_models import APIResponse, PaginatedResponse, PaginationMeta

router = APIRouter(
    prefix="/classrooms",
    tags=["Classrooms"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Classroom not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[ClassroomResponse],
    summary="Get all classrooms",
    description="Retrieve a list of all classrooms with optional filtering and pagination"
)
async def read_classrooms(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    level_id: Optional[int] = Query(None, description="Filter by level ID"),
    teacher_id: Optional[int] = Query(None, description="Filter by teacher ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Classroom)
        
        # Apply filters
        if level_id:
            query = query.filter(Classroom.level_id == level_id)
        
        if teacher_id:
            query = query.filter(Classroom.teacher_id == teacher_id)
        
        # Get total count for pagination
        total = query.count()
        
        # Apply pagination
        classrooms = query.offset(skip).limit(limit).all()
        
        # Calculate pagination metadata
        pagination = get_pagination_meta(total, skip, limit)
        
        # Build response
        return PaginatedResponse(
            success=True,
            data=classrooms,
            message=f"Retrieved {len(classrooms)} classrooms",
            pagination=pagination
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving classrooms", original_error=e)

@router.get(
    "/{classroom_id}", 
    response_model=APIResponse[ClassroomDetailResponse],
    summary="Get classroom by ID",
    description="Retrieve detailed information about a specific classroom"
)
async def read_classroom(
    classroom_id: int = Path(..., ge=1, description="The ID of the classroom to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if db_classroom is None:
            raise ResourceNotFoundError("Classroom", classroom_id)
        
        return APIResponse(
            success=True,
            data=db_classroom,
            message=f"Retrieved classroom {classroom_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving classroom {classroom_id}", original_error=e)

@router.post(
    "/", 
    response_model=APIResponse[ClassroomResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new classroom",
    description="Create a new classroom with the provided details"
)
async def create_classroom(
    classroom: ClassroomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Validate level exists
        level = db.query(Level).filter(Level.id == classroom.level_id).first()
        if not level:
            raise ForeignKeyViolationError(
                resource_type="Classroom",
                field="level_id",
                value=classroom.level_id,
                referenced_resource="Level"
            )
        
        # Validate teacher exists if provided
        if classroom.teacher_id is not None:
            teacher = db.query(Teacher).filter(Teacher.id == classroom.teacher_id).first()
            if not teacher:
                raise ForeignKeyViolationError(
                    resource_type="Classroom",
                    field="teacher_id",
                    value=classroom.teacher_id,
                    referenced_resource="Teacher"
                )
        
        # Create classroom
        db_classroom = Classroom(
            label=classroom.label,
            level_id=classroom.level_id,
            schedule=classroom.schedule,
            capacity=classroom.capacity,
            teacher_id=classroom.teacher_id
        )
        
        db.add(db_classroom)
        db.commit()
        db.refresh(db_classroom)
        
        return APIResponse(
            success=True,
            data=db_classroom,
            message=f"Classroom '{classroom.label}' created successfully"
        )
    except ForeignKeyViolationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating classroom", original_error=e)

@router.put(
    "/{classroom_id}", 
    response_model=APIResponse[ClassroomResponse],
    summary="Update a classroom",
    description="Update an existing classroom with the provided details"
)
async def update_classroom(
    classroom_id: int = Path(..., ge=1, description="The ID of the classroom to update"),
    classroom: ClassroomUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if classroom exists
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if db_classroom is None:
            raise ResourceNotFoundError("Classroom", classroom_id)
        
        # Validate level exists if provided
        if classroom.level_id is not None:
            level = db.query(Level).filter(Level.id == classroom.level_id).first()
            if not level:
                raise ForeignKeyViolationError(
                    resource_type="Classroom",
                    field="level_id",
                    value=classroom.level_id,
                    referenced_resource="Level"
                )
        
        # Validate teacher exists if provided
        if classroom.teacher_id is not None:
            teacher = db.query(Teacher).filter(Teacher.id == classroom.teacher_id).first()
            if not teacher:
                raise ForeignKeyViolationError(
                    resource_type="Classroom",
                    field="teacher_id",
                    value=classroom.teacher_id,
                    referenced_resource="Teacher"
                )
        
        # Update classroom
        update_data = classroom.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_classroom, key, value)
        
        db.commit()
        db.refresh(db_classroom)
        
        return APIResponse(
            success=True,
            data=db_classroom,
            message=f"Classroom {classroom_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ForeignKeyViolationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating classroom {classroom_id}", original_error=e)

@router.delete(
    "/{classroom_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a classroom",
    description="Delete an existing classroom"
)
async def delete_classroom(
    classroom_id: int = Path(..., ge=1, description="The ID of the classroom to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if classroom exists
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if db_classroom is None:
            raise ResourceNotFoundError("Classroom", classroom_id)
        
        # Delete classroom
        db.delete(db_classroom)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": classroom_id},
            message=f"Classroom {classroom_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting classroom {classroom_id}", original_error=e)
