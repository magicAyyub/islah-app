# src/routes/auth.py

from fastapi import APIRouter, Depends, status, Body, Request, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import bcrypt
from datetime import timedelta, datetime
import logging
from pydantic import BaseModel

from src.utils.database import get_db
from src.utils.dependencies import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from src.models import User
from src.schemas import Token, UserCreate, UserResponse
from src.utils.error_handlers import APIError, ResourceAlreadyExistsError, DatabaseError
from src.utils.response_models import APIResponse

# Configure logging
logger = logging.getLogger(__name__)

# Define login request model for frontend
class LoginRequest(BaseModel):
    username: str
    password: str

# Define login response model for frontend
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={
        401: {"description": "Unauthorized"},
        400: {"description": "Bad request"},
        500: {"description": "Internal server error"}
    },
)

@router.post(
    "/token", 
    response_model=Token,
    summary="Login to get access token (OAuth2)",
    description="Authenticate with username and password to receive a JWT token (used by Swagger UI)"
)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        # Find user by username
        user = db.query(User).filter(User.username == form_data.username).first()
        
        # Check if user exists and password is correct
        if not user or not bcrypt.checkpw(form_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
                error_code="INVALID_CREDENTIALS"
            )
        
        # Generate access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        # Log successful login
        logger.info(f"User {user.username} (ID: {user.id}) logged in successfully")
        
        # Return token in the exact format expected by OAuth2
        return {"access_token": access_token, "token_type": "bearer"}
    except APIError as e:
        # Re-raise API errors
        raise e
    except SQLAlchemyError as e:
        # Handle database errors
        raise DatabaseError(detail="Database error during authentication", original_error=e)
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error during authentication: {str(e)}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during authentication",
            error_code="AUTHENTICATION_ERROR"
        )

@router.post(
    "/login", 
    response_model=APIResponse[LoginResponse],
    summary="Login for frontend applications",
    description="Authenticate with username and password to receive a JWT token and user information"
)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        # Find user by username
        user = db.query(User).filter(User.username == login_data.username).first()
        
        # Check if user exists and password is correct
        if not user or not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                error_code="INVALID_CREDENTIALS"
            )
        
        # Check if user is active
        if not user.is_active:
            raise APIError(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
                error_code="INACTIVE_USER"
            )
        
        # Generate access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        # Update last login time
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create user response data
        user_data = {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at if hasattr(user, 'created_at') else None
        }
        
        return APIResponse(
            success=True,
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": user_data
            },
            message="Login successful"
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
        )

@router.post(
    "/register", 
    response_model=APIResponse[UserResponse], 
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with the provided details"
)
async def register_user(
    user: UserCreate = Body(..., description="User registration details"),
    db: Session = Depends(get_db)
):
    try:
        # Check if username already exists
        db_user = db.query(User).filter(User.username == user.username).first()
        if db_user:
            raise ResourceAlreadyExistsError("User", "username", user.username)
        
        # Hash password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        db_user = User(
            username=user.username,
            password_hash=hashed_password,
            full_name=user.full_name,
            role=user.role
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Log user creation
        logger.info(f"New user registered: {user.username} (ID: {db_user.id}, Role: {user.role})")
        
        return APIResponse(
            success=True,
            data=db_user,
            message="User registered successfully"
        )
    except ResourceAlreadyExistsError as e:
        # Re-raise resource already exists error
        raise e
    except SQLAlchemyError as e:
        # Handle database errors
        db.rollback()
        raise DatabaseError(detail="Database error during user registration", original_error=e)
    except Exception as e:
        # Handle unexpected errors
        db.rollback()
        logger.error(f"Unexpected error during user registration: {str(e)}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during user registration",
            error_code="REGISTRATION_ERROR"
        )

@router.post(
    "/logout",
    response_model=APIResponse,
    summary="Logout user",
    description="Invalidate the current user's token"
)
async def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Update last logout time
        current_user.last_login = None
        db.commit()
        
        return APIResponse(
            success=True,
            message="Successfully logged out"
        )
    except SQLAlchemyError as e:
        raise DatabaseError(detail="Database error during logout", original_error=e)
    except Exception as e:
        logger.error(f"Unexpected error during logout: {str(e)}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during logout",
            error_code="LOGOUT_ERROR"
        )
