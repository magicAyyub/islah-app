"""
Entry point to setup FastAPI app.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.response_models import APIResponse
from src.utils.settings import ORIGINS
from src.utils.dependencies import custom_openapi
import src.utils.settings as settings
from src.app.api.v1.api import api_router
from src.utils.database import create_tables_if_not_exist
from src.app.models import (
    user, student, teacher, parent, subject,
    grade, classroom, level, payment, notification,
    attendance, dashboard
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(settings.PROJECT_NAME)  

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    # Create FastAPI app
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=f"{settings.API_VERSION}.0.0",
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API router
    app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")

    # Custom OpenAPI schema
    app.openapi = lambda: custom_openapi(app)

    # Create database tables
    create_tables_if_not_exist([
        user.User,
        student.Student,
        teacher.Teacher,
        parent.Parent,
        subject.Subject,
        grade.Grade,
        classroom.Classroom,
        level.Level,
        payment.Payment,
        notification.Notification,
        attendance.Attendance,
        dashboard.DashboardStat,
        dashboard.DashboardQuickAction,
        dashboard.RolePermission
    ])

    # Root endpoints
    @app.get("/")
    async def root():
        return APIResponse(
            success=True,
            message="Welcome to Islah School API",
            data={
                "docs": f"{settings.API_VERSION}/docs",
                "redoc": f"{settings.API_VERSION}/redoc",
                "version": f"{settings.API_VERSION}.0.0" 
            }
        )

    @app.get("/api/health")
    async def health_check():
        return {"status": "ok", "message": "Server is running"}

    return app

# Create the application instance
app = create_app()