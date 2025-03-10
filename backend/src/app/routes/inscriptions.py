from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.models import Inscription, Eleve, ClasseCreneau, AnneeScolaire
from src.utils.schemas import InscriptionCreate, Inscription as InscriptionSchema, InscriptionUpdate

router = APIRouter(
    prefix="/api/inscriptions",
    tags=["inscriptions"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_inscription(db: Session, inscription_id: int):
    return db.query(Inscription).filter(Inscription.id_inscription == inscription_id).first()

def create_inscription(db: Session, inscription: InscriptionCreate):
    # Vérifier la disponibilité des places
    classe_creneau = db.query(ClasseCreneau).filter(
        ClasseCreneau.id_classe_creneau == inscription.id_classe_creneau
    ).first()
    
    if not classe_creneau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le créneau de classe spécifié n'existe pas"
        )
    
    if classe_creneau.places_disponibles <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Il n'y a plus de places disponibles dans cette classe pour ce créneau"
        )
    
    # Créer l'inscription
    db_inscription = Inscription(
        id_eleve=inscription.id_eleve,
        id_classe_creneau=inscription.id_classe_creneau,
        id_annee_scolaire=inscription.id_annee_scolaire,
        date_inscription=inscription.date_inscription,
        statut=inscription.statut
    )
    
    # Mettre à jour le nombre de places disponibles
    classe_creneau.places_disponibles -= 1
    
    db.add(db_inscription)
    db.commit()
    db.refresh(db_inscription)
    return db_inscription

# Routes
@router.post("/", response_model=InscriptionSchema, status_code=status.HTTP_201_CREATED)
def create_new_inscription(inscription: InscriptionCreate, db: Session = Depends(get_db)):
    """
    Créer une nouvelle inscription
    """
    # Vérifier que l'élève existe
    eleve = db.query(Eleve).filter(Eleve.id_eleve == inscription.id_eleve).first()
    if not eleve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'élève spécifié n'existe pas"
        )
    
    # Vérifier que l'année scolaire existe
    annee_scolaire = db.query(AnneeScolaire).filter(
        AnneeScolaire.id_annee == inscription.id_annee_scolaire
    ).first()
    if not annee_scolaire:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'année scolaire spécifiée n'existe pas"
        )
    
    # Vérifier si l'élève est déjà inscrit pour cette année scolaire
    inscription_existante = db.query(Inscription).filter(
        Inscription.id_eleve == inscription.id_eleve,
        Inscription.id_annee_scolaire == inscription.id_annee_scolaire
    ).first()
    
    if inscription_existante:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet élève est déjà inscrit pour cette année scolaire"
        )
    
    return create_inscription(db=db, inscription=inscription)

@router.get("/", response_model=List[InscriptionSchema])
def read_inscriptions(
    skip: int = 0, 
    limit: int = 100,
    annee_scolaire_id: Optional[int] = Query(None, description="Filtrer par année scolaire"),
    statut: Optional[str] = Query(None, description="Filtrer par statut"),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les inscriptions avec possibilité de filtrage
    """
    query = db.query(Inscription)
    
    if annee_scolaire_id:
        query = query.filter(Inscription.id_annee_scolaire == annee_scolaire_id)
    
    if statut:
        query = query.filter(Inscription.statut == statut)
    
    inscriptions = query.offset(skip).limit(limit).all()
    return inscriptions

@router.get("/{inscription_id}", response_model=InscriptionSchema)
def read_inscription(inscription_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une inscription par son ID
    """
    db_inscription = get_inscription(db, inscription_id=inscription_id)
    if db_inscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Inscription non trouvée"
        )
    return db_inscription

@router.get("/eleve/{eleve_id}", response_model=List[InscriptionSchema])
def read_inscriptions_by_eleve(
    eleve_id: int, 
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les inscriptions d'un élève
    """
    inscriptions = db.query(Inscription).filter(
        Inscription.id_eleve == eleve_id
    ).all()
    
    return inscriptions

@router.put("/{inscription_id}", response_model=InscriptionSchema)
def update_inscription(
    inscription_id: int, 
    inscription: InscriptionUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une inscription
    """
    db_inscription = get_inscription(db, inscription_id=inscription_id)
    if db_inscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Inscription non trouvée"
        )
    
    # Si on change de classe_creneau, il faut gérer les places disponibles
    if inscription.id_classe_creneau is not None and inscription.id_classe_creneau != db_inscription.id_classe_creneau:
        # Libérer une place dans l'ancien créneau
        ancien_creneau = db.query(ClasseCreneau).filter(
            ClasseCreneau.id_classe_creneau == db_inscription.id_classe_creneau
        ).first()
        
        if ancien_creneau:
            ancien_creneau.places_disponibles += 1
        
        # Vérifier la disponibilité dans le nouveau créneau
        nouveau_creneau = db.query(ClasseCreneau).filter(
            ClasseCreneau.id_classe_creneau == inscription.id_classe_creneau
        ).first()
        
        if not nouveau_creneau:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le nouveau créneau de classe spécifié n'existe pas"
            )
        
        if nouveau_creneau.places_disponibles <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Il n'y a plus de places disponibles dans cette classe pour ce créneau"
            )
        
        # Réserver une place dans le nouveau créneau
        nouveau_creneau.places_disponibles -= 1
    
    # Update inscription fields if provided
    update_data = inscription.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_inscription, key, value)
    
    db.commit()
    db.refresh(db_inscription)
    return db_inscription

@router.delete("/{inscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inscription(inscription_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une inscription
    """
    db_inscription = get_inscription(db, inscription_id=inscription_id)
    if db_inscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Inscription non trouvée"
        )
    
    # Libérer une place dans le créneau
    classe_creneau = db.query(ClasseCreneau).filter(
        ClasseCreneau.id_classe_creneau == db_inscription.id_classe_creneau
    ).first()
    
    if classe_creneau:
        classe_creneau.places_disponibles += 1
    
    db.delete(db_inscription)
    db.commit()
    return None