const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones

// Creación del Pool de conexiones
const db = mysql.createPool({
    host: 'localhost', // Como Node corre en mi PC y MySQL en Docker, se comunican por localhost
    user: 'admin_family',
    password: 'user_password_segura',
    database: 'smart_family_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Comprobar la conexión al iniciar
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Base de datos conectada correctamente.');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
}
testConnection();

// GET: Obtener todas las tareas
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Crear una nueva tarea
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'El título es obligatorio' });
        }
        
        const [result] = await db.query('INSERT INTO tasks (title) VALUES (?)', [title]);
        res.status(201).json({ id: result.insertId, title, is_completed: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Actualizar el estado de una tarea (completada o no)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;
        
        await db.query('UPDATE tasks SET is_completed = ? WHERE id = ?', [is_completed, id]);
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Eliminar una tarea
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
});

// Exportamos db para poder usarlo en el Ticket 6
module.exports = db;