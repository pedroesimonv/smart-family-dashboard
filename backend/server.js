require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
// Nuevas importaciones para WebSockets
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP y acoplar Socket.io con permisos de CORS
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // El puerto de tu frontend (Vite)
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors({ origin: "*" }));
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Escuchar conexiones de clientes (Ticket 10)
io.on('connection', (socket) => {
    console.log(`🔌 Nuevo cliente conectado. ID: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado. ID: ${socket.id}`);
    });
});

// --- ENDPOINTS CRUD (Ticket 12: Emitiendo eventos) ---

app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        const [result] = await db.query('INSERT INTO tasks (title) VALUES (?)', [title]);
        
        // Avisar a TODOS los clientes conectados que hay cambios
        io.emit('tasks_updated'); 
        
        res.status(201).json({ id: result.insertId, title, is_completed: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;
        await db.query('UPDATE tasks SET is_completed = ? WHERE id = ?', [is_completed, id]);
        
        io.emit('tasks_updated');
        
        res.json({ message: 'Tarea actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        
        io.emit('tasks_updated');
        
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ¡Ojo! Ahora usamos server.listen en lugar de app.listen
server.listen(PORT, () => {
    console.log(`🚀 Servidor y WebSockets corriendo en puerto ${PORT}`);
});