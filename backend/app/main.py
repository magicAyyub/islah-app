from fastapi import FastAPI
from app.api.endpoints import students, payments

app = FastAPI()

app.include_router(students.router, prefix="/students", tags=["students"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
