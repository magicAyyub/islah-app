from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from src.utils.database import get_db
from src.utils.models import User
from src.utils.schemas import UserCreate, User as UserSchema, UserUpdate
from src.utils.auth import get_password_hash, get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id_user == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        nom=user.nom,
        prenom=user.prenom,
        role=user.role,
        est_actif=user.est_actif
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Routes
@router.post("/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_new_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """
    Créer un nouvel utilisateur (admin uniquement)
    """
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur est déjà utilisé"
        )
    
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    
    return create_user(db=db, user=user)

@router.get("/", response_model=List[UserSchema])
def read_users(
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = Query(None, description="Rechercher par nom, prénom ou username"),
    role: Optional[str] = Query(None, description="Filtrer par rôle"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Récupérer tous les utilisateurs (admin uniquement)
    """
    query = db.query(User)
    
    if search:
        query = query.filter(
            or_(
                User.nom.ilike(f"%{search}%"),
                User.prenom.ilike(f"%{search}%"),
                User.username.ilike(f"%{search}%")
            )
        )
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: User = Depends(get_current_active_user)):
    """
    Récupérer les informations de l'utilisateur connecté
    """
    return current_user

@router.get("/{user_id}", response_model=UserSchema)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """
    Récupérer un utilisateur par son ID (admin uniquement)
    """
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Utilisateur non trouvé"
        )
    return db_user

@router.put("/me", response_model=UserSchema)
def update_user_me(
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Mettre à jour les informations de l'utilisateur connecté
    """
    # Vérifier si le nouveau nom d'utilisateur existe déjà
    if user.username and user.username != current_user.username:
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce nom d'utilisateur est déjà utilisé"
            )
    
    # Vérifier si le nouvel email existe déjà
    if user.email and user.email != current_user.email:
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email est déjà utilisé"
            )
    
    # Mettre à jour le mot de passe si fourni
    if user.password:
        user.password = get_password_hash(user.password)
    
    # Update user fields if provided
    update_data = user.dict(exclude_unset=True)
    
    # Ne pas permettre la mise à jour du rôle ou du statut actif par l'utilisateur lui-même
    if "role" in update_data:
        del update_data["role"]
    if "est_actif" in update_data:
        del update_data["est_actif"]
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int, 
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Mettre à jour un utilisateur (admin uniquement)
    """
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Utilisateur non trouvé"
        )
    
    # Vérifier si le nouveau nom d'utilisateur existe déjà
    if user.username and user.username != db_user.username:
        existing_user = get_user_by_username(db, username=user.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce nom d'utilisateur est déjà utilisé"
            )
    
    # Vérifier si le nouvel email existe déjà
    if user.email and user.email != db_user.email:
        existing_user = get_user_by_email(db, email=user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email est déjà utilisé"
            )
    
    # Mettre à jour le mot de passe si fourni
    if user.password:
        user.password = get_password_hash(user.password)
    
    # Update user fields if provided
    update_data = user.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """
    Supprimer un utilisateur (admin uniquement)
    """
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Utilisateur non trouvé"
        )
    
    # Empêcher la suppression de son propre compte
    if db_user.id_user == current_user.id_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )
    
    db.delete(db_user)
    db.commit()
    return None