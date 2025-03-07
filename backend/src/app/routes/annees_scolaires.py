from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.models import AnneeScolaire
from src.utils.schemas import AnneeScolaireCreate, AnneeScolaire as AnneeScolaireSchema, AnneeScolaireUpdate

router = APIRouter(
    prefix="/annees-scolaires",
    tags=["annees-scolaires"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_annee_scolaire(db: Session, annee_id: int):
    return db.query(AnneeScolaire).filter(AnneeScolaire.id_annee == annee_id).first()

def create_annee_scolaire(db: Session, annee_scolaire: AnneeScolaireCreate):
    db_annee_scolaire = AnneeScolaire(
        libelle=annee_scolaire.libelle,
        date_debut=annee_scolaire.date_debut,
        date_fin=annee_scolaire.date_fin,
        est_active=annee_scolaire.est_active
    )
    db.add(db_annee_scolaire)
    db.commit()
    db.refresh(db_annee_scolaire)
    return db_annee_scolaire

# Routes
@router.post("/", response_model=AnneeScolaireSchema, status_code=status.HTTP_201_CREATED)
def create_new_annee_scolaire(annee_scolaire: AnneeScolaireCreate, db: Session = Depends(get_db)):
    """
    Créer une nouvelle année scolaire
    """
    # Vérifier que la date de fin est après la date de début
    if annee_scolaire.date_fin <= annee_scolaire.date_debut:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La date de fin doit être après la date de début"
        )
    
    # Vérifier si une année scolaire avec le même libellé existe déjà
    existing_annee = db.query(AnneeScolaire).filter(AnneeScolaire.libelle == annee_scolaire.libelle).first()
    if existing_annee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Une année scolaire avec le libellé '{annee_scolaire.libelle}' existe déjà"
        )
    
    # Si la nouvelle année est active, désactiver les autres années
    if annee_scolaire.est_active:
        db.query(AnneeScolaire).filter(AnneeScolaire.est_active == True).update({"est_active": False})
    
    return create_annee_scolaire(db=db, annee_scolaire=annee_scolaire)

@router.get("/", response_model=List[AnneeScolaireSchema])
def read_annees_scolaires(
    skip: int = 0, 
    limit: int = 100,
    active_only: bool = Query(False, description="Filtrer uniquement les années actives"),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les années scolaires avec possibilité de filtrage
    """
    query = db.query(AnneeScolaire)
    
    if active_only:
        query = query.filter(AnneeScolaire.est_active == True)
    
    annees_scolaires = query.offset(skip).limit(limit).all()
    return annees_scolaires

@router.get("/active", response_model=AnneeScolaireSchema)
def read_annee_scolaire_active(db: Session = Depends(get_db)):
    """
    Récupérer l'année scolaire active
    """
    annee_scolaire = db.query(AnneeScolaire).filter(AnneeScolaire.est_active == True).first()
    if annee_scolaire is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Aucune année scolaire active trouvée"
        )
    return annee_scolaire

@router.get("/{annee_id}", response_model=AnneeScolaireSchema)
def read_annee_scolaire(annee_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une année scolaire par son ID
    """
    db_annee_scolaire = get_annee_scolaire(db, annee_id=annee_id)
    if db_annee_scolaire is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Année scolaire non trouvée"
        )
    return db_annee_scolaire

@router.put("/{annee_id}", response_model=AnneeScolaireSchema)
def update_annee_scolaire(
    annee_id: int, 
    annee_scolaire: AnneeScolaireUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une année scolaire
    """
    db_annee_scolaire = get_annee_scolaire(db, annee_id=annee_id)
    if db_annee_scolaire is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Année scolaire non trouvée"
        )
    
    # Vérifier que la date de fin est après la date de début si les deux sont fournis
    date_debut = annee_scolaire.date_debut if annee_scolaire.date_debut is not None else db_annee_scolaire.date_debut
    date_fin = annee_scolaire.date_fin if annee_scolaire.date_fin is not None else db_annee_scolaire.date_fin
    
    if date_fin <= date_debut:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La date de fin doit être après la date de début"
        )
    
    # Vérifier si le nouveau libellé existe déjà
    if annee_scolaire.libelle and annee_scolaire.libelle != db_annee_scolaire.libelle:
        existing_annee = db.query(AnneeScolaire).filter(AnneeScolaire.libelle == annee_scolaire.libelle).first()
        if existing_annee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Une année scolaire avec le libellé '{annee_scolaire.libelle}' existe déjà"
            )
    
    # Si l'année devient active, désactiver les autres années
    if annee_scolaire.est_active is not None and annee_scolaire.est_active and not db_annee_scolaire.est_active:
        db.query(AnneeScolaire).filter(AnneeScolaire.est_active == True).update({"est_active": False})
    
    # Update annee_scolaire fields if provided
    update_data = annee_scolaire.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_annee_scolaire, key, value)
    
    db.commit()
    db.refresh(db_annee_scolaire)
    return db_annee_scolaire

@router.delete("/{annee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annee_scolaire(annee_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une année scolaire
    """
    db_annee_scolaire = get_annee_scolaire(db, annee_id=annee_id)
    if db_annee_scolaire is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Année scolaire non trouvée"
        )
    
    # Vérifier si l'année scolaire a des inscriptions associées
    if db_annee_scolaire.inscriptions and len(db_annee_scolaire.inscriptions) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer cette année scolaire car elle a des inscriptions associées"
        )
    
    db.delete(db_annee_scolaire)
    db.commit()
    return None