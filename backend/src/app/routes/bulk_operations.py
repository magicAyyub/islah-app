from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
import json
from datetime import date

from src.utils.database import get_db
from src.utils.models import (
    Eleve, ClasseCreneau, AnneeScolaire, Inscription, 
    Seance, Absence, User, ResponsableLegal
)
from src.utils.schemas import (
    InscriptionBulkCreate, BulkCreateResponse, 
    AbsenceBulkCreate, ImportResult
)
from src.utils.auth import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/bulk",
    tags=["bulk-operations"],
    responses={404: {"description": "Not found"}},
)

# Routes pour les inscriptions en lot
@router.post("/inscriptions", response_model=BulkCreateResponse)
async def create_bulk_inscriptions(
    inscriptions_data: InscriptionBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Créer plusieurs inscriptions en une seule opération (admin uniquement)
    """
    # Vérifier que l'année scolaire existe
    annee_scolaire = db.query(AnneeScolaire).filter(
        AnneeScolaire.id_annee == inscriptions_data.id_annee_scolaire
    ).first()
    
    if not annee_scolaire:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'année scolaire spécifiée n'existe pas"
        )
    
    created_count = 0
    failed_count = 0
    failed_items = []
    
    for eleve_inscription in inscriptions_data.eleves:
        try:
            # Vérifier que l'élève existe
            eleve = db.query(Eleve).filter(
                Eleve.id_eleve == eleve_inscription.id_eleve
            ).first()
            
            if not eleve:
                raise ValueError(f"L'élève avec l'ID {eleve_inscription.id_eleve} n'existe pas")
            
            # Vérifier que le créneau de classe existe
            classe_creneau = db.query(ClasseCreneau).filter(
                ClasseCreneau.id_classe_creneau == eleve_inscription.id_classe_creneau
            ).first()
            
            if not classe_creneau:
                raise ValueError(f"Le créneau de classe avec l'ID {eleve_inscription.id_classe_creneau} n'existe pas")
            
            # Vérifier s'il y a des places disponibles
            if classe_creneau.places_disponibles <= 0:
                raise ValueError(f"Il n'y a plus de places disponibles dans ce créneau de classe")
            
            # Vérifier si l'élève est déjà inscrit pour cette année scolaire
            existing_inscription = db.query(Inscription).filter(
                Inscription.id_eleve == eleve_inscription.id_eleve,
                Inscription.id_annee_scolaire == inscriptions_data.id_annee_scolaire
            ).first()
            
            if existing_inscription:
                raise ValueError(f"L'élève avec l'ID {eleve_inscription.id_eleve} est déjà inscrit pour cette année scolaire")
            
            # Créer l'inscription
            new_inscription = Inscription(
                id_eleve=eleve_inscription.id_eleve,
                id_classe_creneau=eleve_inscription.id_classe_creneau,
                id_annee_scolaire=inscriptions_data.id_annee_scolaire,
                date_inscription=inscriptions_data.date_inscription,
                statut=inscriptions_data.statut
            )
            
            # Mettre à jour le nombre de places disponibles
            classe_creneau.places_disponibles -= 1
            
            db.add(new_inscription)
            created_count += 1
            
        except Exception as e:
            failed_count += 1
            failed_items.append({
                "id_eleve": eleve_inscription.id_eleve,
                "id_classe_creneau": eleve_inscription.id_classe_creneau,
                "error": str(e)
            })
    
    if created_count > 0:
        db.commit()
    
    return {
        "created_count": created_count,
        "failed_count": failed_count,
        "message": f"{created_count} inscription(s) créée(s) avec succès, {failed_count} échec(s)",
        "failed_items": failed_items if failed_count > 0 else None
    }

# Routes pour les absences en lot
@router.post("/absences", response_model=BulkCreateResponse)
async def create_bulk_absences(
    absences_data: AbsenceBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Enregistrer plusieurs absences en une seule opération
    """
    # Vérifier que la séance existe
    seance = db.query(Seance).filter(
        Seance.id_seance == absences_data.id_seance
    ).first()
    
    if not seance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La séance spécifiée n'existe pas"
        )
    
    created_count = 0
    failed_count = 0
    failed_items = []
    
    for absence_item in absences_data.absences:
        try:
            # Vérifier que l'élève existe
            eleve = db.query(Eleve).filter(
                Eleve.id_eleve == absence_item.id_eleve
            ).first()
            
            if not eleve:
                raise ValueError(f"L'élève avec l'ID {absence_item.id_eleve} n'existe pas")
            
            # Vérifier si l'absence est déjà enregistrée
            existing_absence = db.query(Absence).filter(
                Absence.id_eleve == absence_item.id_eleve,
                Absence.id_seance == absences_data.id_seance
            ).first()
            
            if existing_absence:
                raise ValueError(f"L'absence de l'élève avec l'ID {absence_item.id_eleve} est déjà enregistrée pour cette séance")
            
            # Créer l'absence
            new_absence = Absence(
                id_eleve=absence_item.id_eleve,
                id_seance=absences_data.id_seance,
                statut=absences_data.statut,
                motif=absence_item.motif
            )
            
            db.add(new_absence)
            created_count += 1
            
        except Exception as e:
            failed_count += 1
            failed_items.append({
                "id_eleve": absence_item.id_eleve,
                "error": str(e)
            })
    
    if created_count > 0:
        db.commit()
    
    return {
        "created_count": created_count,
        "failed_count": failed_count,
        "message": f"{created_count} absence(s) enregistrée(s) avec succès, {failed_count} échec(s)",
        "failed_items": failed_items if failed_count > 0 else None
    }

