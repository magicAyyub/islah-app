"""
This module contains the FastAPI application and its configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from utils.database import engine
import utils.models as models
from app.routes import students, classes, payments, notifications, enrollments, guardians
from utils.settings import ORIGINS


# models.Base.metadata.create_all(bind=engine) 

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
app.include_router(enrollments.router)


# Root endpoint to verify API connection
@app.get("/")
async def root() -> RedirectResponse:
    """Redirect to /docs"""
    return RedirectResponse(url="/docs")
