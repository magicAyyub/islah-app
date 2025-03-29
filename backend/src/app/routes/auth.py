# src/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import bcrypt

from src.utils.database import get_db
from src.utils.dependencies import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from src.models import User
from src.schemas import Token, UserCreate, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={401: {"description": "Unauthorized"}},
)

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not bcrypt.checkpw(form_data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create new user
    db_user = User(
        email=user.email,
        password=hashed_password,
        last_name=user.last_name,
        first_name=user.first_name,
        phone=user.phone,
        role=user.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user