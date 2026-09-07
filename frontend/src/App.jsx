import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = 'http://localhost:3000/api/tasks';

  // GET: Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  // POST: Añadir tarea
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask })
      });
      const savedTask = await res.json();
      setTasks([savedTask, ...tasks]); // Actualiza UI instantáneamente
      setNewTask('');
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  // PUT: Marcar como completada
  const toggleTask = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentStatus })
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, is_completed: !currentStatus } : task
      ));
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  // DELETE: Borrar tarea
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Muro de Tareas</h1>
      
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ej. Comprar pienso para el perrete"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Añadir
        </button>
      </form>

      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.is_completed} 
                onChange={() => toggleTask(task.id, task.is_completed)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className={`${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              X
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No hay tareas pendientes.</p>
        )}
      </ul>
    </div>
  );
}

export default App;