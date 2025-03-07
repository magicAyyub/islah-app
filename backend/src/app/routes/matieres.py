from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.models import Matiere
from src.utils.schemas import MatiereCreate, Matiere as MatiereSchema, MatiereUpdate

router = APIRouter(
    prefix="/matieres",
    tags=["matieres"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_matiere(db: Session, matiere_id: int):
    return db.query(Matiere).filter(Matiere.id_matiere == matiere_id).first()

def create_matiere(db: Session, matiere: MatiereCreate):
    db_matiere = Matiere(
        nom=matiere.nom,
        description=matiere.description
    )
    db.add(db_matiere)
    db.commit()
    db.refresh(db_matiere)
    return db_matiere

# Routes
@router.post("/", response_model=MatiereSchema, status_code=status.HTTP_201_CREATED)
def create_new_matiere(matiere: MatiereCreate, db: Session = Depends(get_db)):
    """
    Créer une nouvelle matière
    """
    # Vérifier si une matière avec le même nom existe déjà
    existing_matiere = db.query(Matiere).filter(Matiere.nom == matiere.nom).first()
    if existing_matiere:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Une matière avec le nom '{matiere.nom}' existe déjà"
        )
    
    return create_matiere(db=db, matiere=matiere)

@router.get("/", response_model=List[MatiereSchema])
def read_matieres(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les matières
    """
    matieres = db.query(Matiere).offset(skip).limit(limit).all()
    return matieres

@router.get("/{matiere_id}", response_model=MatiereSchema)
def read_matiere(matiere_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une matière par son ID
    """
    db_matiere = get_matiere(db, matiere_id=matiere_id)
    if db_matiere is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Matière non trouvée"
        )
    return db_matiere

@router.put("/{matiere_id}", response_model=MatiereSchema)
def update_matiere(
    matiere_id: int, 
    matiere: MatiereUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une matière
    """
    db_matiere = get_matiere(db, matiere_id=matiere_id)
    if db_matiere is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Matière non trouvée"
        )
    
    # Vérifier si le nouveau nom existe déjà
    if matiere.nom and matiere.nom != db_matiere.nom:
        existing_matiere = db.query(Matiere).filter(Matiere.nom == matiere.nom).first()
        if existing_matiere:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Une matière avec le nom '{matiere.nom}' existe déjà"
            )
    
    # Update matiere fields if provided
    update_data = matiere.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_matiere, key, value)
    
    db.commit()
    db.refresh(db_matiere)
    return db_matiere

@router.delete("/{matiere_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_matiere(matiere_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une matière
    """
    db_matiere = get_matiere(db, matiere_id=matiere_id)
    if db_matiere is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Matière non trouvée"
        )
    
    # Vérifier si la matière est utilisée dans des cours
    if db_matiere.cours and len(db_matiere.cours) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer cette matière car elle est utilisée dans des cours"
        )
    
    db.delete(db_matiere)
    db.commit()
    return None