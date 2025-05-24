# src/utils/profile_manager.py

from typing import Dict, Type, Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.sql import exists

from src.app.models.user import User
from src.app.models.teacher import Teacher
from src.app.models.parent import Parent
from src.utils.enums import UserRole

class ProfileManager:
    """
    Gestionnaire de profils qui gère la création automatique de profils basés sur les rôles utilisateur.
    Cette classe utilise un registre de mappages rôle-profil pour créer dynamiquement les profils appropriés.
    """
    
    # Registre des mappages rôle-profil
    # Format: {UserRole: (ModelClass, extraction_function)}
    _registry: Dict = {}
    
    @classmethod
    def register_profile_mapping(cls, role: UserRole, model_class: Type, extraction_func=None):
        """
        Enregistre un mappage entre un rôle utilisateur et une classe de modèle de profil.
        
        Args:
            role: Le rôle utilisateur
            model_class: La classe de modèle de profil correspondante
            extraction_func: Fonction optionnelle pour extraire les données du profil à partir de l'utilisateur
        """
        if extraction_func is None:
            # Fonction d'extraction par défaut qui extrait le prénom et le nom à partir du nom complet
            def default_extraction(user):
                name_parts = user.full_name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ""
                return {
                    "first_name": first_name,
                    "last_name": last_name,
                    "user_id": user.id
                }
            extraction_func = default_extraction
            
        cls._registry[role] = (model_class, extraction_func)
    
    @classmethod
    def create_profile_for_user(cls, db: Session, user: User) -> Optional[object]:
        """
        Crée un profil pour un utilisateur en fonction de son rôle, s'il n'en a pas déjà un.
        
        Args:
            db: Session de base de données
            user: L'utilisateur pour lequel créer un profil
            
        Returns:
            Le profil créé ou None si aucun profil n'a été créé
        """
        if user.role not in cls._registry:
            return None  # Pas de mappage pour ce rôle
            
        model_class, extraction_func = cls._registry[user.role]
        
        # Vérifier si l'utilisateur a déjà un profil
        if db.query(exists().where(model_class.user_id == user.id)).scalar():
            return None
            
        # Extraire les données du profil
        profile_data = extraction_func(user)
        
        # Créer le profil
        profile = model_class(**profile_data)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
        return profile
    
    @classmethod
    def create_missing_profiles(cls, db: Session) -> List[Tuple[UserRole, int]]:
        """
        Crée des profils pour tous les utilisateurs qui n'en ont pas encore.
        
        Args:
            db: Session de base de données
            
        Returns:
            Liste de tuples (rôle, nombre de profils créés)
        """
        results = []
        
        for role, (model_class, extraction_func) in cls._registry.items():
            # Trouver tous les utilisateurs avec ce rôle qui n'ont pas de profil
            subquery = db.query(model_class.user_id)
            users = db.query(User).filter(
                User.role == role,
                ~User.id.in_(subquery)
            ).all()
            
            count = 0
            for user in users:
                profile_data = extraction_func(user)
                profile = model_class(**profile_data)
                db.add(profile)
                count += 1
                
            if count > 0:
                db.commit()
                results.append((role, count))
                
        return results

# Enregistrer les mappages rôle-profil
ProfileManager.register_profile_mapping(UserRole.TEACHER, Teacher)
ProfileManager.register_profile_mapping(UserRole.PARENT, Parent)
# ProfileManager.register_profile_mapping(UserRole.STAFF, Parent)  # Utiliser Parent pour STAFF pour l'exemple
# ProfileManager.register_profile_mapping(UserRole.ADMIN, Parent)  # Utiliser Parent pour ADMIN pour l'exemple
# ProfileManager.register_profile_mapping(UserRole.STUDENT, Parent)  # Utiliser Parent pour STUDENT pour l'exemple
# Note: Les mappages pour STAFF, ADMIN et STUDENT sont des exemples. Ils doivent être remplacés par les classes de modèle appropriées.
# Enregistrer les fonctions d'extraction si nécessaire
# ProfileManager.register_profile_mapping(UserRole.STAFF, Staff, extraction_func=custom_extraction_func)
# Note: Les fonctions d'extraction personnalisées peuvent être enregistrées ici si nécessaire.

 