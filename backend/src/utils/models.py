from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Time, ForeignKey, Text, DateTime, func, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from passlib.context import CryptContext
from src.utils.database import Base

# Pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Définition des énumérations
class RoleUtilisateur(enum.Enum):
    ADMIN = "admin"
    ENSEIGNANT = "enseignant"
    SECRETARIAT = "secretariat"
    DIRECTION = "direction"

class StatutAbsence(enum.Enum):
    JUSTIFIEE = "justifiée"
    NON_JUSTIFIEE = "non justifiée"
    EN_ATTENTE = "en attente"


class User(Base):
    """
    Représente un utilisateur du système (administrateur, enseignant, etc.)
    """
    __tablename__ = "users"
    
    id_user = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # admin, enseignant, secretariat, etc.
    est_actif = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    cours = relationship("Cours", back_populates="enseignant")
    
    def set_password(self, password):
        self.hashed_password = pwd_context.hash(password)
    
    def verify_password(self, password):
        return pwd_context.verify(password, self.hashed_password)


class ResponsableLegal(Base):
    """
    Représente un responsable légal qui peut avoir un ou plusieurs élèves sous sa tutelle.
    """
    __tablename__ = "responsables_legaux"
    
    id_responsable = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    contact = Column(String(50), nullable=False)
    adresse = Column(String(255))
    email = Column(String(100))
    telephone = Column(String(20))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    eleves = relationship("Eleve", back_populates="responsable")
    paiements = relationship("Paiement", back_populates="responsable")


class Eleve(Base):
    """
    Représente un élève inscrit à l'école.
    """
    __tablename__ = "eleves"
    
    id_eleve = Column(Integer, primary_key=True, index=True)
    id_responsable = Column(Integer, ForeignKey("responsables_legaux.id_responsable"), nullable=False)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    date_naissance = Column(Date, nullable=False)
    sexe = Column(String(1))  # 'M' ou 'F'
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    responsable = relationship("ResponsableLegal", back_populates="eleves")
    inscriptions = relationship("Inscription", back_populates="eleve")
    absences = relationship("Absence", back_populates="eleve")


