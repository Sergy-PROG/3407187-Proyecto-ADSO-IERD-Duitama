import { motion } from 'framer-motion';

export default function ProgressBar({ label, value, max = 100, color = 'bg-club-green' }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-semibold text-neutral-500">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}