from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from src.utils.database import get_db
from src.utils.models import ResponsableLegal
from src.utils.schemas import ResponsableLegalCreate, ResponsableLegal as ResponsableLegalSchema, ResponsableLegalUpdate

router = APIRouter(
    prefix="/api/responsables",
    tags=["responsables"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_responsable(db: Session, responsable_id: int):
    return db.query(ResponsableLegal).filter(ResponsableLegal.id_responsable == responsable_id).first()

def create_responsable(db: Session, responsable: ResponsableLegalCreate):
    db_responsable = ResponsableLegal(
        nom=responsable.nom,
        prenom=responsable.prenom,
        contact=responsable.contact,
        adresse=responsable.adresse,
        email=responsable.email,
        telephone=responsable.telephone
    )
    db.add(db_responsable)
    db.commit()
    db.refresh(db_responsable)
    return db_responsable

# Routes
@router.post("/", response_model=ResponsableLegalSchema, status_code=status.HTTP_201_CREATED)
def create_new_responsable(responsable: ResponsableLegalCreate, db: Session = Depends(get_db)):
    """
    Créer un nouveau responsable légal
    """
    return create_responsable(db=db, responsable=responsable)

@router.get("/", response_model=List[ResponsableLegalSchema])
def read_responsables(
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = Query(None, description="Rechercher par nom, prénom ou contact"),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les responsables légaux avec possibilité de recherche
    """
    query = db.query(ResponsableLegal)
    
    if search:
        query = query.filter(
            or_(
                ResponsableLegal.nom.ilike(f"%{search}%"),
                ResponsableLegal.prenom.ilike(f"%{search}%"),
                ResponsableLegal.contact.ilike(f"%{search}%")
            )
        )
    
    responsables = query.offset(skip).limit(limit).all()
    return responsables

@router.get("/{responsable_id}", response_model=ResponsableLegalSchema)
def read_responsable(responsable_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un responsable légal par son ID
    """
    db_responsable = get_responsable(db, responsable_id=responsable_id)
    if db_responsable is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Responsable légal non trouvé"
        )
    return db_responsable

@router.put("/{responsable_id}", response_model=ResponsableLegalSchema)
def update_responsable(
    responsable_id: int, 
    responsable: ResponsableLegalUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un responsable légal
    """
    db_responsable = get_responsable(db, responsable_id=responsable_id)
    if db_responsable is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Responsable légal non trouvé"
        )
    
    # Update responsable fields if provided
    update_data = responsable.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_responsable, key, value)
    
    db.commit()
    db.refresh(db_responsable)
    return db_responsable

@router.delete("/{responsable_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_responsable(responsable_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un responsable légal
    """
    db_responsable = get_responsable(db, responsable_id=responsable_id)
    if db_responsable is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Responsable légal non trouvé"
        )
    
    # Vérifier si le responsable a des élèves associés
    if db_responsable.eleves and len(db_responsable.eleves) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer ce responsable car il a des élèves associés"
        )
    
    db.delete(db_responsable)
    db.commit()
    return None