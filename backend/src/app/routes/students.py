# src/app/routes/students.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Student, User, Parent, Classroom
from src.schemas import StudentCreate, StudentUpdate, StudentResponse, StudentDetailResponse
from src.utils.error_handlers import ResourceNotFoundError, ForeignKeyViolationError, DatabaseError, ValidationError
from src.utils.response_models import APIResponse, PaginatedResponse
from src.utils.pagination import paginate_query

router = APIRouter(
    prefix="/students",
    tags=["Students"],
    dependencies=[Depends(get_current_user)],
    responses={
        404: {"description": "Student not found"},
        400: {"description": "Bad request"},
        403: {"description": "Not authorized"},
        500: {"description": "Internal server error"}
    },
)

@router.get(
    "/", 
    response_model=PaginatedResponse[StudentResponse],
    summary="Get all students",
    description="Retrieve a list of all students with optional filtering and pagination"
)
async def read_students(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    name: Optional[str] = Query(None, description="Filter by name (first or last)"),
    class_id: Optional[int] = Query(None, description="Filter by classroom ID"),
    status: Optional[str] = Query(None, description="Filter by enrollment status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Build the query
        query = db.query(Student)
        
        # Apply filters
        if name:
            query = query.filter(
                (Student.first_name.ilike(f"%{name}%")) | 
                (Student.last_name.ilike(f"%{name}%"))
            )
        
        if class_id:
            query = query.filter(Student.current_class_id == class_id)
        
        if status:
            query = query.filter(Student.status == status)
        
        # Apply pagination and get metadata
        students, pagination_meta = paginate_query(query, skip, limit)
        
        # Build response
        return PaginatedResponse(
            success=True,
            data=students,
            message=f"Retrieved {len(students)} students",
            pagination=pagination_meta
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Error retrieving students", original_error=e)

@router.get(
    "/{student_id}", 
    response_model=APIResponse[StudentDetailResponse],
    summary="Get student by ID",
    description="Retrieve detailed information about a specific student"
)
async def read_student(
    student_id: int = Path(..., ge=1, description="The ID of the student to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_student = db.query(Student).filter(Student.id == student_id).first()
        if db_student is None:
            raise ResourceNotFoundError("Student", student_id)
        
        return APIResponse(
            success=True,
            data=db_student,
            message=f"Retrieved student {student_id}"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        raise DatabaseError(detail=f"Error retrieving student {student_id}", original_error=e)

@router.post(
    "/", 
    response_model=APIResponse[StudentResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new student",
    description="Create a new student with the provided details"
)
async def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        validation_errors = []
        
        # Validate parent_id if provided
        if student.parent_id is not None:
            if student.parent_id <= 0:
                validation_errors.append({
                    "field": "parent_id",
                    "message": f"Invalid parent_id: {student.parent_id}. Must be a positive integer or null."
                })
            else:
                parent = db.query(Parent).filter(Parent.id == student.parent_id).first()
                if not parent:
                    validation_errors.append({
                        "field": "parent_id",
                        "message": f"Parent with ID {student.parent_id} does not exist."
                    })
        
        # Validate current_class_id if provided
        if student.current_class_id is not None:
            if student.current_class_id <= 0:
                validation_errors.append({
                    "field": "current_class_id",
                    "message": f"Invalid current_class_id: {student.current_class_id}. Must be a positive integer or null."
                })
            else:
                classroom = db.query(Classroom).filter(Classroom.id == student.current_class_id).first()
                if not classroom:
                    validation_errors.append({
                        "field": "current_class_id",
                        "message": f"Classroom with ID {student.current_class_id} does not exist."
                    })
        
        # If there are validation errors, raise them
        if validation_errors:
            raise ValidationError(errors=validation_errors)
        
        # Create student
        db_student = Student(
            first_name=student.first_name,
            last_name=student.last_name,
            birth_date=student.birth_date,
            gender=student.gender,
            status=student.status,
            enrolled_at=student.enrolled_at,
            parent_id=student.parent_id,
            current_class_id=student.current_class_id
        )
        
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        
        return APIResponse(
            success=True,
            data=db_student,
            message=f"Student {student.first_name} {student.last_name} created successfully"
        )
    except ValidationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail="Error creating student", original_error=e)
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error creating student: {str(e)}")

@router.put(
    "/{student_id}", 
    response_model=APIResponse[StudentResponse],
    summary="Update a student",
    description="Update an existing student with the provided details"
)
async def update_student(
    student_id: int = Path(..., ge=1, description="The ID of the student to update"),
    student: StudentUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if student exists
        db_student = db.query(Student).filter(Student.id == student_id).first()
        if db_student is None:
            raise ResourceNotFoundError("Student", student_id)
        
        validation_errors = []
        
        # Validate parent_id if provided
        if student.parent_id is not None:
            if student.parent_id <= 0:
                validation_errors.append({
                    "field": "parent_id",
                    "message": f"Invalid parent_id: {student.parent_id}. Must be a positive integer or null."
                })
            else:
                parent = db.query(Parent).filter(Parent.id == student.parent_id).first()
                if not parent:
                    validation_errors.append({
                        "field": "parent_id",
                        "message": f"Parent with ID {student.parent_id} does not exist."
                    })
        
        # Validate current_class_id if provided
        if student.current_class_id is not None:
            if student.current_class_id <= 0:
                validation_errors.append({
                    "field": "current_class_id",
                    "message": f"Invalid current_class_id: {student.current_class_id}. Must be a positive integer or null."
                })
            else:
                classroom = db.query(Classroom).filter(Classroom.id == student.current_class_id).first()
                if not classroom:
                    validation_errors.append({
                        "field": "current_class_id",
                        "message": f"Classroom with ID {student.current_class_id} does not exist."
                    })
        
        # If there are validation errors, raise them
        if validation_errors:
            raise ValidationError(errors=validation_errors)
        
        # Update student
        update_data = student.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_student, key, value)
        
        db.commit()
        db.refresh(db_student)
        
        return APIResponse(
            success=True,
            data=db_student,
            message=f"Student {student_id} updated successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except ValidationError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error updating student {student_id}", original_error=e)
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error updating student: {str(e)}")

@router.delete(
    "/{student_id}", 
    response_model=APIResponse[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Delete a student",
    description="Delete an existing student"
)
async def delete_student(
    student_id: int = Path(..., ge=1, description="The ID of the student to delete"),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_staff_role)
):
    try:
        # Check if student exists
        db_student = db.query(Student).filter(Student.id == student_id).first()
        if db_student is None:
            raise ResourceNotFoundError("Student", student_id)
        
        # Delete student
        db.delete(db_student)
        db.commit()
        
        return APIResponse(
            success=True,
            data={"id": student_id},
            message=f"Student {student_id} deleted successfully"
        )
    except ResourceNotFoundError as e:
        raise e
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseError(detail=f"Error deleting student {student_id}", original_error=e)
    except Exception as e:
        db.rollback()
        raise DatabaseError(detail=f"Unexpected error deleting student: {str(e)}")
