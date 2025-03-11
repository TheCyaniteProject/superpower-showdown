"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');
const app = express();

// Use an appropriate port for Express (not 3306)
const port = process.env.PORT || 8080;

// Middleware configuration for request bodies and sessions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Open (or create) the SQLite database file. This will create a file named "rankings.db" in your project.
const db = new sqlite3.Database('./rankings.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite!');
});

// Create the "items" table (if it doesn’t exist)
db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    weight INTEGER DEFAULT 0
)`, (err) => {
    if (err) {
        console.error("Error creating the items table:", err);
        process.exit(1);
    }
    console.log("Items table is ready.");
});

// Middleware to protect admin routes.
function requireLogin(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Authentication endpoints
app.post('/api/login', (req, res) => {
    console.log("Received login request:", req.body);  // Debug log
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        req.session.loggedIn = true;
        return res.json({ success: true });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Get all items sorted by weight.
app.get('/api/items', (req, res) => {
    const query = 'SELECT * FROM items ORDER BY weight DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Update items after a vote.
// Note: We'll use db.serialize() to run the queries sequentially in a transaction.
app.post('/api/vote', (req, res) => {
    const { chosenId, unchosenId } = req.body;
    if (!chosenId || !unchosenId) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Increase the weight for the chosen item.
        db.run("UPDATE items SET weight = weight + 1 WHERE id = ?", [chosenId], function (err) {
            if (err) {
                db.run("ROLLBACK");
                console.error('Error updating chosen item:', err);
                return res.status(500).json({ error: 'Database error on chosen item' });
            }

            // Decrease the weight for the unchosen item.
            db.run("UPDATE items SET weight = weight - 1 WHERE id = ?", [unchosenId], function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    console.error('Error updating unchosen item:', err);
                    return res.status(500).json({ error: 'Database error on unchosen item' });
                }

                db.run("COMMIT", (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        console.error('Error committing transaction:', err);
                        return res.status(500).json({ error: 'Database commit error' });
                    }

                    // Return updated items.
                    const query = 'SELECT * FROM items ORDER BY weight DESC';
                    db.all(query, [], (err, rows) => {
                        if (err) {
                            console.error('Error retrieving updated items:', err);
                            return res.status(500).json({ error: 'Database error' });
                        }
                        res.json({ success: true, items: rows });
                    });
                });
            });
        });
    });
});

// Add a new item.
app.post('/api/addItem', (req, res) => {
    const { id, name, description, weight } = req.body;
    if (!id || !name) {
        return res.status(400).json({ error: 'Missing required fields: id and name' });
    }
    const insertQuery = 'INSERT INTO items (id, name, description, weight) VALUES (?, ?, ?, ?)';
    db.run(insertQuery, [id, name, description || '', weight || 0], function (err) {
        if (err) {
            console.error('Error inserting item:', err);
            return res.status(500).json({ error: 'Database error on insert' });
        }
        console.log('Item added successfully:', this.lastID);
        res.status(201).json({ success: true });
    });
});

// Remove an item.
app.delete('/api/removeItem/:id', requireLogin, (req, res) => {
    const itemId = req.params.id;
    const deleteQuery = 'DELETE FROM items WHERE id = ?';
    db.run(deleteQuery, [itemId], function (err) {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Database error on delete' });
        }
        res.json({ success: true });
    });
});

// Protect the admin route using the requireLogin middleware
app.get('/admin', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'admin.html'));
});

// Now serve the static front‑end files (HTML, CSS, JS, etc.) from the /public folder
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});