export default function ActionBtn({ label, onClick, variant = 'primary', icon }) {
  // Clases base compartidas: altura masiva, bordes redondeados y efecto de pulsación
  const baseStyles = "h-[56px] w-full flex items-center justify-center gap-2 rounded-2xl text-lg md:text-xl font-bold transition-all active:scale-95 shadow-md";
  
  // Diccionario de temas según el sistema de diseño (Ticket UI-2)
  const variants = {
    primary: "bg-[var(--color-action-emerald)] text-white hover:opacity-90", // Verde para paseos
    secondary: "bg-[var(--color-action-amber)] text-white hover:opacity-90", // Ámbar para comidas
    outline: "border-2 border-gray-200/20 text-gray-700 bg-transparent hover:bg-black/5" // Botón secundario neutro
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant] || variants.primary}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {label}
    </button>
  );
}