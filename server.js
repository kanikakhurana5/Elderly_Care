const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saloni@1234',
    database: 'elderly_care'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// Endpoint to get caregivers from the database
app.get('/api/caregivers', (req, res) => {
    db.query('SELECT * FROM caregivers', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching caregivers');
        }
        console.log('Caregivers fetched:', results); // Log to verify the result
        res.json(results);
    });
});

// Route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
