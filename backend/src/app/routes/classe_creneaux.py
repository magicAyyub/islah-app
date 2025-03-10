from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import time

from src.utils.database import get_db
from src.utils.models import Creneau
from src.utils.schemas import CreneauCreate, Creneau as CreneauSchema, CreneauUpdate

router = APIRouter(
    prefix="/api/creneaux",
    tags=["creneaux"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_creneau(db: Session, creneau_id: int):
    return db.query(Creneau).filter(Creneau.id_creneau == creneau_id).first()

def create_creneau(db: Session, creneau: CreneauCreate):
    db_creneau = Creneau(
        jour=creneau.jour,
        heure_debut=creneau.heure_debut,
        heure_fin=creneau.heure_fin
    )
    db.add(db_creneau)
    db.commit()
    db.refresh(db_creneau)
    return db_creneau

# Routes
@router.post("/", response_model=CreneauSchema, status_code=status.HTTP_201_CREATED)
def create_new_creneau(creneau: CreneauCreate, db: Session = Depends(get_db)):
    """
    Créer un nouveau créneau horaire
    """
    # Vérifier que l'heure de fin est après l'heure de début
    if creneau.heure_fin <= creneau.heure_debut:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'heure de fin doit être après l'heure de début"
        )
    
    # Vérifier si un créneau identique existe déjà
    existing_creneau = db.query(Creneau).filter(
        Creneau.jour == creneau.jour,
        Creneau.heure_debut == creneau.heure_debut,
        Creneau.heure_fin == creneau.heure_fin
    ).first()
    
    if existing_creneau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce créneau horaire existe déjà"
        )
    
    return create_creneau(db=db, creneau=creneau)

@router.get("/", response_model=List[CreneauSchema])
def read_creneaux(
    skip: int = 0, 
    limit: int = 100,
    jour: Optional[str] = Query(None, description="Filtrer par jour"),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les créneaux horaires avec possibilité de filtrage par jour
    """
    query = db.query(Creneau)
    
    if jour:
        query = query.filter(Creneau.jour == jour)
    
    creneaux = query.offset(skip).limit(limit).all()
    return creneaux

@router.get("/{creneau_id}", response_model=CreneauSchema)
def read_creneau(creneau_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un créneau horaire par son ID
    """
    db_creneau = get_creneau(db, creneau_id=creneau_id)
    if db_creneau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Créneau horaire non trouvé"
        )
    return db_creneau

@router.put("/{creneau_id}", response_model=CreneauSchema)
def update_creneau(
    creneau_id: int, 
    creneau: CreneauUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un créneau horaire
    """
    db_creneau = get_creneau(db, creneau_id=creneau_id)
    if db_creneau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Créneau horaire non trouvé"
        )
    
    # Vérifier que l'heure de fin est après l'heure de début si les deux sont fournis
    heure_debut = creneau.heure_debut if creneau.heure_debut is not None else db_creneau.heure_debut
    heure_fin = creneau.heure_fin if creneau.heure_fin is not None else db_creneau.heure_fin
    
    if heure_fin <= heure_debut:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'heure de fin doit être après l'heure de début"
        )
    
    # Update creneau fields if provided
    update_data = creneau.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_creneau, key, value)
    
    db.commit()
    db.refresh(db_creneau)
    return db_creneau

@router.delete("/{creneau_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_creneau(creneau_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un créneau horaire
    """
    db_creneau = get_creneau(db, creneau_id=creneau_id)
    if db_creneau is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Créneau horaire non trouvé"
        )
    
    # Vérifier si le créneau est utilisé dans des classes
    if db_creneau.classe_creneaux and len(db_creneau.classe_creneaux) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer ce créneau car il est utilisé dans des classes"
        )
    
    db.delete(db_creneau)
    db.commit()
    return None