from sqlalchemy.orm import Session
from sqlalchemy import and_, func, extract
from typing import List, Optional
from datetime import date, datetime

from ..database.models import Subject, Grade, Attendance, Student, Class, User
from ..schemas.academic import (
    SubjectCreate, SubjectUpdate, GradeCreate, GradeUpdate, 
    AttendanceCreate, AttendanceUpdate, BulkAttendanceCreate, BulkGradeCreate,
    AttendanceStats, GradeStats
)

class SubjectService:
    @staticmethod
    def create_subject(db: Session, subject_data: SubjectCreate) -> Subject:
        """Create a new subject."""
        db_subject = Subject(**subject_data.model_dump())
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
        return db_subject
    
    @staticmethod
    def get_subject(db: Session, subject_id: int) -> Optional[Subject]:
        """Get subject by ID."""
        return db.query(Subject).filter(Subject.id == subject_id).first()
    
    @staticmethod
    def get_subjects(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        academic_year: Optional[str] = None,
        class_id: Optional[int] = None,
        teacher_id: Optional[int] = None
    ) -> List[Subject]:
        """Get subjects with optional filtering."""
        query = db.query(Subject)
        
        if academic_year:
            query = query.filter(Subject.academic_year == academic_year)
        if class_id:
            query = query.filter(Subject.class_id == class_id)
        if teacher_id:
            query = query.filter(Subject.teacher_id == teacher_id)
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_subject(db: Session, subject_id: int, subject_data: SubjectUpdate) -> Optional[Subject]:
        """Update a subject."""
        db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if not db_subject:
            return None
            
        update_data = subject_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_subject, field, value)
            
        db.commit()
        db.refresh(db_subject)
        return db_subject
    
    @staticmethod
    def delete_subject(db: Session, subject_id: int) -> bool:
        """Delete a subject."""
        db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if not db_subject:
            return False
            
        # Check if subject has grades
        has_grades = db.query(Grade).filter(Grade.subject_id == subject_id).first()
        if has_grades:
            raise ValueError("Cannot delete subject with existing grades")
            
        db.delete(db_subject)
        db.commit()
        return True

