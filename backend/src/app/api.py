"""
This module contains the FastAPI application and its configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from src.utils.database import engine, get_db
import src.utils.models as models
from src.app.routes import (
    users,
    responsables,
    eleves,
    niveaux,
    matieres,
    classes,
    creneaux,
    classe_creneaux,
    annees_scolaires,
    inscriptions,
    paiements,
    cours,
    seances,
    absences,
    auth,
    init,
    bulk_operations
)

from src.utils.settings import ORIGINS

# Import des routers
users_router = users.router
responsables_router = responsables.router
eleves_router = eleves.router
niveaux_router = niveaux.router
matieres_router = matieres.router
classes_router = classes.router
creneaux_router = creneaux.router
classe_creneaux_router = classe_creneaux.router
annees_scolaires_router = annees_scolaires.router
inscriptions_router = inscriptions.router
paiements_router = paiements.router
cours_router = cours.router
seances_router = seances.router
absences_router = absences.router
auth_router = auth.router
init_router = init.router
bulk_operations_router = bulk_operations.router

def create_tables_if_not_exist():
    """
    Create database tables only if they do not already exist.
    
    This method checks each table in the models before creating it,
    preventing errors from attempting to recreate existing tables.
    """
    inspector = inspect(engine)
    
    # List of all model classes
    model_classes = [
        models.User,
        models.ResponsableLegal,
        models.Eleve,
        models.Niveau,
        models.Matiere,
        models.Classe,
        models.Creneau,
        models.ClasseCreneau,
        models.AnneeScolaire,
        models.Inscription,
        models.Paiement,
        models.Recu,
        models.ClasseMatiere,
        models.Cours,
        models.Seance,
        models.Absence,
    ]
    
    for model_class in model_classes:
        # Check if table already exists
        if not inspector.has_table(model_class.__tablename__):
            # Create only if table doesn't exist
            model_class.__table__.create(engine)
        

# Create tables only if they don't exist
create_tables_if_not_exist()


app = FastAPI(
    title="Islah School API",
    description="API pour la gestion de l'école de la mosquée Islah",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include all routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(responsables_router)
app.include_router(eleves_router)
app.include_router(niveaux_router)
app.include_router(matieres_router)
app.include_router(classes_router)
app.include_router(creneaux_router)
app.include_router(classe_creneaux_router)
app.include_router(annees_scolaires_router)
app.include_router(inscriptions_router)
app.include_router(paiements_router)
app.include_router(cours_router)
app.include_router(seances_router)
app.include_router(absences_router)
app.include_router(init_router)
app.include_router(bulk_operations_router)

# Root endpoint to verify API connection
@app.get("/")
async def root() -> dict:
    return {"message": "Welcome to the Islah School Management API!"}