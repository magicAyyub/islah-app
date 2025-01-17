-- Enums for static values
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE relationship_type AS ENUM ('mother', 'father', 'guardian', 'other');
CREATE TYPE notification_type AS ENUM ('payment_due', 'payment_overdue', 'payment_received', 'payment_failed');

-- Classes table with additional useful fields
CREATE TABLE Classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered INT DEFAULT 0 CHECK (registered >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT registered_not_exceed_capacity CHECK (registered <= capacity),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Students table with improved constraints
CREATE TABLE Students (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    class_id INT,
    birth_date DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE SET NULL,
    CONSTRAINT valid_birth_date CHECK (birth_date <= CURRENT_DATE)
);

-- Parents table with improved constraints
CREATE TABLE Parents (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Payments table with improved structure
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE RESTRICT
);

-- Attendance tracking table
CREATE TABLE Attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
    UNIQUE (student_id, class_id, attendance_date)
);

-- Notifications table for tracking messages to parents
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    payment_id INT NOT NULL,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payments(id) ON DELETE CASCADE
);

-- Useful indexes
CREATE INDEX idx_students_class_id ON Students(class_id);
CREATE INDEX idx_students_registration_date ON Students(registration_date);
CREATE INDEX idx_students_active ON Students(active);
CREATE INDEX idx_parents_email ON Parents(email);
CREATE INDEX idx_payments_class_id ON Payments(class_id);
CREATE INDEX idx_payments_status ON Payments(status);
CREATE INDEX idx_payments_due_date ON Payments(due_date);
CREATE INDEX idx_attendance_student_class ON Attendance(student_id, class_id);
CREATE INDEX idx_attendance_date ON Attendance(attendance_date);
CREATE INDEX idx_notifications_student ON Notifications(student_id);
CREATE INDEX idx_notifications_payment ON Notifications(payment_id);
CREATE INDEX idx_notifications_unread ON Notifications(is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_unsent ON Notifications(is_sent) WHERE NOT is_sent;
CREATE INDEX idx_notifications_type ON Notifications(type);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON Classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON Students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at
    BEFORE UPDATE ON Parents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON Payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION create_payment_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for new pending payments
    IF (TG_OP = 'INSERT' AND NEW.status = 'pending') OR
       (TG_OP = 'UPDATE' AND NEW.status = 'pending' AND OLD.status != 'pending') THEN
        INSERT INTO Notifications (
            student_id,
            payment_id,
            type,
            message
        )
        VALUES (
            NEW.student_id,
            NEW.id,
            CASE 
                WHEN NEW.due_date < CURRENT_DATE THEN 'payment_overdue'
                ELSE 'payment_due'
            END,
            CASE 
                WHEN NEW.due_date < CURRENT_DATE 
                THEN format('Payment overdue for %s. Amount: $%s', 
                          (SELECT first_name || ' ' || last_name FROM Students WHERE id = NEW.student_id),
                          NEW.amount)
                ELSE format('Payment due for %s. Amount: $%s, Due date: %s', 
                          (SELECT first_name || ' ' || last_name FROM Students WHERE id = NEW.student_id),
                          NEW.amount,
                          NEW.due_date)
            END
        );
    -- Create notification for payment status changes
    ELSIF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
        INSERT INTO Notifications (
            student_id,
            payment_id,
            type,
            message
        )
        VALUES (
            NEW.student_id,
            NEW.id,
            CASE 
                WHEN NEW.status = 'completed' THEN 'payment_received'
                WHEN NEW.status = 'failed' THEN 'payment_failed'
                ELSE 'payment_due'
            END,
            format('Payment status changed to %s for %s. Amount: $%s', 
                   NEW.status,
                   (SELECT first_name || ' ' || last_name FROM Students WHERE id = NEW.student_id),
                   NEW.amount)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- New trigger for payment notifications
CREATE TRIGGER payment_notification_trigger
    AFTER INSERT OR UPDATE ON Payments
    FOR EACH ROW
    EXECUTE FUNCTION create_payment_notification();