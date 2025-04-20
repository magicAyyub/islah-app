"""
This module contains the FastAPI application and its configuration.
"""

# Import necessary modules
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from sqlalchemy import inspect
from src.utils.database import engine
import src.models as models
from src.app.routes import (
    users, 
    students, 
    parents, 
    teachers, 
    classrooms, 
    levels, 
    subjects, 
    grades, 
    payments, 
    attendances, 
    notifications, 
    auth
)

from src.utils.settings import ORIGINS


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
        models.Parent, 
        models.Level,
        models.Teacher,
        models.Classroom,
        models.Student,                
        models.Subject,
        models.Grade,
        models.Payment,
        models.Attendance,
        models.Notification,
    ]
    
    for model_class in model_classes:
        # Check if table already exists
        if not inspector.has_table(model_class.__tablename__):
            # Create only if table doesn't exist
            model_class.__table__.create(engine)
        

# Create tables only if they don't exist
create_tables_if_not_exist()

app = FastAPI(
    title="Islah School API",
    description="API pour la gestion de l'école de la mosquée Islah",
    version="1.0.0",
    openapi_tags=[
        {"name": "Authentication", "description": "Operations related to authentication"},
        {"name": "Users", "description": "Operations related to users"},
        # Add other tags as needed
    ],
    swagger_ui_parameters={"persistAuthorization": True}
)

# Custom OpenAPI schema to properly configure OAuth2 password flow
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Islah School API",
        version="1.0.0",
        description="API pour la gestion de l'école de la mosquée Islah",
        routes=app.routes,
    )
    
    # Configure OAuth2 password flow
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/token",
                    "scopes": {}
                }
            }
        }
    }
    
    # Apply security to all operations except /token
    for path_url, path_item in openapi_schema["paths"].items():
        if path_url != "/token":  # Skip the token endpoint
            for operation in path_item.values():
                operation["security"] = [{"OAuth2PasswordBearer": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(students.router)
app.include_router(parents.router)
app.include_router(teachers.router)
app.include_router(classrooms.router)
app.include_router(levels.router)
app.include_router(subjects.router)
app.include_router(grades.router)
app.include_router(payments.router)
app.include_router(attendances.router)
app.include_router(notifications.router)

# Root endpoint to verify API connection
@app.get("/")
async def root():
    return {
        "message": "Welcome to Islah School API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
