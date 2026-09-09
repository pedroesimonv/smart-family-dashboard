import { useState, useEffect } from 'react';
import { socket } from './socket';

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const API_URL = `${import.meta.env.VITE_API_URL}/api/shopping`;

  const fetchShopping = async () => {
    try {
      const res = await fetch(API_URL, { headers: { 'ngrok-skip-browser-warning': 'true' } });
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (error) {
      console.error("Error cargando compras:", error);
    }
  };

  useEffect(() => {
    fetchShopping();
    socket.on('shopping_updated', fetchShopping);
    return () => socket.off('shopping_updated', fetchShopping);
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ item_name: newItem })
      });
      setNewItem('');
    } catch (error) {
      console.error("Error añadiendo artículo:", error);
    }
  };

  const toggleItem = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ is_bought: !currentStatus })
      });
    } catch (error) {
      console.error("Error tachando artículo:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        🛒 Lista de la Compra
      </h2>

      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="¿Qué falta en casa?"
          className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors active:scale-95"
        >
          Añadir
        </button>
      </form>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center text-sm py-4">Todo comprado. ¡Buen trabajo!</p>
        ) : (
          items.map(item => (
            <li 
              key={item.id} 
              onClick={() => toggleItem(item.id, item.is_bought)}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                item.is_bought 
                  ? 'bg-gray-50 border-transparent opacity-50' 
                  : 'bg-white border-gray-100 shadow-sm hover:border-blue-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                item.is_bought ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {item.is_bought && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <span className={`font-medium ${
                item.is_bought ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}>
                {item.item_name}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}