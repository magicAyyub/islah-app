from src.app.routes.users import router as users_router
from src.app.routes.responsables import router as responsables_router
from src.app.routes.eleves import router as eleves_router
from src.app.routes.classes import router as classes_router
from src.app.routes.inscriptions import router as inscriptions_router
from src.app.routes.paiements import router as paiements_router
from src.app.routes.cours import router as cours_router
from src.app.routes.seances import router as seances_router
from src.app.routes.absences import router as absences_router
from src.app.routes.niveaux import router as niveaux_router
from src.app.routes.matieres import router as matieres_router
from src.app.routes.creneaux import router as creneaux_router
from src.app.routes.classe_creneaux import router as classe_creneaux_router
from src.app.routes.annees_scolaires import router as annees_scolaires_router
from src.app.routes.auth import router as auth_router
from src.app.routes.init import router as init_router
from src.app.routes.bulk_operations import router as bulk_operations_router

# Liste de tous les routers pour faciliter l'importation dans api.py
routers = [
    users_router,
    responsables_router,
    eleves_router,
    niveaux_router,
    matieres_router,
    classes_router,
    creneaux_router,
    classe_creneaux_router,
    annees_scolaires_router,
    inscriptions_router,
    paiements_router,
    cours_router,
    seances_router,
    absences_router,
    auth_router,
    init_router,
    bulk_operations_router
]