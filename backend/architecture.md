# De la Modélisation Conceptuelle de Données (MCD) - École de la mosquée Islah


## Contexte

L'école de la mosquée Islah est une école privée qui accueille des élèves de la maternelle au collège. L'école propose un enseignement basé sur les valeurs de l'islam et met l'accent sur l'éducation religieuse et la réussite scolaire. L'école est gérée par une équipe pédagogique et administrative dévouée qui s'efforce de fournir un environnement d'apprentissage sûr et stimulant pour les élèves.

## Objectif

L'objectif de ce projet est de concevoir un Modèle Conceptuel de Données (MCD) pour l'école de la mosquée Islah. Le MCD permettra de représenter les entités, les attributs et les relations clés du système d'information de l'école. Le MCD servira de base pour la conception d'une base de données relationnelle qui pourra être utilisée pour gérer les inscriptions, les cours, les paiements et d'autres aspects de l'école.


## Méthodologie de conception d'un MCD : du contexte au modèle final

Pour un stagiaire ou un étudiant qui débute dans la modélisation de données, voici une explication détaillée de ma démarche pour passer du contexte de l'école de la mosquée Islah au MCD final.

### 1. Analyse du contexte et identification des entités

La première étape consiste à lire attentivement le contexte et à identifier les éléments qui deviendront des entités dans notre modèle.

#### Exemple d'analyse du texte :

> "Un élève pour être inscrit a besoin d'un responsable légal qui renseigne une fiche d'inscription."



Ici, j'identifie trois concepts potentiels :

- **ELEVE** (entité)
- **RESPONSABLE_LEGAL** (entité)
- **INSCRIPTION** (entité ou relation)


> "L'école est constituée de plusieurs niveaux. Notamment, La Maternelle, le CP, Niveau 1, Niveau 2, etc."



Ceci suggère une entité **NIVEAU**.

> "Les classes ont lieu en fonction du jour et d'un créneau."



Ceci suggère des entités **CLASSE** et **CRENEAU**.

### 2. Identification des attributs pour chaque entité

Pour chaque entité identifiée, je détermine les attributs nécessaires en me basant sur le contexte et en ajoutant des attributs logiques même s'ils ne sont pas explicitement mentionnés.

#### Exemple pour l'entité ELEVE :

- id_eleve (identifiant unique)
- nom
- prenom
- date_naissance
- sexe (attribut logique non mentionné mais utile)


### 3. Identification des relations entre entités

Je cherche dans le texte les verbes et expressions qui indiquent des relations entre les entités.

#### Exemple :

> "Un élève pour être inscrit a besoin d'un responsable légal"



Ceci indique une relation entre ELEVE et RESPONSABLE_LEGAL.

> "Le responsable légal peut avoir un ou plusieurs enfants (élèves) sous sa tutelle."



Ceci précise la cardinalité : un responsable peut avoir plusieurs élèves (1,n).

### 4. Détermination des cardinalités

Pour chaque relation, j'analyse le texte pour déterminer les cardinalités minimales et maximales.

#### Exemple :

- Un RESPONSABLE_LEGAL peut avoir un ou plusieurs ELEVE (1,n)
- Un ELEVE appartient à un seul RESPONSABLE_LEGAL (1,1)


### 5. Identification des entités associatives

Lorsqu'une relation possède des attributs propres ou qu'elle relie plus de deux entités, je crée une entité associative.

#### Exemple :

L'inscription d'un élève à une classe pour une année scolaire spécifique nécessite une entité associative INSCRIPTION.

### 6. Raffinement du modèle

Je relis le contexte pour identifier des contraintes ou des règles métier qui pourraient nécessiter des ajustements au modèle.

#### Exemple :

> "Les classes ont un nombre limité de place. Il y a donc une notion de disponibilité"



Ceci m'a conduit à ajouter un attribut "places_disponibles" dans l'entité associative CLASSE_CRENEAU.

### 7. Démonstration avec un exemple concret

Prenons l'exemple de la gestion des créneaux et des disponibilités :

1. **Lecture du contexte** :

> "Les classes ont lieu en fonction du jour et d'un créneau. On retrouve notamment : Mercredi (10h00 - 13h00), Mercredi (13h30 - 16h30), Samedi (10h00 - 13h00), etc. Les classes ont un nombre limité de place."




2. **Identification des entités** :

1. CLASSE (déjà identifiée)
2. CRENEAU (nouvelle entité pour gérer les jours et horaires)



3. **Identification des attributs** :

