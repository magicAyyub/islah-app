from pydantic import BaseModel
from typing import Optional

class LevelBase(BaseModel):
    name: str

class LevelCreate(LevelBase):
    pass

class LevelUpdate(BaseModel):
    name: Optional[str] = None

class LevelResponse(LevelBase):
    id: int

    class Config:
        from_attributes = True