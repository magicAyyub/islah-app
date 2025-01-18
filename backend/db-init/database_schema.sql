-- Table pour gérer les agents administratifs (utilisateurs du système)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'agent', 'direction')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les responsables légaux (ajout du rôle)
CREATE TABLE Guardians (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('father', 'mother', 'guardian')),
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les élèves (ajout du sexe)
CREATE TABLE Students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison entre les élèves et leurs responsables légaux
CREATE TABLE student_guardians (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES Students(id) ON DELETE CASCADE,
    guardian_id INT NOT NULL REFERENCES Guardians(id) ON DELETE CASCADE
);

-- Table pour les classes (ajout des jours et créneaux horaires)
CREATE TABLE Classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered INT DEFAULT 0 CHECK (registered >= 0),
    day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL, -- 
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT registered_not_exceed_capacity CHECK (registered <= capacity)
);

-- Table pour associer les élèves aux classes
CREATE TABLE Enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES Students(id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES Classes(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'withdrawn'))
);

-- Table pour les paiements
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES Students(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(20) NOT NULL CHECK (method IN ('cash', 'card', 'transfer')),
    description TEXT
);

-- Table pour stocker les notifications générées
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES Students(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment_reminder', 're_enrollment_reminder')),
    created_by INT NOT NULL, -- ID de l'agent qui a généré la notification
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Fonction pour générer une notification
CREATE OR REPLACE FUNCTION create_notification_for_agent() RETURNS TRIGGER AS $$
BEGIN
    -- Générer une notification pour un agent
    INSERT INTO Notifications (student_id, type, created_by, content)
    VALUES (
        NEW.student_id,
        'payment_reminder',
        NEW.created_by,
        CONCAT('Alerte : Le paiement pour l’élève ', NEW.student_id, ' est en retard.')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour permettre la génération de notifications
CREATE TRIGGER trigger_generate_notification
AFTER INSERT ON Payments
FOR EACH ROW
WHEN (NEW.due_date < CURRENT_DATE AND NEW.payment_date IS NULL)
EXECUTE FUNCTION create_notification_for_agent();