class GradeService:
    @staticmethod
    def create_grade(db: Session, grade_data: GradeCreate, recorded_by: int) -> Grade:
        """Create a new grade."""
        # Import database enums and models
        from ..database.models import GradeType, AcademicPeriod, Student, Subject
        
        # Validate that student and subject exist
        student = db.query(Student).filter(Student.id == grade_data.student_id).first()
        if not student:
            raise ValueError(f"Student with ID {grade_data.student_id} not found")
        
        subject = db.query(Subject).filter(Subject.id == grade_data.subject_id).first()
        if not subject:
            raise ValueError(f"Subject with ID {grade_data.subject_id} not found")
        
        # Convert Pydantic enums to database enums
        grade_type_db = None
        academic_period_db = None
        
        # Map Pydantic enum values to database enum members
        for db_enum in GradeType:
            if db_enum.value == grade_data.grade_type.value:
                grade_type_db = db_enum
                break
        
        for db_enum in AcademicPeriod:
            if db_enum.value == grade_data.academic_period.value:
                academic_period_db = db_enum
                break
        
        # Convert Pydantic model to dict with database enum objects
        grade_dict = {
            'student_id': grade_data.student_id,
            'subject_id': grade_data.subject_id,
            'grade_value': grade_data.grade_value,
            'max_grade': grade_data.max_grade,
            'grade_type': grade_type_db,  # Use database enum object
            'academic_period': academic_period_db,  # Use database enum object
            'academic_year': grade_data.academic_year,
            'assessment_date': grade_data.assessment_date,
            'comments': grade_data.comments,
            'recorded_by': recorded_by
        }
        
        db_grade = Grade(**grade_dict)
        db.add(db_grade)
        db.commit()
        db.refresh(db_grade)
        return db_grade
    
    @staticmethod
    def create_bulk_grades(db: Session, bulk_data: BulkGradeCreate, recorded_by: int) -> List[Grade]:
        """Create multiple grades at once."""
        grades = []
        
        for grade_info in bulk_data.grades:
            grade_data = GradeCreate(
                student_id=grade_info['student_id'],
                subject_id=bulk_data.subject_id,
                grade_value=grade_info['grade_value'],
                max_grade=bulk_data.max_grade,
                grade_type=bulk_data.grade_type,
                academic_period=bulk_data.academic_period,
                academic_year=bulk_data.academic_year,
                assessment_date=bulk_data.assessment_date,
                comments=grade_info.get('comments')
            )
            
            grade = GradeService.create_grade(db, grade_data, recorded_by)
            grades.append(grade)
            
        return grades
    
    @staticmethod
    def get_grade(db: Session, grade_id: int) -> Optional[Grade]:
        """Get grade by ID."""
        return db.query(Grade).filter(Grade.id == grade_id).first()
    
    @staticmethod
    def get_student_grades(
        db: Session, 
        student_id: int,
        subject_id: Optional[int] = None,
        academic_year: Optional[str] = None,
        academic_period: Optional[str] = None
    ) -> List[Grade]:
        """Get grades for a specific student."""
        query = db.query(Grade).filter(Grade.student_id == student_id)
        
        if subject_id:
            query = query.filter(Grade.subject_id == subject_id)
        if academic_year:
            query = query.filter(Grade.academic_year == academic_year)
        if academic_period:
            query = query.filter(Grade.academic_period == academic_period)
            
        return query.order_by(Grade.assessment_date.desc()).all()
    
    @staticmethod
    def get_class_grades(
        db: Session,
        class_id: int,
        subject_id: Optional[int] = None,
        academic_period: Optional[str] = None
    ) -> List[Grade]:
        """Get grades for all students in a class."""
        query = db.query(Grade).join(Student).filter(Student.class_id == class_id)
        
        if subject_id:
            query = query.filter(Grade.subject_id == subject_id)
        if academic_period:
            query = query.filter(Grade.academic_period == academic_period)
            
        return query.order_by(Grade.assessment_date.desc()).all()
    
    @staticmethod
    def update_grade(db: Session, grade_id: int, grade_data: GradeUpdate) -> Optional[Grade]:
        """Update a grade."""
        db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not db_grade:
            return None
            
        update_data = grade_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_grade, field, value)
            
        db_grade.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_grade)
        return db_grade
    
    @staticmethod
    def delete_grade(db: Session, grade_id: int) -> bool:
        """Delete a grade."""
        db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not db_grade:
            return False
            
        db.delete(db_grade)
        db.commit()
        return True
    
    @staticmethod
    def get_grade_statistics(db: Session, student_id: int, subject_id: Optional[int] = None) -> GradeStats:
        """Get grade statistics for a student."""
        query = db.query(Grade).filter(Grade.student_id == student_id)
        
        if subject_id:
            query = query.filter(Grade.subject_id == subject_id)
            
        grades = query.all()
        
        if not grades:
            return GradeStats(
                subject_name="",
                average_grade=0,
                highest_grade=0,
                lowest_grade=0,
                total_assessments=0
            )
        
        grade_values = [g.grade_value for g in grades]
        
        return GradeStats(
            subject_name=grades[0].subject.name if grades else "",
            average_grade=sum(grade_values) / len(grade_values),
            highest_grade=max(grade_values),
            lowest_grade=min(grade_values),
            total_assessments=len(grades)
        )

