from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.models import Classe, Niveau
from src.utils.schemas import ClasseCreate, Classe as ClasseSchema, ClasseUpdate

router = APIRouter(
    prefix="/api/classes",
    tags=["classes"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_classe(db: Session, classe_id: int):
    return db.query(Classe).filter(Classe.id_classe == classe_id).first()

def create_classe(db: Session, classe: ClasseCreate):
    db_classe = Classe(
        id_niveau=classe.id_niveau,
        nom=classe.nom,
        capacite_max=classe.capacite_max
    )
    db.add(db_classe)
    db.commit()
    db.refresh(db_classe)
    return db_classe

# Routes
@router.post("/", response_model=ClasseSchema, status_code=status.HTTP_201_CREATED)
def create_new_classe(classe: ClasseCreate, db: Session = Depends(get_db)):
    """
    Créer une nouvelle classe
    """
    # Vérifier que le niveau existe
    niveau = db.query(Niveau).filter(Niveau.id_niveau == classe.id_niveau).first()
    if not niveau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le niveau spécifié n'existe pas"
        )
    
    # Vérifier si une classe avec le même nom existe déjà dans ce niveau
    existing_classe = db.query(Classe).filter(
        Classe.nom == classe.nom,
        Classe.id_niveau == classe.id_niveau
    ).first()
    
    if existing_classe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Une classe avec le nom '{classe.nom}' existe déjà dans ce niveau"
        )
    
    return create_classe(db=db, classe=classe)

@router.get("/", response_model=List[ClasseSchema])
def read_classes(
    skip: int = 0, 
    limit: int = 100,
    niveau_id: Optional[int] = Query(None, description="Filtrer par niveau"),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les classes avec possibilité de filtrage par niveau
    """
    query = db.query(Classe)
    
    if niveau_id:
        query = query.filter(Classe.id_niveau == niveau_id)
    
    classes = query.offset(skip).limit(limit).all()
    return classes

@router.get("/{classe_id}", response_model=ClasseSchema)
def read_classe(classe_id: int, db: Session = Depends(get_db)):
    """
    Récupérer une classe par son ID
    """
    db_classe = get_classe(db, classe_id=classe_id)
    if db_classe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Classe non trouvée"
        )
    return db_classe

@router.put("/{classe_id}", response_model=ClasseSchema)
def update_classe(
    classe_id: int, 
    classe: ClasseUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une classe
    """
    db_classe = get_classe(db, classe_id=classe_id)
    if db_classe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Classe non trouvée"
        )
    
    # Vérifier que le niveau existe si fourni
    if classe.id_niveau is not None:
        niveau = db.query(Niveau).filter(Niveau.id_niveau == classe.id_niveau).first()
        if not niveau:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le niveau spécifié n'existe pas"
            )
    
    # Vérifier si le nouveau nom existe déjà dans ce niveau
    if classe.nom and classe.nom != db_classe.nom:
        niveau_id = classe.id_niveau if classe.id_niveau is not None else db_classe.id_niveau
        existing_classe = db.query(Classe).filter(
            Classe.nom == classe.nom,
            Classe.id_niveau == niveau_id,
            Classe.id_classe != classe_id
        ).first()
        
        if existing_classe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Une classe avec le nom '{classe.nom}' existe déjà dans ce niveau"
            )
    
    # Update classe fields if provided
    update_data = classe.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_classe, key, value)
    
    db.commit()
    db.refresh(db_classe)
    return db_classe

@router.delete("/{classe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classe(classe_id: int, db: Session = Depends(get_db)):
    """
    Supprimer une classe
    """
    db_classe = get_classe(db, classe_id=classe_id)
    if db_classe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Classe non trouvée"
        )
    
    # Vérifier si la classe a des créneaux associés
    if db_classe.classe_creneaux and len(db_classe.classe_creneaux) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer cette classe car elle a des créneaux associés"
        )
    
    db.delete(db_classe)
    db.commit()
    return None