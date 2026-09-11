export default function PostItCard({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between bg-black/10 p-4 md:p-6 rounded-xl border border-gray-200/10 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <input 
          type="checkbox" 
          checked={task.is_completed} 
          onChange={() => onToggle(task.id, task.is_completed)}
          className="w-6 h-6 md:w-8 md:h-8 cursor-pointer accent-blue-600"
        />
        {/*el string vacío si no está completada */}
        <span className={`md:text-2xl font-medium ${task.is_completed ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </span>
      </div>
      <button 
        onClick={() => onDelete(task.id)} 
        className="text-red-500 hover:text-red-700 font-bold md:text-2xl p-2"
        aria-label="Borrar tarea"
      >
        ✕
      </button>
    </li>
  );
}