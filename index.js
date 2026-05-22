const express = require('express');
const { Pool } = require('pg');
const app = express();

// Use Render's port
const port = process.env.PORT || 3000;

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// Connect to Render PostgreSQL Database
// ssl: { rejectUnauthorized: false } is often required for cloud DB connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Automatically create a 'visitors' table when the server starts
pool.query(`CREATE TABLE IF NOT EXISTS visitors (id SERIAL PRIMARY KEY, name VARCHAR(100), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
    .then(() => console.log("Database table verified!"))
    .catch(err => console.error("DB Init Error:", err));

// READ: Show the webpage with data from the database
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM visitors ORDER BY time DESC');

        let html = `<div style="font-family: Arial; padding: 20px;">`;
        html += `<h1>SWE40006 High Distinction - Render Database</h1>`;
        html += `<form method="POST" action="/add">
                    <input type="text" name="name" placeholder="Enter your name" required> 
                    <button type="submit">Sign Guestbook</button>
                 </form><br>`;
        html += `<h3>Visitor Log:</h3><ul>`;

        // Loop through the database rows and display them
        result.rows.forEach(row => { 
            html += `<li><strong>${row.name}</strong> - ${row.time.toLocaleString()}</li>`; 
        });

        html += `</ul></div>`;
        res.send(html);
    } catch (err) {
        res.send("Database connection error: " + err);
    }
});

// WRITE: Save user input into the database
app.post('/add', async (req, res) => {
    try {
        await pool.query('INSERT INTO visitors (name) VALUES ($1)', [req.body.name]);
        res.redirect('/'); // Refresh the page to show the new name
    } catch (err) {
        res.send("Error saving data.");
    }
});

app.listen(port, () => console.log(`HD App running on port ${port}`));