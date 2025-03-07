from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from src.utils.database import get_db
from src.utils.models import Absence, Eleve, Seance
from src.utils.schemas import AbsenceCreate, Absence as AbsenceSchema, AbsenceUpdate

router = APIRouter(
    prefix="/absences",
    tags=["absences"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_absence(db: Session, absence_id: int):
    return db.query(Absence).filter(Absence.id_absence == absence_id).first()

def create_absence(db: Session, absence: AbsenceCreate):
    db_absence = Absence(
        id_eleve=absence.id_eleve,
        id_seance=absence.id_seance,
        statut=absence.statut,
        motif=absence.motif,
        date_justification=absence.date_justification
    )
    db.add(db_absence)
    db.commit()
    db.refresh(db_absence)
    return db_absence

# Routes
@router.post("/", response_model=AbsenceSchema, status_code=status.HTTP_201_CREATED)
def create_new_absence(absence: AbsenceCreate, db: Session = Depends(get_db)):
    """
    Enregistrer une nouvelle absence
    """
    # Vérifier que l'élève existe
    eleve = db.query(Eleve).filter(Eleve.id_eleve == absence.id_eleve).first()
    if not eleve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'élève spécifié n'existe pas"
        )
    
    # Vérifier que la séance existe
    seance = db.query(Seance).filter(Seance.id_seance == absence.id_seance).first()
    if not seance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La séance spécifiée n'existe pas"
        )
    
    # Vérifier si l'absence est déjà enregistrée
    absence_existante = db.query(Absence).filter(
        Absence.id_eleve == absence.id_eleve,
        Absence.id_seance == absence.id_seance
    ).first()
    
    if absence_existante:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette absence est déjà enregistrée"
        )
    
    return create_absence(db=db, absence=absence)

@router.get("/", response_model=List[AbsenceSchema])
def read_absences(
    skip: int = 0, 
    limit: int = 100,
    eleve_id: Optional[int] = Query(None, description="Filtrer par élève"),
    statut: Optional[str] = Query(None, description="Filtrer par statut"),
    date_debut: Optional[date] = Query(None, description="Date de début pour le filtrage"),
    date_fin: Optional[date] = Query(None, description="Date de fin pour le filtrage"),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les absences avec possibilité de filtrage
    """
    query = db.query(Absence)
    
    if eleve_id:
        query = query.filter(Absence.id_eleve == eleve_id)
    
    if statut:
        query = query.filter(Absence.statut == statut)
    
    if date_debut or date_fin:
        query = query.join(Seance)
        
        if date_debut:
            query = query.filter(Seance.date_seance >= date_debut)
        
        if date_fin:
            query = query.filter(Seance.date_seance <= date_fin)
    
    absences = query.offset(skip).limit(limit).all()
    return absences

@router.get("/{absence_id}", response_model=AbsenceSchema)
def read_absence(absence_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une absence par son ID
    """
    db_absence = get_absence(db, absence_id=absence_id)
    if db_absence is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Absence non trouvée"
        )
    return db_absence

@router.put("/{absence_id}", response_model=AbsenceSchema)
def update_absence(
    absence_id: int, 
    absence: AbsenceUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une absence (par exemple pour la justifier)
    """
    db_absence = get_absence(db, absence_id=absence_id)
    if db_absence is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Absence non trouvée"
        )
    
    # Update absence fields if provided
    update_data = absence.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_absence, key, value)
    
    db.commit()
    db.refresh(db_absence)
    return db_absence

@router.delete("/{absence_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_absence(absence_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une absence
    """
    db_absence = get_absence(db, absence_id=absence_id)
    if db_absence is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Absence non trouvée"
        )
    
    db.delete(db_absence)
    db.commit()
    return None