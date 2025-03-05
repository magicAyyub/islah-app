"""
This module contains the FastAPI application and its configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import inspect
from src.utils.database import engine, test_database_connection
import src.utils.models as models
from src.app.routes import students, classes, payments, notifications, enrollments, guardians
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
        models.Student, 
        models.Guardian, 
        models.Class, 
        models.Enrollment, 
        models.Payment, 
        models.Notification
    ]
    
    for model_class in model_classes:
        # Check if table already exists
        if not inspector.has_table(model_class.__tablename__):
            # Create only if table doesn't exist
            model_class.__table__.create(engine)

# Create tables only if they don't exist
create_tables_if_not_exist()

# Test database connection
test_database_connection()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include all routes
app.include_router(students.router)
app.include_router(guardians.router)
app.include_router(classes.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(enrollments.router)

# Root endpoint to verify API connection
@app.get("/")
async def root() -> RedirectResponse:
    """Redirect to /docs"""
    return RedirectResponse(url="/docs")