class AttendanceService:
    @staticmethod
    def create_attendance(db: Session, attendance_data: AttendanceCreate, recorded_by: int) -> Attendance:
        """Create a new attendance record."""
        # Check if attendance already exists for this student/date/class
        existing = db.query(Attendance).filter(
            and_(
                Attendance.student_id == attendance_data.student_id,
                Attendance.class_id == attendance_data.class_id,
                Attendance.attendance_date == attendance_data.attendance_date
            )
        ).first()
        
        if existing:
            raise ValueError("Attendance already recorded for this student on this date")
        
        # Import database enum
        from ..database.models import AttendanceStatus
        
        attendance_dict = attendance_data.model_dump()
        attendance_dict['recorded_by'] = recorded_by
        
        # Convert Pydantic enum to database enum
        if 'status' in attendance_dict:
            status_db = None
            for db_enum in AttendanceStatus:
                if db_enum.value == attendance_dict['status'].value:
                    status_db = db_enum
                    break
            attendance_dict['status'] = status_db
        
        db_attendance = Attendance(**attendance_dict)
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    @staticmethod
    def create_bulk_attendance(db: Session, bulk_data: BulkAttendanceCreate, recorded_by: int) -> List[Attendance]:
        """Create attendance records for multiple students."""
        attendance_records = []
        
        for record in bulk_data.attendance_records:
            attendance_data = AttendanceCreate(
                student_id=record['student_id'],
                class_id=bulk_data.class_id,
                attendance_date=bulk_data.attendance_date,
                status=record['status'],
                notes=record.get('notes')
            )
            
            try:
                attendance = AttendanceService.create_attendance(db, attendance_data, recorded_by)
                attendance_records.append(attendance)
            except ValueError:
                # Skip if already exists
                continue
                
        return attendance_records
    
    @staticmethod
    def get_attendance(db: Session, attendance_id: int) -> Optional[Attendance]:
        """Get attendance by ID."""
        return db.query(Attendance).filter(Attendance.id == attendance_id).first()
    
    @staticmethod
    def get_student_attendance(
        db: Session,
        student_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        class_id: Optional[int] = None
    ) -> List[Attendance]:
        """Get attendance records for a student."""
        query = db.query(Attendance).filter(Attendance.student_id == student_id)
        
        if start_date:
            query = query.filter(Attendance.attendance_date >= start_date)
        if end_date:
            query = query.filter(Attendance.attendance_date <= end_date)
        if class_id:
            query = query.filter(Attendance.class_id == class_id)
            
        return query.order_by(Attendance.attendance_date.desc()).all()
    
    @staticmethod
    def get_class_attendance(
        db: Session,
        class_id: int,
        attendance_date: date
    ) -> List[Attendance]:
        """Get attendance for all students in a class on a specific date."""
        return db.query(Attendance).filter(
            and_(
                Attendance.class_id == class_id,
                Attendance.attendance_date == attendance_date
            )
        ).all()
    
    @staticmethod
    def update_attendance(db: Session, attendance_id: int, attendance_data: AttendanceUpdate) -> Optional[Attendance]:
        """Update an attendance record."""
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if not db_attendance:
            return None
            
        # Import database enum
        from ..database.models import AttendanceStatus
        
        update_data = attendance_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == 'status' and value is not None:
                # Convert Pydantic enum to database enum
                status_db = None
                for db_enum in AttendanceStatus:
                    if db_enum.value == value.value:
                        status_db = db_enum
                        break
                setattr(db_attendance, field, status_db)
            else:
                setattr(db_attendance, field, value)
            
        db_attendance.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    @staticmethod
    def get_attendance_statistics(
        db: Session,
        student_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> AttendanceStats:
        """Get attendance statistics for a student."""
        query = db.query(Attendance).filter(Attendance.student_id == student_id)
        
        if start_date:
            query = query.filter(Attendance.attendance_date >= start_date)
        if end_date:
            query = query.filter(Attendance.attendance_date <= end_date)
            
        records = query.all()
        
        if not records:
            return AttendanceStats(
                total_days=0,
                present_days=0,
                absent_days=0,
                late_days=0,
                excused_days=0,
                attendance_rate=0.0
            )
        
        total_days = len(records)
        present_days = len([r for r in records if r.status.value == "present"])
        absent_days = len([r for r in records if r.status.value == "absent"])
        late_days = len([r for r in records if r.status.value == "late"])
        excused_days = len([r for r in records if r.status.value == "excused"])
        
        attendance_rate = (present_days + late_days) / total_days * 100 if total_days > 0 else 0
        
        return AttendanceStats(
            total_days=total_days,
            present_days=present_days,
            absent_days=absent_days,
            late_days=late_days,
            excused_days=excused_days,
            attendance_rate=round(attendance_rate, 2)
        )
