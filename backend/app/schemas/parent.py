from pydantic import BaseModel, ConfigDict
from typing import Optional

class ParentCreate(BaseModel):
    first_name: str
    last_name: str
    address: Optional[str] = None
    locality: Optional[str] = None
    phone: str
    mobile: Optional[str] = None
    email: Optional[str] = None
    # Frontend compatibility field
    emergency_contact: Optional[str] = None

class ParentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None
    locality: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    emergency_contact: Optional[str] = None

# For API responses - simplified to match frontend expectations
class Parent(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
