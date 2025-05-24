from sqlalchemy import Column, Integer, Date, Enum, ForeignKey, func
from sqlalchemy.orm import relationship as orm_relationship
from src.utils.enums import AttendanceStatus
from src.utils.database import Base

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(Date, nullable=False, default=func.current_date())
    status = Column(Enum(AttendanceStatus), nullable=False, default=AttendanceStatus.PRESENT)

    # Relationships
    student = orm_relationship("Student", back_populates="attendances")