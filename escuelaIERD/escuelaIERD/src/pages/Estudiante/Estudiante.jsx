import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from '../../components/common/ProfileModal';
import GoalCard from './components/GoalCard';
import StudentStats from './components/StudentStats';

export default function Estudiante() {
  const { user, logout, updateProfile } = useAuth();
  const { data, getNotasByEstudiante, getAsistenciasByEstudiante, getPromedioByEstudiante } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inicio');

  // ===== ESTADO PARA EL PERFIL =====
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    nombre: user?.displayName || user?.nombre || '',
    apodo: user?.apodo || '',
    email: user?.user || user?.email || '',
    telefono: user?.telefono || '',
    cumpleanos: user?.cumpleanos || '',
    foto: user?.foto || '',
    rol: user?.role || ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileSave = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        alert('✅ Perfil actualizado correctamente');
        setShowProfile(false);
        const updatedUser = result.user;
        setUserData({
          nombre: updatedUser.nombre || updatedUser.displayName || '',
          apodo: updatedUser.apodo || '',
          email: updatedUser.email || updatedUser.user || '',
          telefono: updatedUser.telefono || '',
          cumpleanos: updatedUser.cumpleanos || '',
          foto: updatedUser.foto || '',
          rol: updatedUser.role || ''
        });
        window.location.reload();
      } else {
        alert('❌ Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('❌ Error al actualizar el perfil');
    }
  };

  // Buscar el ID del estudiante actual
  const estudianteActual = data.estudiantes?.find(
    e => e.nombre?.toLowerCase() === user?.displayName?.toLowerCase() || 
         e.nombre === user?.displayName ||
         e.nombre?.toLowerCase() === user?.childKey?.toLowerCase()
  );

  const estudianteId = estudianteActual?.id;
  const notas = estudianteId ? getNotasByEstudiante(estudianteId) : [];
  const asistencias = estudianteId ? getAsistenciasByEstudiante(estudianteId) : [];
  const promedio = estudianteId ? getPromedioByEstudiante(estudianteId) : 0;

  const menuItems = [
    { id: 'inicio', label: '🏠 Inicio', icon: '🏠' },
    { id: 'perfil', label: '👤 Mi Perfil', icon: '👤' },
    { id: 'horario', label: '📅 Mi Horario', icon: '📅' },
    { id: 'notas', label: '📊 Mis Notas', icon: '📊' },
    { id: 'asistencia', label: '✅ Mi Asistencia', icon: '✅' },
  ];

  const horario = [
    { dia: 'Lunes', horario: '4:00 - 5:30 PM', tema: 'Técnica de pase' },
    { dia: 'Miércoles', horario: '4:00 - 5:30 PM', tema: 'Juego reducido' },
    { dia: 'Viernes', horario: '4:00 - 5:30 PM', tema: 'Partido interno' },
  ];

  const goals = [
    { id: 1, title: 'Mejorar técnica de pase', description: 'Precisión en pases cortos', progress: 75, deadline: '15 Feb 2025' },
    { id: 2, title: 'Asistencia perfecta', description: 'No faltar a ningún entrenamiento', progress: 60, deadline: '28 Feb 2025' },
    { id: 3, title: 'Subir promedio', description: 'Alcanzar 4.5 de promedio general', progress: 45, deadline: '15 Mar 2025' },
  ];

  const studentStats = [
    { icon: 'lucide:star', value: promedio || 0, label: 'Promedio' },
    { icon: 'lucide:calendar', value: horario.length, label: 'Sesiones/Semana' },
    { icon: 'lucide:clipboard-check', value: asistencias.length > 0 ? Math.round((asistencias.filter(a => a.estado === 'Presente').length / asistencias.length) * 100) : 0, label: 'Asistencia %' },
    { icon: 'lucide:trophy', value: notas.length > 0 ? Math.max(...notas.map(n => (n.tecnica + n.tactica + n.actitud) / 3)) : 0, label: 'Mejor Nota' }
  ];

  const estadoCfg = {
    'Presente': { label: 'Presente', color: 'bg-club-green-50 text-club-green' },
    'Ausente': { label: 'Ausente', color: 'bg-club-red-50 text-club-red' },
    'Justificado': { label: 'Justificado', color: 'bg-club-amber-50 text-club-amber' }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-club-green/90 to-club-dark-2 rounded-2xl p-8 text-white mb-6">
              <h2 className="text-2xl font-bold">¡Bienvenido, {user?.displayName || 'Estudiante'}! ⚽</h2>
              <p className="text-white/70 mt-2">Sigue entrenando con pasión y disciplina. ¡Tú puedes!</p>
            </div>

            <StudentStats stats={studentStats} />

            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>🎯</span> Mis Metas
                </h3>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>📈</span> Progreso Semanal
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Asistencia</span>
                      <span className="font-bold text-club-green">
                        {asistencias.length > 0 ? Math.round((asistencias.filter(a => a.estado === 'Presente').length / asistencias.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${asistencias.length > 0 ? Math.round((asistencias.filter(a => a.estado === 'Presente').length / asistencias.length) * 100) : 0}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-club-green rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Promedio General</span>
                      <span className="font-bold text-club-orange">{promedio || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((promedio || 0) / 5) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-club-orange rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-club-green-50 rounded-xl">
                  <p className="text-xs text-club-green font-medium">💡 Consejo: La práctica constante es la clave del éxito. ¡Sigue así!</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'perfil':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
          >
            <h2 className="font-semibold text-lg mb-6">👤 Mi Perfil</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-club-green-50 rounded-2xl flex items-center justify-center text-3xl font-bold text-club-green">
                {user?.displayName?.charAt(0) || 'E'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user?.displayName || 'Estudiante'}</h3>
                <p className="text-sm text-neutral-500">{estudianteActual?.grupo || 'Sin categoría'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-xs text-neutral-400">Documento</p>
                <p className="font-semibold">{estudianteActual?.documento || '-'}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-xs text-neutral-400">Acudiente</p>
                <p className="font-semibold">{estudianteActual?.acudiente || '-'}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-xs text-neutral-400">Categoría</p>
                <p className="font-semibold">{estudianteActual?.grupo || '-'}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-xs text-neutral-400">Estado</p>
                <p className="font-semibold">{estudianteActual?.estado || 'Activo'}</p>
              </div>
            </div>
          </motion.div>
        );

      case 'horario':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
          >
            <h2 className="font-semibold text-lg mb-6">📅 Mi Horario</h2>
            <div className="space-y-3">
              {horario.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{item.dia}</p>
                    <p className="text-sm text-neutral-500">{item.horario}</p>
                  </div>
                  <p className="text-sm text-club-green font-medium">{item.tema}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'notas':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
          >
            <h2 className="font-semibold text-lg mb-6">📊 Mis Notas</h2>
            {notas.length === 0 ? (
              <p className="text-center text-neutral-400 py-8">No hay notas registradas</p>
            ) : (
              <div className="space-y-3">
                {notas.map((item, index) => {
                  const promedioNota = ((item.tecnica + item.tactica + item.actitud) / 3).toFixed(1);
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{item.fecha}</p>
                        <div className="flex gap-4 text-xs text-neutral-500 mt-1">
                          <span>Técnica: {item.tecnica}</span>
                          <span>Táctica: {item.tactica}</span>
                          <span>Actitud: {item.actitud}</span>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${
                        parseFloat(promedioNota) >= 4 ? 'text-club-green' :
                        parseFloat(promedioNota) >= 3 ? 'text-club-amber' : 'text-club-red'
                      }`}>
                        {promedioNota}/5
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );

      case 'asistencia':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
          >
            <h2 className="font-semibold text-lg mb-6">✅ Mi Asistencia</h2>
            {asistencias.length === 0 ? (
              <p className="text-center text-neutral-400 py-8">No hay registros de asistencia</p>
            ) : (
              <div className="space-y-3">
                {asistencias.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <p className="font-semibold">{item.fecha}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${estadoCfg[item.estado]?.color || 'bg-stone-50 text-stone-400'}`}>
                      {estadoCfg[item.estado]?.label || item.estado}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-club-dark-2 min-h-screen p-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
        <div className="mb-8">
          <img 
            src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" 
            alt="IERD" 
            className="h-10 mx-auto"
          />
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <p className="text-white font-semibold">{user?.displayName || user?.nombre || 'Estudiante'}</p>
          <p className="text-xs text-white/40">{estudianteActual?.grupo || 'Sin categoría'}</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-club-green/20 text-club-green-light' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Inicio'}
              </h1>
              <p className="text-sm text-neutral-500">Bienvenido a tu panel estudiantil</p>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 hover:bg-stone-100 p-2 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-700">
                  {user?.displayName || user?.nombre || 'Estudiante'}
                </p>
                <p className="text-[11px] text-neutral-400">Estudiante</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm overflow-hidden" style={{ background: '#1B5E20' }}>
                {user?.foto ? (
                  <img src={user.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  user?.displayName?.charAt(0) || user?.nombre?.charAt(0) || '👤'
                )}
              </div>
            </button>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Modal de Perfil */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userData={userData}
        onSave={handleProfileSave}
        onLogout={handleLogout}
        blockedFields={['nombre', 'email', 'cumpleanos', 'rol']}
      />
    </div>
  );
}