# Import/Export CSV
@router.post("/import/eleves", response_model=ImportResult)
async def import_eleves_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Importer des élèves à partir d'un fichier CSV
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier doit être au format CSV"
        )
    
    content = await file.read()
    
    # Décodage du contenu CSV
    try:
        csv_content = content.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        
        total_records = 0
        imported_records = 0
        failed_records = 0
        errors = []
        
        for row in csv_reader:
            total_records += 1
            try:
                # Vérifier si l'élève existe déjà
                existing_eleve = db.query(Eleve).filter(
                    Eleve.nom == row.get('nom'),
                    Eleve.prenom == row.get('prenom'),
                    Eleve.date_naissance == date.fromisoformat(row.get('date_naissance', '2000-01-01'))
                ).first()
                
                if existing_eleve:
                    raise ValueError(f"Un élève avec le même nom, prénom et date de naissance existe déjà")
                
                # Vérifier si le responsable existe
                id_responsable = int(row.get('id_responsable', 0))
                if id_responsable > 0:
                    responsable = db.query(ResponsableLegal).filter(
                        ResponsableLegal.id_responsable == id_responsable
                    ).first()
                    
                    if not responsable:
                        raise ValueError(f"Le responsable avec l'ID {id_responsable} n'existe pas")
                
                # Créer l'élève
                new_eleve = Eleve(
                    id_responsable=id_responsable if id_responsable > 0 else None,
                    nom=row.get('nom'),
                    prenom=row.get('prenom'),
                    date_naissance=date.fromisoformat(row.get('date_naissance', '2000-01-01')),
                    lieu_naissance=row.get('lieu_naissance'),
                    sexe=row.get('sexe'),
                    adresse=row.get('adresse'),
                    telephone=row.get('telephone'),
                    email=row.get('email')
                )
                
                db.add(new_eleve)
                imported_records += 1
                
            except Exception as e:
                failed_records += 1
                errors.append(f"Ligne {total_records}: {str(e)}")
        
        if imported_records > 0:
            db.commit()
        
        return {
            "total_records": total_records,
            "imported_records": imported_records,
            "failed_records": failed_records,
            "errors": errors if failed_records > 0 else None
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de l'importation du fichier CSV: {str(e)}"
        )

@router.get("/export/eleves")
async def export_eleves_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Exporter les élèves au format CSV
    """
    # Récupérer tous les élèves
    eleves = db.query(Eleve).all()
    
    # Créer un buffer pour le CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Écrire l'en-tête
    writer.writerow([
        'id_eleve', 'id_responsable', 'nom', 'prenom', 'date_naissance', 
        'lieu_naissance', 'sexe', 'adresse', 'telephone', 'email'
    ])
    
    # Écrire les données
    for eleve in eleves:
        writer.writerow([
            eleve.id_eleve,
            eleve.id_responsable or '',
            eleve.nom,
            eleve.prenom,
            eleve.date_naissance,
            eleve.lieu_naissance or '',
            eleve.sexe or '',
            eleve.adresse or '',
            eleve.telephone or '',
            eleve.email or ''
        ])
    
    # Préparer la réponse
    output.seek(0)
    
    # Retourner le fichier CSV
    from fastapi.responses import StreamingResponse
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=eleves_{date.today().isoformat()}.csv"}
    )