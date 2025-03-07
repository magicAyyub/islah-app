from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.database import get_db
from src.utils.models import Cours, Matiere, Classe, User, Creneau, AnneeScolaire
from src.utils.schemas import CoursCreate, Cours as CoursSchema, CoursUpdate

router = APIRouter(
    prefix="/cours",
    tags=["cours"],
    responses={404: {"description": "Not found"}},
)

# Helper functions
def get_cours(db: Session, cours_id: int):
    return db.query(Cours).filter(Cours.id_cours == cours_id).first()

def create_cours(db: Session, cours: CoursCreate):
    db_cours = Cours(
        id_matiere=cours.id_matiere,
        id_classe=cours.id_classe,
        id_enseignant=cours.id_enseignant,
        id_creneau=cours.id_creneau,
        id_annee_scolaire=cours.id_annee_scolaire,
        objectifs=cours.objectifs
    )
    db.add(db_cours)
    db.commit()
    db.refresh(db_cours)
    return db_cours

# Routes
@router.post("/", response_model=CoursSchema, status_code=status.HTTP_201_CREATED)
def create_new_cours(cours: CoursCreate, db: Session = Depends(get_db)):
    """
    Créer un nouveau cours
    """
    # Vérifier que la matière existe
    matiere = db.query(Matiere).filter(Matiere.id_matiere == cours.id_matiere).first()
    if not matiere:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La matière spécifiée n'existe pas"
        )
    
    # Vérifier que la classe existe
    classe = db.query(Classe).filter(Classe.id_classe == cours.id_classe).first()
    if not classe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La classe spécifiée n'existe pas"
        )
    
    # Vérifier que l'enseignant existe
    enseignant = db.query(User).filter(User.id_user == cours.id_enseignant).first()
    if not enseignant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'enseignant spécifié n'existe pas"
        )
    
    # Vérifier que le créneau existe
    creneau = db.query(Creneau).filter(Creneau.id_creneau == cours.id_creneau).first()
    if not creneau:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le créneau spécifié n'existe pas"
        )
    
    # Vérifier que l'année scolaire existe
    annee_scolaire = db.query(AnneeScolaire).filter(
        AnneeScolaire.id_annee == cours.id_annee_scolaire
    ).first()
    if not annee_scolaire:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'année scolaire spécifiée n'existe pas"
        )
    
    # Vérifier si un cours existe déjà pour cette classe, ce créneau et cette année scolaire
    existing_cours = db.query(Cours).filter(
        Cours.id_classe == cours.id_classe,
        Cours.id_creneau == cours.id_creneau,
        Cours.id_annee_scolaire == cours.id_annee_scolaire
    ).first()
    
    if existing_cours:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un cours existe déjà pour cette classe, ce créneau et cette année scolaire"
        )
    
    return create_cours(db=db, cours=cours)

@router.get("/", response_model=List[CoursSchema])
def read_cours(
    skip: int = 0, 
    limit: int = 100,
    matiere_id: Optional[int] = Query(None, description="Filtrer par matière"),
    classe_id: Optional[int] = Query(None, description="Filtrer par classe"),
    enseignant_id: Optional[int] = Query(None, description="Filtrer par enseignant"),
    annee_scolaire_id: Optional[int] = Query(None, description="Filtrer par année scolaire"),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les cours avec possibilité de filtrage
    """
    query = db.query(Cours)
    
    if matiere_id:
        query = query.filter(Cours.id_matiere == matiere_id)
    
    if classe_id:
        query = query.filter(Cours.id_classe == classe_id)
    
    if enseignant_id:
        query = query.filter(Cours.id_enseignant == enseignant_id)
    
    if annee_scolaire_id:
        query = query.filter(Cours.id_annee_scolaire == annee_scolaire_id)
    
    cours = query.offset(skip).limit(limit).all()
    return cours

@router.get("/{cours_id}", response_model=CoursSchema)
def read_cours_by_id(cours_id: int, db: Session = Depends(get_db)):
    """
    Récupérer un cours par son ID
    """
    db_cours = get_cours(db, cours_id=cours_id)
    if db_cours is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cours non trouvé"
        )
    return db_cours

@router.put("/{cours_id}", response_model=CoursSchema)
def update_cours(
    cours_id: int, 
    cours: CoursUpdate, 
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un cours
    """
    db_cours = get_cours(db, cours_id=cours_id)
    if db_cours is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cours non trouvé"
        )
    
    # Vérifier que la matière existe si fournie
    if cours.id_matiere is not None:
        matiere = db.query(Matiere).filter(Matiere.id_matiere == cours.id_matiere).first()
        if not matiere:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La matière spécifiée n'existe pas"
            )
    
    # Vérifier que la classe existe si fournie
    if cours.id_classe is not None:
        classe = db.query(Classe).filter(Classe.id_classe == cours.id_classe).first()
        if not classe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La classe spécifiée n'existe pas"
            )
    
    # Vérifier que l'enseignant existe si fourni
    if cours.id_enseignant is not None:
        enseignant = db.query(User).filter(User.id_user == cours.id_enseignant).first()
        if not enseignant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'enseignant spécifié n'existe pas"
            )
    
    # Vérifier que le créneau existe si fourni
    if cours.id_creneau is not None:
        creneau = db.query(Creneau).filter(Creneau.id_creneau == cours.id_creneau).first()
        if not creneau:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le créneau spécifié n'existe pas"
            )
    
    # Vérifier que l'année scolaire existe si fournie
    if cours.id_annee_scolaire is not None:
        annee_scolaire = db.query(AnneeScolaire).filter(
            AnneeScolaire.id_annee == cours.id_annee_scolaire
        ).first()
        if not annee_scolaire:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'année scolaire spécifiée n'existe pas"
            )
    
    # Update cours fields if provided
    update_data = cours.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_cours, key, value)
    
    db.commit()
    db.refresh(db_cours)
    return db_cours

@router.delete("/{cours_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cours(cours_id: int, db: Session = Depends(get_db)):
    """
    Supprimer un cours
    """
    db_cours = get_cours(db, cours_id=cours_id)
    if db_cours is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cours non trouvé"
        )
    
    # Vérifier si le cours a des séances associées
    if db_cours.seances and len(db_cours.seances) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de supprimer ce cours car il a des séances associées"
        )
    
    db.delete(db_cours)
    db.commit()
    return None