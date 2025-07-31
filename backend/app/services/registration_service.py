from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database.models import Student, Parent, Class, RegistrationStatus
from app.schemas.registration import RegistrationCreate
from datetime import datetime
from fastapi import HTTPException

def register_student(db: Session, registration: RegistrationCreate):
    """Register a new student with parent information"""
    
    # Check if class exists and has capacity
    class_obj = db.query(Class).filter(Class.id == registration.student.class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check class capacity
    current_students = db.query(Student).filter(
        and_(
            Student.class_id == registration.student.class_id,
            Student.registration_status == RegistrationStatus.CONFIRMED
        )
    ).count()
    
    if current_students >= class_obj.capacity:
        raise HTTPException(status_code=400, detail="Class is full")
    
    # Handle parent creation or lookup
    if registration.existing_parent_id:
        parent = db.query(Parent).filter(Parent.id == registration.existing_parent_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent not found")
    else:
        # Create new parent
        parent = Parent(**registration.parent.model_dump())
        db.add(parent)
        db.flush()  # Get the parent ID
    
    # Create student
    student_data = registration.student.model_dump()
    student_data['parent_id'] = parent.id
    student_data['registration_status'] = RegistrationStatus.PENDING
    student_data['registration_date'] = datetime.now()
    
    student = Student(**student_data)
    db.add(student)
    db.commit()
    db.refresh(student)
    
    return {
        "student_id": student.id,
        "parent_id": parent.id,
        "registration_status": student.registration_status.value,
        "registration_date": student.registration_date,
        "class_name": class_obj.name,
        "academic_year": student.academic_year
    }

def get_registrations(db: Session, status: str = None, academic_year: str = None, class_id: int = None):
    """Get registrations with optional filters"""
    query = db.query(Student).join(Class)
    
    if status:
        query = query.filter(Student.registration_status == RegistrationStatus(status))
    if academic_year:
        query = query.filter(Student.academic_year == academic_year)
    if class_id:
        query = query.filter(Student.class_id == class_id)
    
    students = query.all()
    
    results = []
    for student in students:
        # Get class name
        class_obj = db.query(Class).filter(Class.id == student.class_id).first()
        class_name = class_obj.name if class_obj else "No Class"
        
        results.append({
            "student_id": student.id,
            "parent_id": student.parent_id,
            "registration_status": student.registration_status.value,
            "registration_date": student.registration_date,
            "class_name": class_name,
            "academic_year": student.academic_year
        })
    
    return results

def confirm_registration(db: Session, student_id: int):
    """Confirm student registration (usually after payment)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if student.registration_status == RegistrationStatus.CONFIRMED:
        raise HTTPException(status_code=400, detail="Registration already confirmed")
    
    # Check class capacity again
    class_obj = db.query(Class).filter(Class.id == student.class_id).first()
    current_students = db.query(Student).filter(
        and_(
            Student.class_id == student.class_id,
            Student.registration_status == RegistrationStatus.CONFIRMED
        )
    ).count()
    
    if current_students >= class_obj.capacity:
        raise HTTPException(status_code=400, detail="Class is now full")
    
    student.registration_status = RegistrationStatus.CONFIRMED
    db.commit()
    db.refresh(student)
    
    return {
        "student_id": student.id,
        "registration_status": student.registration_status.value,
        "message": "Registration confirmed successfully"
    }

def get_available_classes(db: Session, academic_year: str):
    """Get classes with available spots for registration"""
    classes = db.query(Class).filter(Class.academic_year == academic_year).all()
    
    available_classes = []
    for class_obj in classes:
        confirmed_students = db.query(Student).filter(
            and_(
                Student.class_id == class_obj.id,
                Student.registration_status == RegistrationStatus.CONFIRMED
            )
        ).count()
        
        available_spots = class_obj.capacity - confirmed_students
        
        if available_spots > 0:
            available_classes.append({
                "id": class_obj.id,
                "name": class_obj.name,
                "level": class_obj.level,
                "time_slot": class_obj.time_slot,
                "capacity": class_obj.capacity,
                "enrolled_students": confirmed_students,
                "available_spots": available_spots
            })
    
    return available_classes