1. Pour CRENEAU : id_creneau, jour, heure_debut, heure_fin



4. **Analyse de la relation** :

1. Une classe peut être disponible sur plusieurs créneaux
2. Un créneau peut concerner plusieurs classes
3. Il s'agit donc d'une relation many-to-many



5. **Création d'une entité associative** :

1. CLASSE_CRENEAU avec les attributs : id_classe_creneau, id_classe, id_creneau
2. Ajout de l'attribut "places_disponibles" pour gérer la capacité



6. **Intégration dans le modèle global** :

1. Ajout des relations entre CLASSE, CLASSE_CRENEAU et CRENEAU





### 8. Vérification de la cohérence du modèle

Je vérifie que toutes les règles métier sont bien représentées dans le modèle :

- Gestion des inscriptions et réinscriptions
- Suivi des paiements par trimestre
- Émission des reçus
- Gestion des disponibilités


### 9. Finalisation du MCD

J'organise les entités de manière logique et je dessine le MCD final avec toutes les entités, attributs et relations.

### Exemple de réflexion pour un cas spécifique : la réinscription

Dans le contexte, on lit :

> "La réinscription, fonctionne exactement de la même manière que l'inscription. Si un élève pourtant déjà inscrit ne remet pas sa fiche renseigné pour la nouvelle année, il n'est pas inscrit d'office dans l'école."



Cette information m'a conduit à :

1. Créer une entité ANNEE_SCOLAIRE pour gérer les années académiques
2. Lier l'entité INSCRIPTION à ANNEE_SCOLAIRE
3. Ajouter un attribut "statut" dans INSCRIPTION pour distinguer les nouvelles inscriptions des réinscriptions
4. M'assurer que le modèle permet de vérifier si un élève est inscrit pour une année spécifique


---

Cette méthodologie structurée permet de passer d'un contexte textuel à un MCD complet et cohérent. Pour un stagiaire, il est important de comprendre que la modélisation est un processus itératif qui nécessite une analyse approfondie du contexte et une réflexion sur les besoins futurs du système. 


## Pourquoi cette approche est-elle meilleure ?

Voici pourquoi cette approche est meilleure, illustrée par des exemples concrets de requêtes SQL que vous pourrez réaliser.

### 1. Requêtes simples

#### Lister tous les élèves d'un responsable légal

```sql
SELECT e.id_eleve, e.nom, e.prenom, e.date_naissance
FROM ELEVE e
WHERE e.id_responsable = 123;
```

Cette requête simple permet à l'administration de voir rapidement tous les enfants sous la responsabilité d'un même parent, facilitant la gestion familiale.

#### Vérifier les places disponibles dans une classe à un créneau spécifique

```sql
SELECT c.nom AS classe, cr.jour, cr.heure_debut, cr.heure_fin, cc.places_disponibles
FROM CLASSE_CRENEAU cc
JOIN CLASSE c ON cc.id_classe = c.id_classe
JOIN CRENEAU cr ON cc.id_creneau = cr.id_creneau
WHERE c.id_classe = 5 AND cr.jour = 'Mercredi' AND cr.heure_debut = '10:00:00';
```

Cette requête permet à l'agent d'inscription de vérifier instantanément la disponibilité d'une classe, sans avoir à compter manuellement les fiches d'inscription.

#### Obtenir la liste des matières enseignées dans une classe

```sql
SELECT m.nom, m.description
FROM MATIERE m
JOIN CLASSE_MATIERE cm ON m.id_matiere = cm.id_matiere
WHERE cm.id_classe = 3;
```

Cette requête permet d'informer rapidement les parents sur le contenu pédagogique d'une classe spécifique.

### 2. Requêtes de niveau intermédiaire

#### Trouver tous les élèves inscrits à un créneau particulier pour l'année en cours

```sql
SELECT e.nom, e.prenom, c.nom AS classe, n.nom AS niveau
FROM INSCRIPTION i
JOIN ELEVE e ON i.id_eleve = e.id_eleve
JOIN CLASSE_CRENEAU cc ON i.id_classe_creneau = cc.id_classe_creneau
JOIN CLASSE c ON cc.id_classe = c.id_classe
JOIN NIVEAU n ON c.id_niveau = n.id_niveau
JOIN CRENEAU cr ON cc.id_creneau = cr.id_creneau
JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
WHERE cr.jour = 'Samedi' 
AND cr.heure_debut = '10:00:00'
AND a.libelle = '2023-2024'
ORDER BY n.nom, c.nom, e.nom;
```

