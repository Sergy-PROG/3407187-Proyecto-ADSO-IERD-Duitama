import { motion } from 'framer-motion';
import ProgressBar from '../../Admin/components/ProgressBar';

export default function StudentProgressCard({ student }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-4">
        {student.foto ? (
          <img src={student.foto} alt={student.nombre} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 bg-club-green-50 rounded-full flex items-center justify-center text-club-green font-bold text-lg">
            {student.nombre?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <p className="font-semibold">{student.nombre}</p>
          <p className="text-xs text-neutral-400">{student.grupo}</p>
        </div>
        <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${student.estado === 'Activo' ? 'bg-club-green-50 text-club-green' : 'bg-club-red-50 text-club-red'}`}>
          {student.estado}
        </span>
      </div>
      <div className="space-y-3">
        <ProgressBar label="Técnica" value={student.tecnica || 3} max={5} color="bg-club-green" />
        <ProgressBar label="Táctica" value={student.tactica || 3} max={5} color="bg-club-orange" />
        <ProgressBar label="Actitud" value={student.actitud || 3} max={5} color="bg-blue-600" />
      </div>
    </motion.div>
  );
}