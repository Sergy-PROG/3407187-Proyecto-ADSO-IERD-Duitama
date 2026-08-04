import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function StudentStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm text-center"
        >
          <div className="w-12 h-12 mx-auto bg-club-green-50 rounded-xl flex items-center justify-center text-club-green text-xl mb-3">
            <Icon icon={stat.icon} />
          </div>
          <p className="text-2xl font-extrabold text-neutral-800">{stat.value}</p>
          <p className="text-sm text-neutral-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}