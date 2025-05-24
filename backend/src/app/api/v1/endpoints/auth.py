from fastapi import APIRouter, Depends, Body, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

import src.utils.dependencies as deps
from src.app.crud import auth as crud
from src.app.schemas.auth import (
    Token,
    LoginRequest,
    LoginResponse,
    UserResponse
)
from src.app.schemas.user import UserCreate
from src.utils.response_models import APIResponse
from src.utils.error_handlers import APIError, ResourceAlreadyExistsError

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/token", 
    response_model=Token,
    summary="Login to get access token (OAuth2)",
    description="Authenticate with username and password to receive a JWT token (used by Swagger UI)"
)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    try:
        # Validate credentials
        is_valid, error_message = crud.validate_user_credentials(db, form_data.username, form_data.password)
        if not is_valid:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error_message,
                headers={"WWW-Authenticate": "Bearer"},
                error_code="INVALID_CREDENTIALS"
            )
        
        # Get authenticated user
        user = crud.authenticate_user(db, form_data.username, form_data.password)
        
        # Generate access token
        access_token_expires = timedelta(minutes=deps.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = deps.create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"User {user.username} (ID: {user.id}) logged in successfully")
        return {"access_token": access_token, "token_type": "bearer"}
    except APIError as e:
        raise e
    except Exception as e:
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
    db: Session = Depends(deps.get_db)
):
    """
    Login endpoint for frontend applications.
    """
    try:
        # Validate credentials
        is_valid, error_message = crud.validate_user_credentials(db, login_data.username, login_data.password)
        if not is_valid:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=error_message,
                error_code="INVALID_CREDENTIALS"
            )
        
        # Get authenticated user
        user = crud.authenticate_user(db, login_data.username, login_data.password)
        
        # Generate access token
        access_token_expires = timedelta(minutes=deps.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = deps.create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        # Update last login time
        crud.update_last_login(db, user)
        
        return APIResponse(
            success=True,
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": user
            },
            message="Login successful"
        )
    except APIError as e:
        raise e
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise APIError(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            error_code="LOGIN_ERROR"
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
    db: Session = Depends(deps.get_db)
):
    """
    Register a new user.
    """
    try:
        # Create user using CRUD operation
        db_user = crud.create_user(db, user)
        logger.info(f"New user registered: {user.username} (ID: {db_user.id}, Role: {user.role})")
        
        return APIResponse(
            success=True,
            data=db_user,
            message="User registered successfully"
        )
    except ResourceAlreadyExistsError as e:
        raise e
    except Exception as e:
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
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    Logout the current user.
    """
    try:
        # Update last logout time
        crud.update_last_logout(db, current_user)
        return APIResponse(
            success=True,
            message="Successfully logged out"
        )
    except Exception as e:
        logger.error(f"Unexpected error during logout: {str(e)}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during logout",
            error_code="LOGOUT_ERROR"
        )
