import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from src.utils.database import get_db
from src.utils.models import User
from src.utils.auth import get_password_hash
from datetime import datetime

router = APIRouter(
    prefix="/init",
    tags=["initialization"],
)

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str
    nom: str
    prenom: str
    init_key: str  # Clé de sécurité pour éviter les abus

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def initialize_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    """
    Initialise un utilisateur administrateur (à utiliser uniquement lors de la première configuration)
    """
    ADMIN_INIT_KEY = os.getenv("ADMIN_INIT_KEY")
    if not ADMIN_INIT_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clé d'initialisation non définie"
        )
    # Vérifier la clé d'initialisation (à définir dans les variables d'environnement)
    if admin_data.init_key != ADMIN_INIT_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clé d'initialisation invalide"
        )
    
    # Vérifier si un administrateur existe déjà
    admin_exists = db.query(User).filter(User.role == "admin").first()
    if admin_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un administrateur existe déjà dans le système"
        )
    
    # Créer l'utilisateur administrateur
    hashed_password = get_password_hash(admin_data.password)
    admin_user = User(
        username=admin_data.username,
        email=admin_data.email,
        password=hashed_password,
        nom=admin_data.nom,
        prenom=admin_data.prenom,
        role="admin",
        est_actif=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    db.add(admin_user)
    db.commit()
    
    return {"message": "Administrateur initialisé avec succès"}