Cette requête permet de générer facilement des listes de présence pour chaque séance, ce qui était impossible avec l'ancien système.

#### Calculer le montant total des paiements par trimestre pour une année scolaire

```sql
SELECT p.trimestre, SUM(p.montant) AS total_paiements
FROM PAIEMENT p
JOIN INSCRIPTION i ON p.id_inscription = i.id_inscription
JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
WHERE a.libelle = '2023-2024'
GROUP BY p.trimestre
ORDER BY p.trimestre;
```

Cette requête permet à l'administration de suivre les finances par trimestre, facilitant la gestion budgétaire de l'école.

#### Identifier les élèves qui n'ont pas encore payé pour un trimestre spécifique

```sql
SELECT e.id_eleve, e.nom, e.prenom, r.nom AS nom_responsable, r.contact
FROM ELEVE e
JOIN RESPONSABLE_LEGAL r ON e.id_responsable = r.id_responsable
JOIN INSCRIPTION i ON e.id_eleve = i.id_eleve
JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
WHERE a.libelle = '2023-2024'
AND i.statut = 'Active'
AND NOT EXISTS (
    SELECT 1 FROM PAIEMENT p 
    WHERE p.id_inscription = i.id_inscription 
    AND p.trimestre = 'Trimestre 1'
);
```

Cette requête permet d'identifier rapidement les retards de paiement, ce qui était impossible avec le système manuel où "aucun rappel n'est fait".

### 3. Requêtes complexes

#### Analyser le taux de réinscription des élèves d'une année à l'autre

```sql
WITH eleves_annee_precedente AS (
    SELECT e.id_eleve, e.nom, e.prenom
    FROM ELEVE e
    JOIN INSCRIPTION i ON e.id_eleve = i.id_eleve
    JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
    WHERE a.libelle = '2022-2023'
),
eleves_annee_courante AS (
    SELECT e.id_eleve
    FROM ELEVE e
    JOIN INSCRIPTION i ON e.id_eleve = i.id_eleve
    JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
    WHERE a.libelle = '2023-2024'
)
SELECT eap.nom, eap.prenom, 
       CASE WHEN eac.id_eleve IS NOT NULL THEN 'Réinscrit' ELSE 'Non réinscrit' END AS statut
FROM eleves_annee_precedente eap
LEFT JOIN eleves_annee_courante eac ON eap.id_eleve = eac.id_eleve
ORDER BY statut, eap.nom, eap.prenom;
```

Cette requête permet d'analyser le taux de fidélisation des élèves et d'identifier ceux qui ne se sont pas réinscrits, permettant potentiellement de les contacter.

#### Trouver les créneaux alternatifs pour un élève qui souhaite s'inscrire à une classe complète

```sql
SELECT c.nom AS classe, cr.jour, cr.heure_debut, cr.heure_fin, cc.places_disponibles
FROM CLASSE_CRENEAU cc
JOIN CLASSE c ON cc.id_classe = c.id_classe
JOIN CRENEAU cr ON cc.id_creneau = cr.id_creneau
JOIN NIVEAU n ON c.id_niveau = n.id_niveau
WHERE n.id_niveau = (
    SELECT n2.id_niveau 
    FROM CLASSE c2 
    JOIN NIVEAU n2 ON c2.id_niveau = n2.id_niveau 
    WHERE c2.id_classe = 7
)
AND cc.places_disponibles > 0
ORDER BY cr.jour, cr.heure_debut;
```

Cette requête permet de proposer rapidement des alternatives à un élève lorsque son premier choix de classe est complet, améliorant l'expérience d'inscription.

#### Générer un rapport complet sur l'occupation des classes par niveau et créneau

```sql
SELECT 
    n.nom AS niveau,
    c.nom AS classe,
    cr.jour,
    CONCAT(cr.heure_debut, ' - ', cr.heure_fin) AS horaire,
    c.capacite_max AS capacite_totale,
    cc.places_disponibles,
    (c.capacite_max - cc.places_disponibles) AS places_occupees,
    ROUND(((c.capacite_max - cc.places_disponibles) / c.capacite_max) * 100, 2) AS taux_occupation
FROM CLASSE_CRENEAU cc
JOIN CLASSE c ON cc.id_classe = c.id_classe
JOIN NIVEAU n ON c.id_niveau = n.id_niveau
JOIN CRENEAU cr ON cc.id_creneau = cr.id_creneau
JOIN ANNEE_SCOLAIRE a ON a.libelle = '2023-2024'
ORDER BY n.nom, cr.jour, cr.heure_debut;
```

