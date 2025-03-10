from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.models import Niveau
from src.utils.schemas import NiveauCreate, Niveau as NiveauSchema, NiveauUpdate

router = APIRouter(
    prefix="/api/niveaux",
    tags=["niveaux"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_niveau(db: Session, niveau_id: int):
    return db.query(Niveau).filter(Niveau.id_niveau == niveau_id).first()

def create_niveau(db: Session, niveau: NiveauCreate):
    db_niveau = Niveau(
        nom=niveau.nom,
        description=niveau.description
    )
    db.add(db_niveau)
    db.commit()
    db.refresh(db_niveau)
    return db_niveau

# Routes
@router.post("/", response_model=NiveauSchema, status_code=status.HTTP_201_CREATED)
def create_new_niveau(niveau: NiveauCreate, db: Session = Depends(get_db)):
    """
    Créer un nouveau niveau
    """
    # Vérifier si un niveau avec le même nom existe déjà
    existing_niveau = db.query(Niveau).filter(Niveau.nom == niveau.nom).first()
    if existing_niveau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un niveau avec le nom '{niveau.nom}' existe déjà"
        )
    
    return create_niveau(db=db, niveau=niveau)

@router.get("/", response_model=List[NiveauSchema])
def read_niveaux(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les niveaux
    """
    niveaux = db.query(Niveau).offset(skip).limit(limit).all()
    return niveaux

@router.get("/{niveau_id}", response_model=NiveauSchema)
def read_niveau(niveau_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un niveau par son ID
    """
    db_niveau = get_niveau(db, niveau_id=niveau_id)
    if db_niveau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Niveau non trouvé"
        )
    return db_niveau

@router.put("/{niveau_id}", response_model=NiveauSchema)
def update_niveau(
    niveau_id: int, 
    niveau: NiveauUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un niveau
    """
    db_niveau = get_niveau(db, niveau_id=niveau_id)
    if db_niveau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Niveau non trouvé"
        )
    
    # Vérifier si le nouveau nom existe déjà
    if niveau.nom and niveau.nom != db_niveau.nom:
        existing_niveau = db.query(Niveau).filter(Niveau.nom == niveau.nom).first()
        if existing_niveau:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Un niveau avec le nom '{niveau.nom}' existe déjà"
            )
    
    # Update niveau fields if provided
    update_data = niveau.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_niveau, key, value)
    
    db.commit()
    db.refresh(db_niveau)
    return db_niveau

@router.delete("/{niveau_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_niveau(niveau_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un niveau
    """
    db_niveau = get_niveau(db, niveau_id=niveau_id)
    if db_niveau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Niveau non trouvé"
        )
    
    # Vérifier si le niveau a des classes associées
    if db_niveau.classes and len(db_niveau.classes) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer ce niveau car il a des classes associées"
        )
    
    db.delete(db_niveau)
    db.commit()
    return None