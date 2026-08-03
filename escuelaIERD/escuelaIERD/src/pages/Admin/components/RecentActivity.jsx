import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const activities = [
  { icon: 'lucide:user-plus', text: 'Nuevo estudiante: Santiago Pérez', time: 'Hace 2 horas', color: 'text-club-green' },
  { icon: 'lucide:credit-card', text: 'Pago registrado: $120,000', time: 'Hace 4 horas', color: 'text-club-orange' },
  { icon: 'lucide:check-circle', text: 'Asistencia completada: 15/15', time: 'Hace 6 horas', color: 'text-blue-600' },
  { icon: 'lucide:edit', text: 'Notas actualizadas: Juvenil', time: 'Hace 8 horas', color: 'text-purple-600' },
];

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Icon icon="lucide:activity" className="text-club-green" />
        Actividad Reciente
      </h3>
      <div className="space-y-3">
        {activities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white ${item.color}`}>
              <Icon icon={item.icon} className="text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">{item.text}</p>
              <p className="text-xs text-neutral-400">{item.time}</p>
            </div>
            <span className="w-2 h-2 bg-club-green rounded-full animate-pulse"></span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}