import { motion } from 'framer-motion';

const achievements = [
  { 
    id: 'asistencia',
    icon: '🏆', 
    label: 'Asistencia Perfecta', 
    color: 'from-yellow-400 to-yellow-600',
    description: 'Estudiantes con 100% de asistencia en el mes',
    emoji: '⭐'
  },
  { 
    id: 'tecnica',
    icon: '⭐', 
    label: 'Mejor Técnica', 
    color: 'from-blue-400 to-blue-600',
    description: 'Estudiantes con mejor promedio en técnica',
    emoji: '⚽'
  },
  { 
    id: 'progreso',
    icon: '🎯', 
    label: 'Mayor Progreso', 
    color: 'from-green-400 to-green-600',
    description: 'Estudiantes que más han mejorado',
    emoji: '📈'
  },
  { 
    id: 'companero',
    icon: '🤝', 
    label: 'Mejor Compañero', 
    color: 'from-purple-400 to-purple-600',
    description: 'Estudiantes con mejor actitud y trabajo en equipo',
    emoji: '❤️'
  },
];

export default function AchievementBadge({ onSelect, selectedId, estudiantes = [] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {achievements.map((item) => {
        // Contar estudiantes que tienen este logro
        const count = estudiantes.filter(e => e.logros?.includes(item.id)).length || 0;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * achievements.indexOf(item) }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect && onSelect(item.id)}
            className={`px-4 py-2.5 bg-gradient-to-r ${item.color} text-white rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedId === item.id ? 'ring-4 ring-white ring-offset-2 scale-105' : ''
            }`}
            title={item.description}
          >
            <span className="text-lg mr-2">{item.icon}</span>
            <span className="text-xs font-semibold">{item.label}</span>
            {count > 0 && (
              <span className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                {count} 🎖️
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}