class Niveau(Base):
    """
    Représente un niveau d'enseignement (Maternelle, CP, Niveau 1, etc.).
    """
    __tablename__ = "niveaux"
    
    id_niveau = Column(Integer, primary_key=True, index=True)
    nom = Column(String(50), nullable=False, unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    classes = relationship("Classe", back_populates="niveau")


class Matiere(Base):
    """
    Représente une matière enseignée (Coran, Douas, Tawhid, etc.).
    """
    __tablename__ = "matieres"
    
    id_matiere = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    classe_matieres = relationship("ClasseMatiere", back_populates="matiere")
    cours = relationship("Cours", back_populates="matiere")


class Classe(Base):
    """
    Représente une classe associée à un niveau.
    """
    __tablename__ = "classes"
    
    id_classe = Column(Integer, primary_key=True, index=True)
    id_niveau = Column(Integer, ForeignKey("niveaux.id_niveau"), nullable=False)
    nom = Column(String(100), nullable=False)
    capacite_max = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    niveau = relationship("Niveau", back_populates="classes")
    classe_creneaux = relationship("ClasseCreneau", back_populates="classe")
    classe_matieres = relationship("ClasseMatiere", back_populates="classe")
    cours = relationship("Cours", back_populates="classe")


class Creneau(Base):
    """
    Représente un créneau horaire (jour et heures).
    """
    __tablename__ = "creneaux"
    
    id_creneau = Column(Integer, primary_key=True, index=True)
    jour = Column(String(10), nullable=False)  # Lundi, Mardi, etc.
    heure_debut = Column(Time, nullable=False)
    heure_fin = Column(Time, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    classe_creneaux = relationship("ClasseCreneau", back_populates="creneau")
    cours = relationship("Cours", back_populates="creneau")


class ClasseCreneau(Base):
    """
    Association entre une classe et un créneau avec gestion des places disponibles.
    """
    __tablename__ = "classe_creneaux"
    
    id_classe_creneau = Column(Integer, primary_key=True, index=True)
    id_classe = Column(Integer, ForeignKey("classes.id_classe"), nullable=False)
    id_creneau = Column(Integer, ForeignKey("creneaux.id_creneau"), nullable=False)
    places_disponibles = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    classe = relationship("Classe", back_populates="classe_creneaux")
    creneau = relationship("Creneau", back_populates="classe_creneaux")
    inscriptions = relationship("Inscription", back_populates="classe_creneau")


class AnneeScolaire(Base):
    """
    Représente une année scolaire.
    """
    __tablename__ = "annees_scolaires"
    
    id_annee = Column(Integer, primary_key=True, index=True)
    libelle = Column(String(20), nullable=False, unique=True)  # Ex: "2023-2024"
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    est_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    inscriptions = relationship("Inscription", back_populates="annee_scolaire")
    cours = relationship("Cours", back_populates="annee_scolaire")


class Inscription(Base):
    """
    Représente l'inscription d'un élève à une classe pour une année scolaire.
    """
    __tablename__ = "inscriptions"
    
    id_inscription = Column(Integer, primary_key=True, index=True)
    id_eleve = Column(Integer, ForeignKey("eleves.id_eleve"), nullable=False)
    id_classe_creneau = Column(Integer, ForeignKey("classe_creneaux.id_classe_creneau"), nullable=False)
    id_annee_scolaire = Column(Integer, ForeignKey("annees_scolaires.id_annee"), nullable=False)
    date_inscription = Column(Date, nullable=False, default=func.current_date())
    statut = Column(String(20), nullable=False)  # "Nouvelle", "Réinscription", "Annulée", etc.
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    eleve = relationship("Eleve", back_populates="inscriptions")
    classe_creneau = relationship("ClasseCreneau", back_populates="inscriptions")
    annee_scolaire = relationship("AnneeScolaire", back_populates="inscriptions")
    paiements = relationship("Paiement", back_populates="inscription")


class Paiement(Base):
    """
    Représente un paiement effectué par un responsable légal.
    """
    __tablename__ = "paiements"
    
    id_paiement = Column(Integer, primary_key=True, index=True)
    id_responsable = Column(Integer, ForeignKey("responsables_legaux.id_responsable"), nullable=False)
    id_inscription = Column(Integer, ForeignKey("inscriptions.id_inscription"), nullable=False)
    montant = Column(Float, nullable=False)
    date_paiement = Column(Date, nullable=False, default=func.current_date())
    type_paiement = Column(String(20), nullable=False)  # "Espèce", "CB", "Chèque", etc.
    trimestre = Column(String(20))  # "T1", "T2", "T3" ou NULL pour frais d'inscription
    reference = Column(String(50))  # Référence du paiement (numéro de chèque, etc.)
    commentaire = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    responsable = relationship("ResponsableLegal", back_populates="paiements")
    inscription = relationship("Inscription", back_populates="paiements")
    recu = relationship("Recu", back_populates="paiement", uselist=False)


class Recu(Base):
    """
    Représente un reçu émis suite à un paiement.
    """
    __tablename__ = "recus"
    
    id_recu = Column(Integer, primary_key=True, index=True)
    id_paiement = Column(Integer, ForeignKey("paiements.id_paiement"), unique=True, nullable=False)
    numero_recu = Column(String(50), nullable=False, unique=True)
    date_emission = Column(Date, nullable=False, default=func.current_date())
    tampon = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    paiement = relationship("Paiement", back_populates="recu")


class ClasseMatiere(Base):
    """
    Association entre une classe et une matière.
    """
    __tablename__ = "classe_matieres"
    
    id_classe_matiere = Column(Integer, primary_key=True, index=True)
    id_classe = Column(Integer, ForeignKey("classes.id_classe"), nullable=False)
    id_matiere = Column(Integer, ForeignKey("matieres.id_matiere"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    classe = relationship("Classe", back_populates="classe_matieres")
    matiere = relationship("Matiere", back_populates="classe_matieres")


# Nouvelles entités ajouté

class Cours(Base):
    """
    Représente un cours spécifique (une matière enseignée dans une classe par un enseignant).
    """
    __tablename__ = "cours"
    
    id_cours = Column(Integer, primary_key=True, index=True)
    id_matiere = Column(Integer, ForeignKey("matieres.id_matiere"), nullable=False)
    id_classe = Column(Integer, ForeignKey("classes.id_classe"), nullable=False)
    id_enseignant = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    id_creneau = Column(Integer, ForeignKey("creneaux.id_creneau"), nullable=False)
    id_annee_scolaire = Column(Integer, ForeignKey("annees_scolaires.id_annee"), nullable=False)
    objectifs = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    matiere = relationship("Matiere", back_populates="cours")
    classe = relationship("Classe", back_populates="cours")
    enseignant = relationship("User", back_populates="cours")
    creneau = relationship("Creneau", back_populates="cours")
    annee_scolaire = relationship("AnneeScolaire", back_populates="cours")
    seances = relationship("Seance", back_populates="cours")


class Seance(Base):
    """
    Représente une séance spécifique d'un cours à une date donnée.
    """
    __tablename__ = "seances"
    
    id_seance = Column(Integer, primary_key=True, index=True)
    id_cours = Column(Integer, ForeignKey("cours.id_cours"), nullable=False)
    date_seance = Column(Date, nullable=False)
    contenu = Column(Text)
    commentaire = Column(Text)
    est_annulee = Column(Boolean, default=False)
    motif_annulation = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    cours = relationship("Cours", back_populates="seances")
    absences = relationship("Absence", back_populates="seance")


class Absence(Base):
    """
    Représente l'absence d'un élève à une séance.
    """
    __tablename__ = "absences"
    
    id_absence = Column(Integer, primary_key=True, index=True)
    id_eleve = Column(Integer, ForeignKey("eleves.id_eleve"), nullable=False)
    id_seance = Column(Integer, ForeignKey("seances.id_seance"), nullable=False)
    statut = Column(String(20), nullable=False)  # "justifiée", "non justifiée", "en attente"
    motif = Column(Text)
    date_justification = Column(Date)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relations
    eleve = relationship("Eleve", back_populates="absences")
    seance = relationship("Seance", back_populates="absences")