Cette requête génère un rapport détaillé sur l'occupation des classes, permettant à la direction de prendre des décisions éclairées sur l'ouverture de nouvelles classes si nécessaire.

#### Suivi des paiements et génération de rappels automatiques

```sql
SELECT 
    e.nom AS nom_eleve, 
    e.prenom AS prenom_eleve,
    r.nom AS nom_responsable,
    r.contact,
    n.nom AS niveau,
    c.nom AS classe,
    CONCAT(cr.jour, ' ', cr.heure_debut, '-', cr.heure_fin) AS creneau,
    'Trimestre 2' AS trimestre_courant,
    CASE 
        WHEN p.id_paiement IS NULL THEN 'Non payé'
        ELSE 'Payé le ' || p.date_paiement
    END AS statut_paiement,
    CASE 
        WHEN p.id_paiement IS NULL THEN 'Paiement requis avant le 15/01/2024'
        ELSE NULL
    END AS message_rappel
FROM INSCRIPTION i
JOIN ELEVE e ON i.id_eleve = e.id_eleve
JOIN RESPONSABLE_LEGAL r ON e.id_responsable = r.id_responsable
JOIN CLASSE_CRENEAU cc ON i.id_classe_creneau = cc.id_classe_creneau
JOIN CLASSE c ON cc.id_classe = c.id_classe
JOIN NIVEAU n ON c.id_niveau = n.id_niveau
JOIN CRENEAU cr ON cc.id_creneau = cr.id_creneau
JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
LEFT JOIN PAIEMENT p ON i.id_inscription = p.id_inscription AND p.trimestre = 'Trimestre 2'
WHERE a.libelle = '2023-2024'
AND i.statut = 'Active'
AND (p.id_paiement IS NULL OR p.date_paiement IS NOT NULL)
ORDER BY statut_paiement, nom_eleve;
```

Cette requête permet de générer automatiquement des rappels de paiement, comblant une lacune majeure du système actuel où "aucun rappel n'est fait".

### 4. Avantages spécifiques du nouveau MCD

#### 1. Gestion efficace des places disponibles

Avec l'entité `CLASSE_CRENEAU` et son attribut `places_disponibles`, le système peut:

- Mettre à jour automatiquement les places disponibles lors d'une inscription
- Empêcher les surréservations
- Faciliter la recherche de créneaux alternatifs


```sql
-- Mise à jour automatique après une inscription
UPDATE CLASSE_CRENEAU 
SET places_disponibles = places_disponibles - 1
WHERE id_classe_creneau = 15;
```

#### 2. Suivi des réinscriptions

La combinaison des entités `INSCRIPTION` et `ANNEE_SCOLAIRE` permet de:

- Distinguer clairement les inscriptions par année scolaire
- Suivre l'historique des inscriptions d'un élève
- Gérer le processus de réinscription sans automatisme, comme demandé


```sql
-- Vérifier si un élève était inscrit l'année précédente
SELECT COUNT(*) > 0 AS etait_inscrit
FROM INSCRIPTION i
JOIN ANNEE_SCOLAIRE a ON i.id_annee_scolaire = a.id_annee
WHERE i.id_eleve = 42
AND a.libelle = '2022-2023';
```

#### 3. Gestion des paiements et reçus

La structure `PAIEMENT` → `RECU` permet de:

- Enregistrer différents types de paiement (Espèce, CB, Chèque)
- Générer des reçus numérotés avec date d'émission
- Suivre les paiements par trimestre


```sql
-- Générer un nouveau reçu après paiement
INSERT INTO RECU (id_paiement, numero_recu, date_emission, tampon)
VALUES (156, 'R-2023-156', CURRENT_DATE, TRUE);
```

#### 4. Organisation pédagogique flexible

La séparation des entités `NIVEAU`, `CLASSE`, `MATIERE` et `CRENEAU` permet de:

- Modifier facilement la structure des cours
- Ajouter de nouvelles matières sans modifier la structure
- Créer de nouvelles classes en cas de nécessité


```sql
-- Créer une nouvelle classe quand toutes sont pleines
INSERT INTO CLASSE (id_niveau, nom, capacite_max)
VALUES (3, 'Niveau 2 - Groupe C', 25);

-- Puis l'associer aux créneaux disponibles
INSERT INTO CLASSE_CRENEAU (id_classe, id_crenea
```