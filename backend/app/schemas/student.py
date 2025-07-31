from pydantic import BaseModel, ConfigDict
from datetime import date

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    place_of_birth: str
    gender: str
    parent_id: int
    class_id: int

class Student(StudentCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
