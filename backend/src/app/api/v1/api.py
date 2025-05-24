from fastapi import APIRouter

from src.app.api.v1.endpoints import (
    auth, user, dashboard, classroom, attendance, grade, level, notification, parent, payment, student, subject, teacher
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"]) 
api_router.include_router(classroom.router, prefix="/classroom", tags=["classroom"]) 
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"]) 
api_router.include_router(grade.router, prefix="/grade", tags=["grade"]) 
api_router.include_router(level.router, prefix="/level", tags=["level"]) 
api_router.include_router(notification.router, prefix="/notification", tags=["notification"]) 
api_router.include_router(parent.router, prefix="/parent", tags=["parent"]) 
api_router.include_router(payment.router, prefix="/payment", tags=["payment"]) 
api_router.include_router(student.router, prefix="/student", tags=["student"]) 
api_router.include_router(subject.router, prefix="/subject", tags=["subject"]) 
api_router.include_router(teacher.router, prefix="/teacher", tags=["teacher"]) 