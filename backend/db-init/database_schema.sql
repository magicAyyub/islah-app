CREATE TABLE Classes (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
teacher VARCHAR(100),
capacity INT,
registered INT
);

CREATE TABLE Students (
id SERIAL PRIMARY KEY,
last_name VARCHAR(100),
first_name VARCHAR(100),
class_id INT,
birth_date DATE,
registration_date TIMESTAMP,
FOREIGN KEY (class_id) REFERENCES Classes(id)
);

CREATE TABLE Parents (
id SERIAL PRIMARY KEY ,
last_name VARCHAR(100),
first_name VARCHAR(100),
email VARCHAR(100),
phone VARCHAR(20),
registration_date TIMESTAMP
);

CREATE TABLE Payments (
id SERIAL PRIMARY KEY,
student_id INT,
class_id INT,
amount DECIMAL(10, 2),
date TIMESTAMP,
status VARCHAR(50),
FOREIGN KEY (student_id) REFERENCES Students(id),
FOREIGN KEY (class_id) REFERENCES Classes(id)
);

CREATE INDEX idx_class_id ON Students(class_id);
CREATE INDEX idx_student_id ON Payments(student_id);
CREATE INDEX idx_class_id_payments ON Payments(class_id);

