"""
This module contains the FastAPI application and its configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from src.utils.database import engine, get_db
import src.models as models
from src.app.routes import  (
    auth, users, students, parents, teachers, classes, enrollments,
    attendance, payments, invoices, report_cards, schedules,
    notifications, messages, access_requests, configurations
)

from src.utils.settings import ORIGINS

# Import des routers
auth_router = auth.router
users_router = users.router
students_router = students.router
parents_router = parents.router
teachers_router = teachers.router
classes_router = classes.router
enrollments_router = enrollments.router
attendance_router = attendance.router
payments_router = payments.router
invoices_router = invoices.router
report_cards_router = report_cards.router
schedules_router = schedules.router
notifications_router = notifications.router
messages_router = messages.router
access_requests_router = access_requests.router
configurations_router = configurations.router


def create_tables_if_not_exist():
    """
    Create database tables only if they do not already exist.
    
    This method checks each table in the models before creating it,
    preventing errors from attempting to recreate existing tables.
    """
    inspector = inspect(engine)
    
    # List of all model classes
    model_classes = [
        models.User, 
        models.Student,      
        models.Parent,       
        models.ParentStudent,
        models.Teacher,
        models.Class,
        models.TeacherClassAssignment,
        models.Enrollment,
        models.Attendance,
        models.AbsenceJustification,
        models.Payment,
        models.Invoice,
        models.InvoiceItem,
        models.ReportCard,
        models.Evaluation,
        models.Schedule,
        models.Notification,
        models.Conversation,  # Add the new Conversation model
        models.Message,
        models.MessageRecipient,
        models.AccessRequest,
        models.Configuration
    ]
    
    for model_class in model_classes:
        # Check if table already exists
        if not inspector.has_table(model_class.__tablename__):
            # Create only if table doesn't exist
            model_class.__table__.create(engine)
        

# Create tables only if they don't exist
create_tables_if_not_exist()

# Add OpenAPI security configuration
security_schemes = {
    "Bearer": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }
}

app = FastAPI(
    title="Islah School API",
    description="API pour la gestion de l'école de la mosquée Islah",
    version="1.0.0",
    openapi_tags=[
        {"name": "Authentication", "description": "Operations related to authentication"},
        {"name": "Users", "description": "Operations related to users"},
        # Add other tags as needed
    ],
    # Add security schemes to OpenAPI documentation
    swagger_ui_parameters={"persistAuthorization": True}
)

# Configure security for OpenAPI documentation
app.swagger_ui_init_oauth = {
    "usePkceWithAuthorizationCodeGrant": True,
    "clientId": "",
    "clientSecret": "",
    "scopes": ["read:api"],
}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include all routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(students_router)
app.include_router(parents_router)
app.include_router(teachers_router)
app.include_router(classes_router)
app.include_router(enrollments_router)
app.include_router(attendance_router)
app.include_router(payments_router)
app.include_router(invoices_router)
app.include_router(report_cards_router)
app.include_router(schedules_router)
app.include_router(notifications_router)
app.include_router(messages_router)
app.include_router(access_requests_router)
app.include_router(configurations_router)

# Root endpoint to verify API connection
@app.get("/")
async def root() -> dict:
    return {"message": "Welcome to the Islah School Management API!"}