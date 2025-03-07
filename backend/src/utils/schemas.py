from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import date, time, datetime
from enum import Enum

# Enums
class RoleUtilisateur(str, Enum):
    ADMIN = "admin"
    ENSEIGNANT = "enseignant"
    SECRETARIAT = "secretariat"
    DIRECTION = "direction"

class StatutInscription(str, Enum):
    NOUVELLE = "nouvelle"
    REINSCRIPTION = "réinscription"
    ANNULEE = "annulée"
    EN_ATTENTE = "en attente"

class StatutAbsence(str, Enum):
    JUSTIFIEE = "justifiée"
    NON_JUSTIFIEE = "non justifiée"
    EN_ATTENTE = "en attente"

class TypePaiement(str, Enum):
    ESPECE = "espèce"
    CHEQUE = "chèque"
    CB = "carte bancaire"
    VIREMENT = "virement"

# Base schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    nom: str
    prenom: str
    role: RoleUtilisateur
    est_actif: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    role: Optional[RoleUtilisateur] = None
    est_actif: Optional[bool] = None
    password: Optional[str] = None

class User(UserBase):
    id_user: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ResponsableLegalBase(BaseModel):
    nom: str
    prenom: str
    contact: str
    adresse: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None

class ResponsableLegalCreate(ResponsableLegalBase):
    pass

class ResponsableLegalUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    contact: Optional[str] = None
    adresse: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None

class ResponsableLegal(ResponsableLegalBase):
    id_responsable: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EleveBase(BaseModel):
    id_responsable: int
    nom: str
    prenom: str
    date_naissance: date
    sexe: str = Field(..., min_length=1, max_length=1)

class EleveCreate(EleveBase):
    pass

class EleveUpdate(BaseModel):
    id_responsable: Optional[int] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    date_naissance: Optional[date] = None
    sexe: Optional[str] = None

class Eleve(EleveBase):
    id_eleve: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NiveauBase(BaseModel):
    nom: str
    description: Optional[str] = None

class NiveauCreate(NiveauBase):
    pass

class NiveauUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None

class Niveau(NiveauBase):
    id_niveau: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MatiereBase(BaseModel):
    nom: str
    description: Optional[str] = None

class MatiereCreate(MatiereBase):
    pass

class MatiereUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None

class Matiere(MatiereBase):
    id_matiere: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClasseBase(BaseModel):
    id_niveau: int
    nom: str
    capacite_max: int

class ClasseCreate(ClasseBase):
    pass

class ClasseUpdate(BaseModel):
    id_niveau: Optional[int] = None
    nom: Optional[str] = None
    capacite_max: Optional[int] = None

class Classe(ClasseBase):
    id_classe: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CreneauBase(BaseModel):
    jour: str
    heure_debut: time
    heure_fin: time

class CreneauCreate(CreneauBase):
    pass

class CreneauUpdate(BaseModel):
    jour: Optional[str] = None
    heure_debut: Optional[time] = None
    heure_fin: Optional[time] = None

class Creneau(CreneauBase):
    id_creneau: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClasseCreneauBase(BaseModel):
    id_classe: int
    id_creneau: int
    places_disponibles: int

class ClasseCreneauCreate(ClasseCreneauBase):
    pass

class ClasseCreneauUpdate(BaseModel):
    id_classe: Optional[int] = None
    id_creneau: Optional[int] = None
    places_disponibles: Optional[int] = None

class ClasseCreneau(ClasseCreneauBase):
    id_classe_creneau: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AnneeScolaireBase(BaseModel):
    libelle: str
    date_debut: date
    date_fin: date
    est_active: bool = True

class AnneeScolaireCreate(AnneeScolaireBase):
    pass

class AnneeScolaireUpdate(BaseModel):
    libelle: Optional[str] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    est_active: Optional[bool] = None

class AnneeScolaire(AnneeScolaireBase):
    id_annee: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InscriptionBase(BaseModel):
    id_eleve: int
    id_classe_creneau: int
    id_annee_scolaire: int
    date_inscription: date = Field(default_factory=date.today)
    statut: StatutInscription

class InscriptionCreate(InscriptionBase):
    pass

class InscriptionUpdate(BaseModel):
    id_eleve: Optional[int] = None
    id_classe_creneau: Optional[int] = None
    id_annee_scolaire: Optional[int] = None
    date_inscription: Optional[date] = None
    statut: Optional[StatutInscription] = None

