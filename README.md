# Islah School

Islah School est une petite école privée située au coeur de la moquée Islah situé à 70 Rue des Sorins, 93100 Montreuil. L'école est ouverte à tous les enfants à partir de l'âge de 3 ans. L'école donne des cours de coran, écrirure, lecture, invocations (dua), histoire de prophète (sira) et bien d'autres matières les jours hors calendrier scolaire. Les Mercredis, samedis et dimanches. 

Il existe plusieurs niveaux:  2 niveaux de maternelle, 3 niveaux de primaire et bien d'autres. Les classes sont crée par créneau horaire: 

- Classe du matin => 10h-13h avec une pause de 11h20 jusqu'à 12h00. 
- Classe de l'après-midi => 14h-17h avec une pause de 15h20 jusqu'à 16h00.

D'autres classes sont crée en fonction des besoins.

Chaque classe a une place limitée d'élèves et on peu avoir plusieurs classes pour un même niveau. Les classes sont crée en fonction des besoins. 

## Système actuel

Le système actuel est basé sur des feuilles de papier et quelques fois l'utilisation de classeur excel. Les inscriptions se font sur place et les parents doivent se déplacer pour inscrire leurs enfants. Les inscriptions se font en fonction des places disponibles. L'inscription est validée une fois le paiement effectué. Un paiement initial de frais d'inscription puis un paiement trimestriel. Le paiement se fait en espèèce, par chèque ou par Carte Bancaire. Un reçu est donné à chaque paiement. Rien n'est mis en place pour informer les parents de quelconque évènement, paiements à effectuer (L'école ne s'en rend pas compte si le parent lui même ne vient pas déclarer et régler par bonne foi), etc. Il n'y a pas de reinscription, les parents doivent remplir un formulaire d'inscriptions à chaque année scolaire, s'il ne le font pas à temps, ils perdent leur place au profit d'un autre enfant. Les enfant on un bulletin de note à chaque fin de trimestre, bulletin qui est fait à la main grâce à un modèle de feuille excel. Lorsqu'un enfant est absent, rien n'est remarqué et aucun suivi n'est fait. En cas de plainte, ou de revandication concernant un paiement, une recherche manuelle parmis les dossiers est faite pour retrouver la trace du paiement et le dossier de l'enfant, ce qui peut prendre du temps et n'est pas toujours trouvé. Un des problèmes récurrents est de savoir qui a fait quel inscription d'enfant au sein de l'équipe chargée des inscriptions ainsi en cas de quelconque soucis, il est difficile de remonter à la source.

## Objectif

Le système actuel est très peu fiable et peu pratique. L'objectif est de créer un système de gestion de l'école qui permettra de gérer les inscriptions, les paiements, les absences, les notes, les évènements, les informations des parents, les informations des enfants, les informations des enseignants, les informations des classes, les informations des niveaux, les informations des matières, les informations des horaires, les informations des salles, les informations des plannings, les informations des emplois du temps, les informations des bulletins de notes et bien d'autres. Le système doit être simple, intuitif, fiable, sécurisé et pratique. Il doit permettre de gérer l'école de A à Z.

## Notes

Un essie de backend a été fait avec FastAPI, un framework python pour la création d'API REST. Il est à refaire car il n'est pas adapté au cas spécifique de l'école. Une attention particulière sera accordé à la modélisation de la base de données avant de commencer le développement.

## MCD 

```mermaid
erDiagram
    STUDENT {
        int id PK
        string student_id
        string first_name
        string last_name
        date birth_date
        string gender
        int level_id FK
        int class_id FK
        date registration_date
        string status
        int created_by FK
    }
    
    PARENT {
        int id PK
        string first_name
        string last_name
        string email
        string phone
        string address
    }
    
    STUDENT_PARENT {
        int id PK
        int student_id FK
        int parent_id FK
        string relationship
    }
    
    LEVEL {
        int id PK
        string name
        string description
    }
    
    CLASS {
        int id PK
        string name
        string time_slot
        int capacity
        string academic_year
    }
    
    PAYMENT {
        int id PK
        string payment_id
        int student_id FK
        date payment_date
        decimal amount
        string payment_type
        string payment_method
        string status
        int created_by FK
        string receipt_number
    }
    
    ATTENDANCE {
        int id PK
        int student_id FK
        date attendance_date
        boolean present
        string comment
        boolean justified
        int recorded_by FK
    }
    
    REPORT_CARD {
        int id PK
        string report_id
        int student_id FK
        int trimester
        string academic_year
        date created_date
        string status
        int created_by FK
    }
    
    GRADE {
        int id PK
        int report_card_id FK
        int subject_id FK
        decimal grade
        string comment
    }
    
    SUBJECT {
        int id PK
        string name
        string description
    }
    
    NOTIFICATION {
        int id PK
        string title
        string content
        date sent_date
        string notification_type
        string status
        int sent_by FK
    }
    
    NOTIFICATION_RECIPIENT {
        int id PK
        int notification_id FK
        int parent_id FK
        boolean read
        date read_date
    }
    
    USER {
        int id PK
        string username
        string password_hash
        string first_name
        string last_name
        string email
        string role
        date last_login
    }
    
    STUDENT ||--o{ STUDENT_PARENT : has
    PARENT ||--o{ STUDENT_PARENT : has
    LEVEL ||--o{ STUDENT : contains
    CLASS ||--o{ STUDENT : contains
    STUDENT ||--o{ PAYMENT : makes
    STUDENT ||--o{ ATTENDANCE : has
    STUDENT ||--o{ REPORT_CARD : receives
    REPORT_CARD ||--o{ GRADE : contains
    SUBJECT ||--o{ GRADE : has
    NOTIFICATION ||--o{ NOTIFICATION_RECIPIENT : sent_to
    PARENT ||--o{ NOTIFICATION_RECIPIENT : receives
    USER ||--o{ PAYMENT : records
    USER ||--o{ ATTENDANCE : records
    USER ||--o{ REPORT_CARD : creates
    USER ||--o{ NOTIFICATION : sends 
```