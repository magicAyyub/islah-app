from .auth import router as auth_router
from .users import router as users_router
from .students import router as students_router
from .parents import router as parents_router
from .teachers import router as teachers_router
from .classrooms import router as classrooms_router
from .levels import router as levels_router
from .subjects import router as subjects_router
from .grades import router as grades_router
from .payments import router as payments_router
from .attendances import router as attendances_router
from .notifications import router as notifications_router

__all__ = [
    "auth_router",
    "users_router",
    "students_router",
    "parents_router",
    "teachers_router",
    "classrooms_router",
    "levels_router",
    "subjects_router",
    "grades_router",
    "payments_router",
    "attendances_router",
    "notifications_router",
]
