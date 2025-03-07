from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from src.utils.database import get_db
from src.utils.models import Eleve, ResponsableLegal
from src.utils.schemas import EleveCreate, Eleve as EleveSchema, EleveUpdate

router = APIRouter(
    prefix="/eleves",
    tags=["eleves"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_eleve(db: Session, eleve_id: int):
    return db.query(Eleve).filter(Eleve.id_eleve == eleve_id).first()

def create_eleve(db: Session, eleve: EleveCreate):
    db_eleve = Eleve(
        id_responsable=eleve.id_responsable,
        nom=eleve.nom,
        prenom=eleve.prenom,
        date_naissance=eleve.date_naissance,
        sexe=eleve.sexe
    )
    db.add(db_eleve)
    db.commit()
    db.refresh(db_eleve)
    return db_eleve

# Routes
@router.post("/", response_model=EleveSchema, status_code=status.HTTP_201_CREATED)
def create_new_eleve(eleve: EleveCreate, db: Session = Depends(get_db)):
    """
    Créer un nouvel élève
    """
    # Vérifier que le responsable légal existe
    responsable = db.query(ResponsableLegal).filter(
        ResponsableLegal.id_responsable == eleve.id_responsable
    ).first()
    
    if not responsable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le responsable légal spécifié n'existe pas"
        )
    
    return create_eleve(db=db, eleve=eleve)

@router.get("/", response_model=List[EleveSchema])
def read_eleves(
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = Query(None, description="Rechercher par nom ou prénom"),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les élèves avec possibilité de recherche
    """
    query = db.query(Eleve)
    
    if search:
        query = query.filter(
            or_(
                Eleve.nom.ilike(f"%{search}%"),
                Eleve.prenom.ilike(f"%{search}%")
            )
        )
    
    eleves = query.offset(skip).limit(limit).all()
    return eleves

@router.get("/{eleve_id}", response_model=EleveSchema)
def read_eleve(eleve_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un élève par son ID
    """
    db_eleve = get_eleve(db, eleve_id=eleve_id)
    if db_eleve is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Élève non trouvé"
        )
    return db_eleve

@router.get("/responsable/{responsable_id}", response_model=List[EleveSchema])
def read_eleves_by_responsable(
    responsable_id: int, 
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les élèves d'un responsable légal
    """
    eleves = db.query(Eleve).filter(
        Eleve.id_responsable == responsable_id
    ).all()
    
    return eleves

@router.put("/{eleve_id}", response_model=EleveSchema)
def update_eleve(
    eleve_id: int, 
    eleve: EleveUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un élève
    """
    db_eleve = get_eleve(db, eleve_id=eleve_id)
    if db_eleve is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Élève non trouvé"
        )
    
    # Vérifier que le responsable légal existe si fourni
    if eleve.id_responsable is not None:
        responsable = db.query(ResponsableLegal).filter(
            ResponsableLegal.id_responsable == eleve.id_responsable
        ).first()
        
        if not responsable:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le responsable légal spécifié n'existe pas"
            )
    
    # Update eleve fields if provided
    update_data = eleve.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_eleve, key, value)
    
    db.commit()
    db.refresh(db_eleve)
    return db_eleve

@router.delete("/{eleve_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_eleve(eleve_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un élève
    """
    db_eleve = get_eleve(db, eleve_id=eleve_id)
    if db_eleve is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Élève non trouvé"
        )
    
    db.delete(db_eleve)
    db.commit()
    return None