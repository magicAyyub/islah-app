from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.settings import ORIGINS, custom_openapi
from src.app.routes.auth import router as auth_router
from src.app.routes.users import router as users_router
from src.app.routes.students import router as students_router
from src.app.routes.parents import router as parents_router
from src.app.routes.teachers import router as teachers_router
from src.app.routes.classrooms import router as classrooms_router
from src.app.routes.levels import router as levels_router
from src.app.routes.subjects import router as subjects_router
from src.app.routes.grades import router as grades_router
from src.app.routes.payments import router as payments_router
from src.app.routes.attendances import router as attendances_router
from src.app.routes.notifications import router as notifications_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="Islah School API",
        description="API pour la gestion de l'école de la mosquée Islah",
        version="1.0.0"
    )

    # Add startup event to verify database connection
    @app.on_event("startup")
    async def startup_event():
        from src.utils.database import engine
        from src.models import Base
        try:
            # Create tables if they don't exist
            Base.metadata.create_all(bind=engine)
        except Exception as e:
            print(f"Error creating database tables: {e}")

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers with proper prefixes
    app.include_router(auth_router, prefix="/api")
    app.include_router(users_router, prefix="/api")
    app.include_router(students_router, prefix="/api")
    app.include_router(parents_router, prefix="/api")
    app.include_router(teachers_router, prefix="/api")
    app.include_router(classrooms_router, prefix="/api")
    app.include_router(levels_router, prefix="/api")
    app.include_router(subjects_router, prefix="/api")
    app.include_router(grades_router, prefix="/api")
    app.include_router(payments_router, prefix="/api")
    app.include_router(attendances_router, prefix="/api")
    app.include_router(notifications_router, prefix="/api")

    # Add a health check endpoint
    @app.get("/api/health")
    async def health_check():
        return {"status": "ok", "message": "Server is running"}

    # Set custom OpenAPI schema
    app.openapi = lambda: custom_openapi(app)

    return app
