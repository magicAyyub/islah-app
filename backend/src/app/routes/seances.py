from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.models import Seance, Cours
from src.utils.schemas import SeanceCreate, Seance as SeanceSchema, SeanceUpdate

router = APIRouter(
    prefix="/api/seances",
    tags=["seances"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_seance(db: Session, seance_id: int):
    return db.query(Seance).filter(Seance.id_seance == seance_id).first()

def create_seance(db: Session, seance: SeanceCreate):
    db_seance = Seance(
        id_cours=seance.id_cours,
        date_seance=seance.date_seance,
        contenu=seance.contenu,
        commentaire=seance.commentaire,
        est_annulee=seance.est_annulee,
        motif_annulation=seance.motif_annulation
    )
    db.add(db_seance)
    db.commit()
    db.refresh(db_seance)
    return db_seance

# Routes
@router.post("/", response_model=SeanceSchema, status_code=status.HTTP_201_CREATED)
def create_new_seance(seance: SeanceCreate, db: Session = Depends(get_db)):
    """
    Créer une nouvelle séance
    """
    # Vérifier que le cours existe
    cours = db.query(Cours).filter(Cours.id_cours == seance.id_cours).first()
    if not cours:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le cours spécifié n'existe pas"
        )
    
    # Vérifier si une séance existe déjà pour ce cours à cette date
    existing_seance = db.query(Seance).filter(
        Seance.id_cours == seance.id_cours,
        Seance.date_seance == seance.date_seance
    ).first()
    
    if existing_seance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Une séance existe déjà pour ce cours à cette date"
        )
    
    # Si la séance est annulée, vérifier qu'un motif d'annulation est fourni
    if seance.est_annulee and not seance.motif_annulation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un motif d'annulation est requis pour une séance annulée"
        )
    
    return create_seance(db=db, seance=seance)

@router.get("/", response_model=List[SeanceSchema])
def read_seances(
    skip: int = 0, 
    limit: int = 100,
    cours_id: Optional[int] = Query(None, description="Filtrer par cours"),
    date_debut: Optional[date] = Query(None, description="Date de début pour le filtrage"),
    date_fin: Optional[date] = Query(None, description="Date de fin pour le filtrage"),
    est_annulee: Optional[bool] = Query(None, description="Filtrer par statut d'annulation"),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les séances avec possibilité de filtrage
    """
    query = db.query(Seance)
    
    if cours_id:
        query = query.filter(Seance.id_cours == cours_id)
    
    if date_debut:
        query = query.filter(Seance.date_seance >= date_debut)
    
    if date_fin:
        query = query.filter(Seance.date_seance <= date_fin)
    
    if est_annulee is not None:
        query = query.filter(Seance.est_annulee == est_annulee)
    
    seances = query.offset(skip).limit(limit).all()
    return seances

@router.get("/{seance_id}", response_model=SeanceSchema)
def read_seance(seance_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une séance par son ID
    """
    db_seance = get_seance(db, seance_id=seance_id)
    if db_seance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Séance non trouvée"
        )
    return db_seance

@router.put("/{seance_id}", response_model=SeanceSchema)
def update_seance(
    seance_id: int, 
    seance: SeanceUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une séance
    """
    db_seance = get_seance(db, seance_id=seance_id)
    if db_seance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Séance non trouvée"
        )
    
    # Vérifier que le cours existe si fourni
    if seance.id_cours is not None:
        cours = db.query(Cours).filter(Cours.id_cours == seance.id_cours).first()
        if not cours:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le cours spécifié n'existe pas"
            )
    
    # Si la séance devient annulée et qu'aucun motif n'est fourni, vérifier le motif existant
    if seance.est_annulee is True and seance.motif_annulation is None and not db_seance.motif_annulation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un motif d'annulation est requis pour une séance annulée"
        )
    
    # Update seance fields if provided
    update_data = seance.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_seance, key, value)
    
    db.commit()
    db.refresh(db_seance)
    return db_seance

@router.delete("/{seance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seance(seance_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une séance
    """
    db_seance = get_seance(db, seance_id=seance_id)
    if db_seance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Séance non trouvée"
        )
    
    # Vérifier si la séance a des absences associées
    if db_seance.absences and len(db_seance.absences) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer cette séance car elle a des absences associées"
        )
    
    db.delete(db_seance)
    db.commit()
    return None