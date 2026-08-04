import { motion } from 'framer-motion';
import ProgressBar from '../../Admin/components/ProgressBar';

export default function GoalCard({ goal }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{goal.title}</h4>
        <span className="text-xs text-neutral-400">{goal.deadline}</span>
      </div>
      <ProgressBar label={goal.description} value={goal.progress} max={100} />
    </motion.div>
  );
}