from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import students, payments, registrations, classes, parents, auth, academic, stats, quick_search

app = FastAPI(
    title="Islah School Management System",
    description="A comprehensive school management system for student registration, payments, and class management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router, prefix="/students", tags=["students"])
app.include_router(parents.router, prefix="/parents", tags=["parents"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(registrations.router, prefix="/registrations", tags=["registrations"])
app.include_router(classes.router, prefix="/classes", tags=["classes"])
app.include_router(academic.router, prefix="/academic", tags=["academic"])
app.include_router(stats.router, prefix="/stats", tags=["statistics"])
app.include_router(quick_search.router, prefix="/quick-search", tags=["quick-search"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
