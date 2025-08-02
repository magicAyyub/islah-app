from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException
from datetime import datetime
from app.database.models import Student, Parent, Class, StudentFlag, Payment, Grade, Attendance
from app.schemas.student import StudentCreate, StudentUpdate

def create_student(db: Session, student: StudentCreate):
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_student(db: Session, student_id: int):
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class']),
        selectinload(Student.flags)
    ).filter(Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class']),
        selectinload(Student.flags)
    ).offset(skip).limit(limit).all()

def update_student(db: Session, student_id: int, student_update: StudentUpdate):
    db_student = db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class']),
        selectinload(Student.flags)
    ).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update only the fields that are provided
    update_data = student_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    # Re-fetch with relationships
    return db.query(Student).options(
        selectinload(Student.parent),
        selectinload(Student.__mapper__.relationships['class']),
        selectinload(Student.flags)
    ).filter(Student.id == student_id).first()

def delete_student(db: Session, student_id: int):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}

def expel_student(db: Session, student_id: int, reason: str, expelled_by: int):
    """
    Expel a student - this completely removes the student and ALL related data.
    This is irreversible and should be used only in serious cases.
    """
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    try:
        # Log the expulsion for audit purposes (you might want to create an audit table)
        print(f"EXPULSION: Student {db_student.first_name} {db_student.last_name} (ID: {student_id}) expelled by user {expelled_by}. Reason: {reason}")
        
        # Delete all related records (CASCADE should handle most, but being explicit)
        # Delete student flags
        db.query(StudentFlag).filter(StudentFlag.student_id == student_id).delete()
        
        # Delete payments
        db.query(Payment).filter(Payment.student_id == student_id).delete()
        
        # Delete grades if you have them
        # db.query(Grade).filter(Grade.student_id == student_id).delete()
        
        # Delete attendance records if you have them  
        # db.query(Attendance).filter(Attendance.student_id == student_id).delete()
        
        # Finally delete the student
        db.delete(db_student)
        db.commit()
        
        return {
            "message": f"Student expelled and all data permanently removed",
            "student_name": f"{db_student.first_name} {db_student.last_name}",
            "expelled_by": expelled_by,
            "reason": reason,
            "timestamp": datetime.now()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to expel student: {str(e)}")

def flag_student(db: Session, student_id: int, flag_type: str, reason: str, flagged_by: int):
    """Flag a student for tracking purposes"""
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Create new flag
    db_flag = StudentFlag(
        student_id=student_id,
        flag_type=flag_type,
        reason=reason,
        flagged_by=flagged_by,
        flagged_date=datetime.now(),
        is_active=True
    )
    
    db.add(db_flag)
    db.commit()
    db.refresh(db_flag)
    
    return {
        "message": "Student flagged successfully",
        "flag": db_flag,
        "student_name": f"{db_student.first_name} {db_student.last_name}"
    }

def unflag_student(db: Session, student_id: int):
    """Remove all active flags from a student"""
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Mark all active flags as inactive
    active_flags = db.query(StudentFlag).filter(
        StudentFlag.student_id == student_id,
        StudentFlag.is_active == True
    ).all()
    
    for flag in active_flags:
        flag.is_active = False
        flag.resolved_date = datetime.now()
    
    db.commit()
    
    return {
        "message": f"Removed {len(active_flags)} active flag(s) from student",
        "student_name": f"{db_student.first_name} {db_student.last_name}",
        "flags_removed": len(active_flags)
    }
