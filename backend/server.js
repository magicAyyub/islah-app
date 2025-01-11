const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

// Autoriser toutes les requêtes depuis ton frontend
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));


// Configuration de la connexion à la base de données
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

// Route de test
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de l\'École Islah' });
});

// CRUD Routes pour les étudiants

// Route pour créer un nouvel étudiant
app.post('/api/students', async (req, res) => {
const { last_name, first_name, class_id, birth_date, registration_date } = req.body;
try {
    const { rows } = await pool.query(
    'INSERT INTO Students (last_name, first_name, class_id, birth_date, registration_date) VALUES ($1, $2, $3, $4, $5)',
    [last_name, first_name, class_id, birth_date, registration_date]
    );
    console.log(rows);
    res.status(201).json(rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour obtenir tous les étudiants
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour mettre à jour un étudiant
app.put('/api/students/:id', async (req, res) => {
const { id } = req.params;
const { last_name, first_name, class_id, birth_date, registration_date } = req.body;
try {
const { rows } = await pool.query(
    'UPDATE Students SET last_name = $1, first_name = $2, class_id = $3, birth_date = $4, registration_date = $5 WHERE id = $6 RETURNING *',
    [last_name, first_name, class_id, birth_date, registration_date, id]
);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour supprimer un étudiant
app.delete('/api/students/:id', async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM Students WHERE id = $1', [id]);
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// CRUD Routes pour les classes

// Route pour créer une nouvelle classe
app.post('/api/classes', async (req, res) => {
const { name, teacher, capacity, registered } = req.body;
try {
const { rows } = await pool.query(
    'INSERT INTO Classes (name, teacher, capacity, registered) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, teacher, capacity, registered]
);
res.status(202).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour obtenir toutes les classes
app.get('/api/classes', async (req, res) => {
try {
const { rows } = await pool.query('SELECT * FROM Classes');
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour mettre à jour une classe
app.put('/api/classes/:id', async (req, res) => {
const { id } = req.params;
const { name, teacher, capacity, registered } = req.body;
try {
const { rows } = await pool.query(
    'UPDATE Classes SET name = $1, teacher = $2, capacity = $3, registered = $4 WHERE id = $5 RETURNING *',
    [name, teacher, capacity, registered, id]
);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour supprimer une classe
app.delete('/api/classes/:id', async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM Classes WHERE id = $1', [id]);
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// CRUD Routes pour les parents

// Route pour créer un nouveau parent
app.post('/api/parents', async (req, res) => {
const { last_name, first_name, email, phone, registration_date } = req.body;
try {
const { rows } = await pool.query(
    'INSERT INTO Parents (last_name, first_name, email, phone, registration_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [last_name, first_name, email, phone, registration_date]
);
res.status(201).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour obtenir tous les parents
app.get('/api/parents', async (req, res) => {
try {
const { rows } = await pool.query('SELECT * FROM Parents');
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour mettre à jour un parent
app.put('/api/parents/:id', async (req, res) => {
const { id } = req.params;
const { last_name, first_name, email, phone, registration_date } = req.body;
try {
const { rows } = await pool.query(
    'UPDATE Parents SET last_name = $1, first_name = $2, email = $3, phone = $4, registration_date = $5 WHERE id = $6 RETURNING *',
    [last_name, first_name, email, phone, registration_date, id]
);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour supprimer un parent
app.delete('/api/parents/:id', async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM Parents WHERE id = $1', [id]);
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// CRUD Routes pour les paiements

// Route pour créer un nouveau paiement
app.post('/api/payments', async (req, res) => {
const { student_id, class_id, amount, date, status } = req.body;
try {
const { rows } = await pool.query(
    'INSERT INTO Payments (student_id, class_id, amount, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [student_id, class_id, amount, date, status]
);
res.status(201).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour obtenir tous les paiements
app.get('/api/payments', async (req, res) => {
try {
const { rows } = await pool.query('SELECT * FROM Payments');
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour mettre à jour un paiement
app.put('/api/payments/:id', async (req, res) => {
const { id } = req.params;
const { student_id, class_id, amount, date, status } = req.body;
try {
const { rows } = await pool.query(
    'UPDATE Payments SET student_id = $1, class_id = $2, amount = $3, date = $4, status = $5 WHERE id = $6 RETURNING *',
    [student_id, class_id, amount, date, status, id]
);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Route pour supprimer un paiement
app.delete('/api/payments/:id', async (req, res) => {
const { id } = req.params;
try {
await pool.query('DELETE FROM Payments WHERE id = $1', [id]);
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erreur serveur' });
}
});

// Recherche d'un étudiant par terme
app.get('/api/students?search=:term', async (req, res) => {
    const { term } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM students WHERE last_name LIKE $1 OR first_name LIKE $1', [`%${term}%`]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
    });


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});