import { useState, useEffect } from 'react';
import { socket } from './socket';
import ActionBtn from './ActionBtn';

export default function DogDashboard() {
  const [logs, setLogs] = useState([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/api/dog-logs`;

  const fetchLogs = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (error) {
      console.error("Error cargando historial del perrete:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    socket.on('dog_updated', fetchLogs);
    
    return () => socket.off('dog_updated', fetchLogs);
  }, []);

  const addLog = async (eventType) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ event_type: eventType })
      });
    } catch (error) {
      console.error(`Error guardando ${eventType}:`, error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        🐾 Centro de Mando
      </h2>

      {/* Botones de acción rápida con el componente modular */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ActionBtn 
          label="Ha comido" 
          variant="secondary" 
          icon="🍖"
          onClick={() => addLog('comida')} 
        />
        <ActionBtn 
          label="Paseo" 
          variant="primary" 
          icon="🦮"
          onClick={() => addLog('paseo')} 
        />
      </div>

      {/* Historial cronológico */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-60 overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Últimos eventos</h3>
        <ul className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-gray-400 text-center text-sm py-4">Aún no hay registros hoy.</p>
          ) : (
            logs.map(log => (
              <li key={log.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  {log.event_type === 'comida' ? '🥩 Comida' : log.event_type === 'paseo' ? '🦮 Paseo' : '💊 Medicación'}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {formatTime(log.created_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}