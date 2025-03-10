from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import uuid

from src.utils.database import get_db
from src.utils.models import Paiement, ResponsableLegal, Inscription, Recu
from src.utils.schemas import PaiementCreate, Paiement as PaiementSchema, PaiementUpdate, RecuCreate

router = APIRouter(
    prefix="/api/paiements",
    tags=["paiements"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_paiement(db: Session, paiement_id: int):
    return db.query(Paiement).filter(Paiement.id_paiement == paiement_id).first()

def create_paiement(db: Session, paiement: PaiementCreate):
    db_paiement = Paiement(
        id_responsable=paiement.id_responsable,
        id_inscription=paiement.id_inscription,
        montant=paiement.montant,
        date_paiement=paiement.date_paiement,
        type_paiement=paiement.type_paiement,
        trimestre=paiement.trimestre,
        reference=paiement.reference,
        commentaire=paiement.commentaire
    )
    db.add(db_paiement)
    db.commit()
    db.refresh(db_paiement)
    
    # Créer automatiquement un reçu pour ce paiement
    numero_recu = f"RECU-{uuid.uuid4().hex[:8].upper()}"
    db_recu = Recu(
        id_paiement=db_paiement.id_paiement,
        numero_recu=numero_recu,
        date_emission=date.today(),
        tampon=True
    )
    db.add(db_recu)
    db.commit()
    
    return db_paiement

# Routes
@router.post("/", response_model=PaiementSchema, status_code=status.HTTP_201_CREATED)
def create_new_paiement(paiement: PaiementCreate, db: Session = Depends(get_db)):
    """
    Enregistrer un nouveau paiement
    """
    # Vérifier que le responsable existe
    responsable = db.query(ResponsableLegal).filter(
        ResponsableLegal.id_responsable == paiement.id_responsable
    ).first()
    if not responsable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le responsable spécifié n'existe pas"
        )
    
    # Vérifier que l'inscription existe
    inscription = db.query(Inscription).filter(
        Inscription.id_inscription == paiement.id_inscription
    ).first()
    if not inscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'inscription spécifiée n'existe pas"
        )
    
    # Vérifier que le montant est positif
    if paiement.montant <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le montant du paiement doit être positif"
        )
    
    return create_paiement(db=db, paiement=paiement)

@router.get("/", response_model=List[PaiementSchema])
def read_paiements(
    skip: int = 0, 
    limit: int = 100,
    responsable_id: Optional[int] = Query(None, description="Filtrer par responsable"),
    inscription_id: Optional[int] = Query(None, description="Filtrer par inscription"),
    date_debut: Optional[date] = Query(None, description="Date de début pour le filtrage"),
    date_fin: Optional[date] = Query(None, description="Date de fin pour le filtrage"),
    type_paiement: Optional[str] = Query(None, description="Filtrer par type de paiement"),
    trimestre: Optional[str] = Query(None, description="Filtrer par trimestre"),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les paiements avec possibilité de filtrage
    """
    query = db.query(Paiement)
    
    if responsable_id:
        query = query.filter(Paiement.id_responsable == responsable_id)
    
    if inscription_id:
        query = query.filter(Paiement.id_inscription == inscription_id)
    
    if date_debut:
        query = query.filter(Paiement.date_paiement >= date_debut)
    
    if date_fin:
        query = query.filter(Paiement.date_paiement <= date_fin)
    
    if type_paiement:
        query = query.filter(Paiement.type_paiement == type_paiement)
    
    if trimestre:
        query = query.filter(Paiement.trimestre == trimestre)
    
    paiements = query.offset(skip).limit(limit).all()
    return paiements

@router.get("/{paiement_id}", response_model=PaiementSchema)
def read_paiement(paiement_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un paiement par son ID
    """
    db_paiement = get_paiement(db, paiement_id=paiement_id)
    if db_paiement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Paiement non trouvé"
        )
    return db_paiement

@router.put("/{paiement_id}", response_model=PaiementSchema)
def update_paiement(
    paiement_id: int, 
    paiement: PaiementUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un paiement
    """
    db_paiement = get_paiement(db, paiement_id=paiement_id)
    if db_paiement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Paiement non trouvé"
        )
    
    # Vérifier que le responsable existe si fourni
    if paiement.id_responsable is not None:
        responsable = db.query(ResponsableLegal).filter(
            ResponsableLegal.id_responsable == paiement.id_responsable
        ).first()
        if not responsable:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le responsable spécifié n'existe pas"
            )
    
    # Vérifier que l'inscription existe si fournie
    if paiement.id_inscription is not None:
        inscription = db.query(Inscription).filter(
            Inscription.id_inscription == paiement.id_inscription
        ).first()
        if not inscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'inscription spécifiée n'existe pas"
            )
    
    # Vérifier que le montant est positif si fourni
    if paiement.montant is not None and paiement.montant <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le montant du paiement doit être positif"
        )
    
    # Update paiement fields if provided
    update_data = paiement.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_paiement, key, value)
    
    db.commit()
    db.refresh(db_paiement)
    return db_paiement

@router.delete("/{paiement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paiement(paiement_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un paiement
    """
    db_paiement = get_paiement(db, paiement_id=paiement_id)
    if db_paiement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Paiement non trouvé"
        )
    
    # Supprimer le reçu associé s'il existe
    if db_paiement.recu:
        db.delete(db_paiement.recu)
    
    db.delete(db_paiement)
    db.commit()
    return None