class Inscription(InscriptionBase):
    id_inscription: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaiementBase(BaseModel):
    id_responsable: int
    id_inscription: int
    montant: float
    date_paiement: date = Field(default_factory=date.today)
    type_paiement: TypePaiement
    trimestre: Optional[str] = None
    reference: Optional[str] = None
    commentaire: Optional[str] = None

class PaiementCreate(PaiementBase):
    pass

class PaiementUpdate(BaseModel):
    id_responsable: Optional[int] = None
    id_inscription: Optional[int] = None
    montant: Optional[float] = None
    date_paiement: Optional[date] = None
    type_paiement: Optional[TypePaiement] = None
    trimestre: Optional[str] = None
    reference: Optional[str] = None
    commentaire: Optional[str] = None

class Paiement(PaiementBase):
    id_paiement: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RecuBase(BaseModel):
    id_paiement: int
    numero_recu: str
    date_emission: date = Field(default_factory=date.today)
    tampon: bool = True

class RecuCreate(RecuBase):
    pass

class RecuUpdate(BaseModel):
    id_paiement: Optional[int] = None
    numero_recu: Optional[str] = None
    date_emission: Optional[date] = None
    tampon: Optional[bool] = None

class Recu(RecuBase):
    id_recu: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CoursBase(BaseModel):
    id_matiere: int
    id_classe: int
    id_enseignant: int
    id_creneau: int
    id_annee_scolaire: int
    objectifs: Optional[str] = None

class CoursCreate(CoursBase):
    pass

class CoursUpdate(BaseModel):
    id_matiere: Optional[int] = None
    id_classe: Optional[int] = None
    id_enseignant: Optional[int] = None
    id_creneau: Optional[int] = None
    id_annee_scolaire: Optional[int] = None
    objectifs: Optional[str] = None

class Cours(CoursBase):
    id_cours: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SeanceBase(BaseModel):
    id_cours: int
    date_seance: date
    contenu: Optional[str] = None
    commentaire: Optional[str] = None
    est_annulee: bool = False
    motif_annulation: Optional[str] = None

class SeanceCreate(SeanceBase):
    pass

class SeanceUpdate(BaseModel):
    id_cours: Optional[int] = None
    date_seance: Optional[date] = None
    contenu: Optional[str] = None
    commentaire: Optional[str] = None
    est_annulee: Optional[bool] = None
    motif_annulation: Optional[str] = None

class Seance(SeanceBase):
    id_seance: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AbsenceBase(BaseModel):
    id_eleve: int
    id_seance: int
    statut: StatutAbsence
    motif: Optional[str] = None
    date_justification: Optional[date] = None

class AbsenceCreate(AbsenceBase):
    pass

class AbsenceUpdate(BaseModel):
    id_eleve: Optional[int] = None
    id_seance: Optional[int] = None
    statut: Optional[StatutAbsence] = None
    motif: Optional[str] = None
    date_justification: Optional[date] = None

class Absence(AbsenceBase):
    id_absence: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schémas pour l'authentification
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class RefreshToken(BaseModel):
    refresh_token: str

# Schémas pour les opérations en lot
class BulkDeleteResponse(BaseModel):
    deleted_count: int
    message: str

class BulkCreateResponse(BaseModel):
    created_count: int
    failed_count: int
    message: str
    failed_items: Optional[List[dict]] = None

class BulkUpdateResponse(BaseModel):
    updated_count: int
    failed_count: int
    message: str
    failed_items: Optional[List[dict]] = None

# Schémas pour les inscriptions en lot
class EleveInscriptionBulk(BaseModel):
    id_eleve: int
    id_classe_creneau: int

class InscriptionBulkCreate(BaseModel):
    id_annee_scolaire: int
    eleves: List[EleveInscriptionBulk]
    date_inscription: date = Field(default_factory=date.today)
    statut: str = "active"

# Schémas pour les absences en lot
class AbsenceBulkItem(BaseModel):
    id_eleve: int
    motif: Optional[str] = None

class AbsenceBulkCreate(BaseModel):
    id_seance: int
    absences: List[AbsenceBulkItem]
    statut: str = "non-justifiée"

# Schémas pour l'import/export
class ImportResult(BaseModel):
    total_records: int
    imported_records: int
    failed_records: int
    errors: Optional[List[str]] = None