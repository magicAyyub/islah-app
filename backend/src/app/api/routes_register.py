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

def register_routes(app):
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