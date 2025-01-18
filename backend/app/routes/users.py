from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.database import get_db
from utils import schemas, models
from typing import List, Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/", response_model=schemas.UserResponse)
def create_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    user_dict = user_data.dict()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    
    db_user = models.User(**user_dict)
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_user

@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.User)
    
    if role:
        query = query.filter(models.User.role == role)
    if search:
        query = query.filter(
            (models.User.first_name.ilike(f"%{search}%")) |
            (models.User.last_name.ilike(f"%{search}%")) |
            (models.User.email.ilike(f"%{search}%"))
        )
    
    return query.offset(skip).limit(limit).all()

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check email uniqueness if email is being updated
    if user_data.email and user_data.email != db_user.email:
        existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        db.delete(db_user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "User deleted successfully"}