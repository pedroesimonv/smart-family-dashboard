require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
// Nuevas importaciones para WebSockets
const http = require('http');
const { Server } = require('socket.io');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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

/**
 * Inicializa la escucha de eventos WebSocket para tiempo real.
 * Cuando un cliente se conecta, queda a la espera. Las rutas HTTP emitirán 
 * el evento 'tasks_updated' a través de esta instancia para notificar cambios.
 * @event connection
 * @param {Socket} socket - Instancia de conexión individual del cliente.
 */
io.on('connection', (socket) => {
    console.log(`🔌 Nuevo cliente conectado. ID: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado. ID: ${socket.id}`);
    });
});

// Configuración básica de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Family Dashboard API',
      version: '1.0.0',
      description: 'API REST para el muro de tareas del hogar',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`
      },
    ],
  },
  apis: ['./server.js'], // Le decimos que busque la documentación en este mismo archivo
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ENDPOINTS CRUD (Ticket 12: Emitiendo eventos) ---

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtiene la lista de todas las tareas
 *     responses:
 *       200:
   *         description: Array de tareas devuelto con éxito
 */

app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Comprar pienso para el perrete"
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 */
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Cambia el estado de una tarea (completada/pendiente)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
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
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea del muro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
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