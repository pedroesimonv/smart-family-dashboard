import { useState, useEffect } from 'react';
import { socket } from './socket';
import DogDashboard from './DogDashboard';
import ShoppingList from './ShoppingList';
import './index.css';
import PostItCard from './PostItCard';

function App() {
  // --- 1. ESTADOS ---
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

  // --- 2. EFECTOS (Ciclo de vida) ---
  
  // Vigilante de resolución (Tema dinámico)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carga inicial de tareas
  useEffect(() => {
    fetchTasks();
  }, []);

  // Escucha de WebSockets
  useEffect(() => {
    socket.on('tasks_updated', () => fetchTasks());
    return () => socket.off('tasks_updated');
  }, []);

  // --- 3. FUNCIONES DE LÓGICA ---
  
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL, { headers: { 'ngrok-skip-browser-warning': 'true' } });
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
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
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ title: newTask })
      });
      setNewTask('');
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  // --- 4. RENDERIZADO (El return único) ---
  
 const themeClass = isMobile 
    ? 'bg-[var(--color-dashboard-bg)] text-gray-900' 
    : 'bg-[var(--color-corkboard-bg)] text-[var(--color-corkboard-text)]';

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${themeClass} p-4 md:p-8`}>
      {/* Contenedor principal: grid asimétrico en pantallas grandes */}
      <div className="max-w-md mx-auto md:max-w-7xl grid grid-cols-1 md:grid-cols-10 gap-6 md:gap-10">
        
        {/* Columna Izquierda: Muro de Tareas (60% -> col-span-6) */}
        <section className="md:col-span-6 bg-white/5 p-6 md:p-10 rounded-2xl shadow-xl backdrop-blur-sm border border-white/10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-8 md:mb-12 tracking-tight">
            Muro de Tareas
          </h1>
          
          <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3 mb-10">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Ej. Comprar pienso para el perrete..."
              className="flex-1 border-2 border-gray-200/20 bg-transparent rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 md:py-4 rounded-xl md:text-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
              Añadir Tarea
            </button>
          </form>

          <ul className="flex flex-col gap-4 mb-8">
            {tasks.map(task => (
              <PostItCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
              />
            ))}
          </ul>

          {tasks.length === 0 && (
            <p className="text-center opacity-70 md:text-xl mb-8">El muro está despejado. ¡Buen trabajo!</p>
          )}
        </section>
        
        {/* Columna Derecha: Controles Rápidos (40% -> col-span-4) */}
        <aside className="md:col-span-4 flex flex-col gap-6 md:gap-8">
          <DogDashboard />
          <ShoppingList />
        </aside>

      </div>
    </div>
  );
}

export default App;