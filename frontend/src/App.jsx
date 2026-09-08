import { useState, useEffect } from 'react';
import { socket } from './socket'; // Importamos la conexión

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

  // 1. Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Escuchar cambios en tiempo real
  useEffect(() => {
    socket.on('tasks_updated', () => {
      fetchTasks(); // Si alguien cambia algo, recargamos la lista
    });

    // Limpieza: dejamos de escuchar si el componente se desmonta
    return () => {
      socket.off('tasks_updated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      // Añadida cabecera para esquivar advertencia de Ngrok en GET
      const res = await fetch(API_URL, {
        headers: { 
          'ngrok-skip-browser-warning': 'true' 
        }
      });
      const data = await res.json();
      
      // SOLO actualizamos si es un array. Si es un error del servidor, lo ignoramos.
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("El servidor no devolvió una lista válida:", data);
      }
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Añadida cabecera en POST
        },
        body: JSON.stringify({ title: newTask })
      });
      setNewTask(''); // Solo limpiamos el input, la lista se actualiza sola por Sockets
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Añadida cabecera en PUT
        },
        body: JSON.stringify({ is_completed: !currentStatus })
      });
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 
          'ngrok-skip-browser-warning': 'true' // Añadida cabecera en DELETE
        }
      });
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Contenedor: estrecho en móvil, ancho en TV */}
      <div className="max-w-md mx-auto md:max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-xl">
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-8 md:mb-12 text-gray-800 tracking-tight">
          Muro de Tareas
        </h1>
        
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3 mb-10">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Ej. Comprar pienso para el perrete..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 md:py-4 md:text-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-3 md:py-4 rounded-xl md:text-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Añadir Tarea
          </button>
        </form>

        {/* Lista: Columna única en móvil, 2 columnas en TV */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={task.is_completed} 
                  onChange={() => toggleTask(task.id, task.is_completed)}
                  className="w-6 h-6 md:w-8 md:h-8 cursor-pointer accent-blue-600"
                />
                <span className={`md:text-2xl font-medium ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-bold md:text-2xl p-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 md:text-xl mt-8">El muro está despejado. ¡Buen trabajo!</p>
        )}
      </div>
    </div>
  );
}

export default App;