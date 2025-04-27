"""
This module contains the FastAPI application and its configuration.
"""

# Import necessary modules
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
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
from src.utils.error_handlers import APIError, ValidationError
from src.utils.response_models import APIResponse, ErrorDetail
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("islah_school")

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
                    "tokenUrl": "/api/auth/token",
                    "scopes": {}
                }
            }
        }
    }
    
    # Apply security to all operations except /auth/token
    for path_url, path_item in openapi_schema["paths"].items():
        if path_url != "/api/auth/token":  # Skip the token endpoint
            for operation in path_item.values():
                operation["security"] = [{"OAuth2PasswordBearer": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Configure CORS - Update this section
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                error_code=exc.error_code,
                detail=exc.detail,
                error_details=exc.error_details
            )
        ).dict()
    )

@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                error_code="VALIDATION_ERROR",
                detail="Validation error",
                error_details={"errors": exc.error_details.get("errors", [])}
            )
        ).dict()
    )

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        error_info = {
            "loc": error["loc"],
            "msg": error["msg"],
            "type": error["type"]
        }
        errors.append(error_info)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=APIResponse(
            success=False,
            error=ErrorDetail(
                error_code="VALIDATION_ERROR",
                detail="Request validation error",
                error_details={"errors": errors}
            )
        ).dict()
    )

# Include routers
app.include_router(auth.router, prefix="/api")
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
    return APIResponse(
        success=True,
        message="Welcome to Islah School API",
        data={
            "docs": "/docs",
            "redoc": "/redoc",
            "version": "1.0.0"
        }
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}