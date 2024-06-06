const express = require('express');
const db = require('./db/connectDB');
require('dotenv').config();

const app = express();
app.use(express.json());

// Get all notes
app.get('/api/v1/notes', async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM notes");
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the database');
    }
});

// Get a single note
app.get('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [data] = await db.query(
            `SELECT * FROM notes WHERE id = ?`, [id]
        );
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the database');
    }
});

// Insert new note
app.post('/api/v1/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const [data] = await db.query(
            `INSERT INTO notes (title, contents) VALUES (?, ?)`,
            [title, content]
        );
        res.send({ message: "note created", noteID: data.insertId });
    } catch (error) {
        res.status(500).send('Error creating data in the database');
    }
});

// Update note
app.patch('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const [result] = await db.query(
            `UPDATE notes SET title = ?, contents = ? WHERE id = ?`,
            [title, content, id]
        );
        res.send({ message: "Note updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating data in the database');
    }
});

// Delete note
app.delete('/api/v1/note/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            `DELETE FROM notes WHERE id = ?`,
            [id]
        );
        res.send({ message: "deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting data in the database');
    }
});

app.listen(3000, () => {
    console.log('Server running at port 3000');
});
