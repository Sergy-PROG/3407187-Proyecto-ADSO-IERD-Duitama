import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function StatsCard({ title, value, icon, color, subtitle, change }) {
  const colors = {
    green: 'bg-club-green-50 text-club-green',
    orange: 'bg-club-orange-50 text-club-orange',
    red: 'bg-club-red-50 text-club-red',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon icon={icon} className="text-xl" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change > 0 ? 'bg-club-green-50 text-club-green' : 'bg-club-red-50 text-club-red'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-neutral-800">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}