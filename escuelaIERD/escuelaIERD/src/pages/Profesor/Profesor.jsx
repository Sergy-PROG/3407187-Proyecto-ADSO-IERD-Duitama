import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from '../../components/common/ProfileModal';
import StudentProgressCard from './components/StudentProgressCard';
import AchievementBadge from './components/AchievementBadge';

export default function Profesor() {
  const { user, logout, updateProfile } = useAuth();
  const { 
    data, 
    addEstudiante, updateEstudiante, deleteEstudiante,
    addAsistencia, updateAsistencia, deleteAsistencia,
    addNota, updateNota, deleteNota,
    getAsistenciasByGrupo,
    getNotasByGrupo,
    getPromedioByEstudiante,
    cargarDatos
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inicio');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState('Infantil');
  const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');

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

  // ===== ESTADO PARA EL CALENDARIO DE ASISTENCIA =====
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [añoActual, setAñoActual] = useState(hoy.getFullYear());

  // ===== ESTADO PARA LOGROS =====
  const [logroActivo, setLogroActivo] = useState(null);
  const [showLogroModal, setShowLogroModal] = useState(false);

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

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormError('');
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (modalType === 'estudiante') {
      if (!formData.nombre || !formData.documento || !formData.grupo) {
        setFormError('Nombre, documento y grupo son obligatorios');
        return;
      }
      
      const result = editingItem 
        ? await updateEstudiante(editingItem.id, formData)
        : await addEstudiante(formData);
      
      if (result.success) {
        closeModal();
        alert(editingItem ? '✅ Estudiante actualizado' : '✅ Estudiante creado');
        await cargarDatos();
      } else {
        setFormError(result.error || 'Error al guardar');
      }
    } else if (modalType === 'asistencia') {
      if (!formData.estudianteId || !formData.fecha || !formData.estado) {
        setFormError('Todos los campos son obligatorios');
        return;
      }
      const result = editingItem 
        ? await updateAsistencia(editingItem.id, formData)
        : await addAsistencia(formData);
      
      if (result.success) {
        closeModal();
        alert(editingItem ? '✅ Asistencia actualizada' : '✅ Asistencia registrada');
        await cargarDatos();
      } else {
        setFormError(result.error || 'Error al guardar');
      }
    } else if (modalType === 'nota') {
      console.log('📝 Guardando nota:', formData);
      
      if (!formData.estudianteId || !formData.fecha || !formData.tecnica || !formData.tactica || !formData.actitud) {
        setFormError('Todos los campos son obligatorios');
        console.log('❌ Campos faltantes');
        return;
      }
      
      const notaData = {
        estudianteId: parseInt(formData.estudianteId),
        fecha: formData.fecha,
        tecnica: parseFloat(formData.tecnica),
        tactica: parseFloat(formData.tactica),
        actitud: parseFloat(formData.actitud),
        grupo: selectedGrupo
      };
      console.log('📝 Datos a guardar:', notaData);
      
      const result = editingItem 
        ? await updateNota(editingItem.id, notaData)
        : await addNota(notaData);
      
      console.log('📝 Resultado:', result);
      
      if (result.success) {
        closeModal();
        alert(editingItem ? '✅ Nota actualizada' : '✅ Nota registrada');
        await cargarDatos();
      } else {
        setFormError(result.error || 'Error al guardar');
        console.log('❌ Error:', result.error);
      }
    }

    closeModal();
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      let result;
      if (type === 'estudiante') result = await deleteEstudiante(id);
      else if (type === 'asistencia') result = await deleteAsistencia(id);
      else if (type === 'nota') result = await deleteNota(id);
      
      if (result?.success) {
        alert('✅ Registro eliminado');
        await cargarDatos();
      } else {
        alert('❌ Error al eliminar');
      }
    }
  };

  const menuItems = [
    { id: 'inicio', label: '📊 Inicio', icon: '📊' },
    { id: 'estudiantes', label: '👨‍🎓 Estudiantes', icon: '👨‍🎓' },
    { id: 'asistencia', label: '✅ Asistencia', icon: '✅' },
    { id: 'notas', label: '📝 Notas', icon: '📝' },
  ];

  // ===== RENDER MODAL =====
  const renderModal = () => {
    if (!showModal) return null;

    let title = '';
    let fields = [];

    if (modalType === 'estudiante') {
      title = editingItem ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante';
      fields = [
        { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
        { name: 'documento', label: 'Documento', type: 'text', required: true },
        { name: 'grupo', label: 'Grupo', type: 'select', options: ['Infantil', 'Prejuvenil', 'Juvenil', 'Femenino'], required: true },
        { name: 'acudiente', label: 'Acudiente', type: 'text' },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
      ];
    } else if (modalType === 'asistencia') {
      title = editingItem ? '✏️ Editar Asistencia' : '➕ Nueva Asistencia';
      fields = [
        { name: 'estudianteId', label: 'Estudiante', type: 'select', options: data.estudiantes.filter(e => e.grupo === selectedGrupo).map(e => ({ value: e.id, label: e.nombre })), required: true },
        { name: 'fecha', label: 'Fecha', type: 'date', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Presente', 'Ausente', 'Justificado'], required: true },
      ];
    } else if (modalType === 'nota') {
      title = editingItem ? '✏️ Editar Nota' : '➕ Nueva Nota';
      fields = [
        { 
          name: 'estudianteId', 
          label: 'Estudiante', 
          type: 'select', 
          options: data.estudiantes.filter(e => e.grupo === selectedGrupo).map(e => ({ value: e.id, label: e.nombre })), 
          required: true 
        },
        { name: 'fecha', label: 'Fecha', type: 'date', required: true },
        { name: 'tecnica', label: 'Técnica (1-5)', type: 'number', required: true, min: 1, max: 5 },
        { name: 'tactica', label: 'Táctica (1-5)', type: 'number', required: true, min: 1, max: 5 },
        { name: 'actitud', label: 'Actitud (1-5)', type: 'number', required: true, min: 1, max: 5 },
      ];
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">{title}</h3>
            <button onClick={closeModal} className="p-2 hover:bg-stone-100 rounded-xl">✕</button>
          </div>

          {formError && (
            <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 mb-4 text-club-red-light text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-club-green outline-none"
                    required={field.required}
                  >
                    <option value="">Seleccionar...</option>
                    {field.options.map((opt) => (
                      typeof opt === 'string' ? (
                        <option key={opt} value={opt}>{opt}</option>
                      ) : (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleFormChange}
                    min={field.min}
                    max={field.max}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-club-green outline-none"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-club-green text-white font-semibold py-3 rounded-xl hover:bg-club-green-light transition-all">
                {editingItem ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={closeModal} className="px-6 py-3 bg-stone-100 text-neutral-600 font-semibold rounded-xl hover:bg-stone-200 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  // ===== RENDER LOGRO MODAL =====
  const renderLogroModal = () => {
    if (!showLogroModal || !logroActivo) return null;
    
    const logrosConfig = {
      'asistencia': { icon: '🏆', label: 'Asistencia Perfecta', color: 'from-yellow-400 to-yellow-600' },
      'tecnica': { icon: '⭐', label: 'Mejor Técnica', color: 'from-blue-400 to-blue-600' },
      'progreso': { icon: '🎯', label: 'Mayor Progreso', color: 'from-green-400 to-green-600' },
      'companero': { icon: '🤝', label: 'Mejor Compañero', color: 'from-purple-400 to-purple-600' },
    };
    
    const logroInfo = logrosConfig[logroActivo];
    const estudiantes = data.estudiantes?.filter(e => e.grupo === selectedGrupo) || [];
    const estudiantesConLogro = estudiantes.filter(e => e.logros && e.logros.includes(logroActivo));
    
    const toggleEstudianteLogro = async (estudianteId) => {
      const estudiante = data.estudiantes.find(e => e.id === estudianteId);
      if (!estudiante) return;
      
      const logrosActuales = estudiante.logros || [];
      const tieneLogro = logrosActuales.includes(logroActivo);
      
      const nuevosLogros = tieneLogro 
        ? logrosActuales.filter(id => id !== logroActivo)
        : [...logrosActuales, logroActivo];
      
      await updateEstudiante(estudianteId, { ...estudiante, logros: nuevosLogros });
      await cargarDatos();
    };
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowLogroModal(false)}
      >
        <div 
          className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span>{logroInfo?.icon}</span>
              <span className={`bg-gradient-to-r ${logroInfo?.color} bg-clip-text text-transparent`}>
                {logroInfo?.label}
              </span>
            </h3>
            <button 
              onClick={() => setShowLogroModal(false)}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm text-neutral-500 mb-4">
            Selecciona los estudiantes que merecen este reconocimiento
          </p>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {estudiantes.map((e) => {
              const tieneLogro = e.logros?.includes(logroActivo) || false;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleEstudianteLogro(e.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    tieneLogro 
                      ? 'bg-club-green-50 border-2 border-club-green' 
                      : 'bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {e.foto ? (
                      <img src={e.foto} alt={e.nombre} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-club-green-50 rounded-full flex items-center justify-center text-club-green font-bold text-sm">
                        {e.nombre?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{e.nombre}</p>
                      <p className="text-xs text-neutral-400">{e.grupo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tieneLogro && (
                      <span className="text-xs bg-club-green-50 text-club-green px-2 py-1 rounded-full">
                        ✅ Seleccionado
                      </span>
                    )}
                    <span className={`text-2xl ${tieneLogro ? 'opacity-100' : 'opacity-30'}`}>
                      {logroInfo?.icon}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {estudiantesConLogro.length} estudiantes seleccionados
            </span>
            <button 
              onClick={() => setShowLogroModal(false)}
              className="px-4 py-2 bg-club-green text-white rounded-xl text-sm font-semibold hover:bg-club-green-light transition-all"
            >
              ✅ Listo
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== RENDER INICIO =====
  const renderInicio = () => {
    const estudiantes = data.estudiantes.filter(e => e.grupo === selectedGrupo);
    const asistencias = getAsistenciasByGrupo(selectedGrupo);
    const notas = getNotasByGrupo(selectedGrupo);
    
    const totalAsis = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === 'Presente').length;
    const pctAsis = totalAsis ? Math.round((presentes / totalAsis) * 100) : 0;
    
    let promedioGrupo = 0;
    if (notas.length > 0) {
      const total = notas.reduce((sum, n) => sum + (n.tecnica + n.tactica + n.actitud) / 3, 0);
      promedioGrupo = Math.round((total / notas.length) * 10) / 10;
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-club-green/90 to-club-dark-2 rounded-2xl p-8 text-white mb-6">
          <h2 className="text-2xl font-bold">¡Bienvenido, {user?.displayName || 'Profesor'}! 👨‍🏫</h2>
          <p className="text-white/70 mt-2">Gestiona tus estudiantes, asistencias y evaluaciones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
          >
            <p className="text-3xl font-bold text-club-green">{estudiantes.length}</p>
            <p className="text-sm text-neutral-500">Estudiantes</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
          >
            <p className="text-3xl font-bold text-club-orange">{totalAsis}</p>
            <p className="text-sm text-neutral-500">Asistencias registradas</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
          >
            <p className="text-3xl font-bold text-club-green">{pctAsis}%</p>
            <p className="text-sm text-neutral-500">Asistencia promedio</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
          >
            <p className="text-3xl font-bold text-blue-600">{promedioGrupo}</p>
            <p className="text-sm text-neutral-500">Promedio del grupo</p>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">📋 Resumen del Grupo</h3>
            <select 
              value={selectedGrupo} 
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            >
              <option value="Infantil">⚽ Infantil</option>
              <option value="Prejuvenil">⚽ Prejuvenil</option>
              <option value="Juvenil">⚽ Juvenil</option>
              <option value="Femenino">⚽ Femenino</option>
            </select>
          </div>
          <div className="space-y-2">
            {estudiantes.slice(0, 5).map((e) => {
              const promedio = getPromedioByEstudiante(e.id);
              return (
                <motion.div 
                  key={e.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {e.foto ? (
                      <img src={e.foto} alt={e.nombre} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-club-green-50 rounded-full flex items-center justify-center text-club-green font-bold text-sm">
                        {e.nombre.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{e.nombre}</p>
                      <p className="text-xs text-neutral-400">{e.documento}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-club-green">{promedio > 0 ? promedio : '-'}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-neutral-500">🏆 Logros del Grupo</h4>
            <span className="text-xs text-neutral-400">Haz clic en un logro para asignarlo</span>
          </div>
          <AchievementBadge 
            onSelect={(logroId) => {
              setLogroActivo(logroId);
              setShowLogroModal(true);
            }}
            estudiantes={data.estudiantes?.filter(e => e.grupo === selectedGrupo) || []}
          />
        </div>
      </motion.div>
    );
  };

  // ===== RENDER ESTUDIANTES =====
  const renderEstudiantes = () => {
    const estudiantes = data.estudiantes.filter(e => e.grupo === selectedGrupo);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">👨‍🎓 Gestión de Estudiantes</h3>
            <select 
              value={selectedGrupo} 
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            >
              <option value="Infantil">⚽ Infantil</option>
              <option value="Prejuvenil">⚽ Prejuvenil</option>
              <option value="Juvenil">⚽ Juvenil</option>
              <option value="Femenino">⚽ Femenino</option>
            </select>
          </div>
          <button onClick={() => openModal('estudiante')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2">
            ➕ Nuevo Estudiante
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {estudiantes.map((e) => (
            <StudentProgressCard 
              key={e.id} 
              student={{
                ...e,
                tecnica: getPromedioByEstudiante(e.id) || 3,
                tactica: getPromedioByEstudiante(e.id) || 3,
                actitud: getPromedioByEstudiante(e.id) || 3
              }} 
            />
          ))}
        </div>
      </motion.div>
    );
  };

  // ===== RENDER ASISTENCIA CON CALENDARIO =====
  const renderAsistencia = () => {
    const estudiantes = data.estudiantes?.filter(e => e.grupo === selectedGrupo) || [];
    
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const primerDia = new Date(añoActual, mesActual, 1).getDay();
    const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
    const mesStr = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}`;
    
    const asistenciasMes = data.asistencias?.filter(a => {
      const est = data.estudiantes?.find(e => e.id === a.estudianteId);
      return est && est.grupo === selectedGrupo && a.fecha?.startsWith(mesStr);
    }) || [];
    
    const asistenciasPorDia = {};
    asistenciasMes.forEach(a => {
      const dia = parseInt(a.fecha.split('-')[2]);
      if (!asistenciasPorDia[dia]) asistenciasPorDia[dia] = [];
      asistenciasPorDia[dia].push(a);
    });

    const getEstadoDia = (dia) => {
      const registros = asistenciasPorDia[dia] || [];
      if (registros.length === 0) return 'sin-registro';
      const total = registros.length;
      const presentes = registros.filter(r => r.estado === 'Presente').length;
      const ausentes = registros.filter(r => r.estado === 'Ausente').length;
      const justificados = registros.filter(r => r.estado === 'Justificado').length;
      
      if (presentes === total) return 'todos-presentes';
      if (ausentes === total) return 'todos-ausentes';
      if (justificados === total) return 'todos-justificados';
      return 'mixto';
    };

    const getColorDia = (estado) => {
      const colores = {
        'todos-presentes': 'bg-club-green-100 text-club-green border-club-green hover:bg-club-green-200',
        'todos-ausentes': 'bg-club-red-100 text-club-red border-club-red hover:bg-club-red-200',
        'todos-justificados': 'bg-club-amber-100 text-club-amber border-club-amber hover:bg-club-amber-200',
        'mixto': 'bg-blue-100 text-blue-600 border-blue-400 hover:bg-blue-200',
        'sin-registro': 'bg-stone-50 text-stone-300 border-stone-200 hover:bg-stone-100'
      };
      return colores[estado] || colores['sin-registro'];
    };

    const getTooltipDia = (dia) => {
      const registros = asistenciasPorDia[dia] || [];
      if (registros.length === 0) return 'Sin registro';
      const presentes = registros.filter(r => r.estado === 'Presente').length;
      const ausentes = registros.filter(r => r.estado === 'Ausente').length;
      const justificados = registros.filter(r => r.estado === 'Justificado').length;
      return `P:${presentes} A:${ausentes} J:${justificados} | Total: ${registros.length}`;
    };

    const cambiarMes = (direccion) => {
      if (direccion === 'anterior') {
        if (mesActual === 0) {
          setMesActual(11);
          setAñoActual(añoActual - 1);
        } else {
          setMesActual(mesActual - 1);
        }
      } else {
        if (mesActual === 11) {
          setMesActual(0);
          setAñoActual(añoActual + 1);
        } else {
          setMesActual(mesActual + 1);
        }
      }
    };

    const getEstadoAsistencia = (estudianteId) => {
      const asistencias = getAsistenciasByGrupo(selectedGrupo, selectedFecha);
      const registro = asistencias.find(a => a.estudianteId === estudianteId);
      return registro ? registro.estado : 'Pendiente';
    };

    const getAsistenciaId = (estudianteId) => {
      const asistencias = getAsistenciasByGrupo(selectedGrupo, selectedFecha);
      const registro = asistencias.find(a => a.estudianteId === estudianteId);
      return registro ? registro.id : null;
    };

    const marcarAsistencia = async (estudianteId, estado) => {
      try {
        const id = getAsistenciaId(estudianteId);
        if (id) {
          await updateAsistencia(id, { estado });
        } else {
          await addAsistencia({ 
            estudianteId, 
            fecha: selectedFecha, 
            estado, 
            grupo: selectedGrupo 
          });
        }
        await cargarDatos();
      } catch (error) {
        console.error('Error al guardar la asistencia:', error);
        alert('Error al guardar la asistencia');
      }
    };

    const estadoStyles = {
      'Presente': 'bg-club-green-50 text-club-green border-club-green',
      'Ausente': 'bg-club-red-50 text-club-red border-club-red',
      'Justificado': 'bg-club-amber-50 text-club-amber border-club-amber',
      'Pendiente': 'bg-stone-50 text-stone-400 border-stone-200'
    };

    const total = estudiantes.length;
    const presentes = estudiantes.filter(e => getEstadoAsistencia(e.id) === 'Presente').length;
    const ausentes = estudiantes.filter(e => getEstadoAsistencia(e.id) === 'Ausente').length;
    const justificados = estudiantes.filter(e => getEstadoAsistencia(e.id) === 'Justificado').length;

    if (estudiantes.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
          <p className="text-neutral-400">No hay estudiantes en este grupo</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">✅ Control de Asistencia</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">
              {new Date(selectedFecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => estudiantes.forEach(e => marcarAsistencia(e.id, 'Presente'))} 
              className="px-4 py-2 bg-club-green-50 text-club-green rounded-xl text-sm font-semibold hover:bg-club-green-100 transition-all"
            >
              Marcar Todos Presente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
            <p className="text-2xl font-bold text-club-green">{total}</p>
            <p className="text-[10px] text-neutral-500 font-medium">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
            <p className="text-2xl font-bold text-club-green">{presentes}</p>
            <p className="text-[10px] text-neutral-500 font-medium">✅ Presentes</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
            <p className="text-2xl font-bold text-club-red">{ausentes}</p>
            <p className="text-[10px] text-neutral-500 font-medium">❌ Ausentes</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
            <p className="text-2xl font-bold text-club-amber">{justificados}</p>
            <p className="text-[10px] text-neutral-500 font-medium">📝 Justificados</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-stone-100">
            <p className="text-2xl font-bold text-blue-600">
              {total > 0 ? Math.round((presentes / total) * 100) : 0}%
            </p>
            <p className="text-[10px] text-neutral-500 font-medium">Asistencia</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <select 
            value={selectedGrupo} 
            onChange={(e) => setSelectedGrupo(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
          >
            <option value="Infantil">⚽ Infantil</option>
            <option value="Prejuvenil">⚽ Prejuvenil</option>
            <option value="Juvenil">⚽ Juvenil</option>
            <option value="Femenino">⚽ Femenino</option>
          </select>
          <input 
            type="date" 
            value={selectedFecha}
            onChange={(e) => setSelectedFecha(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden mb-6">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-stone-50 z-10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e) => {
                  const estado = getEstadoAsistencia(e.id);
                  return (
                    <motion.tr 
                      key={e.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {e.foto ? (
                            <img src={e.foto} alt={e.nombre} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-club-green-50 rounded-full flex items-center justify-center text-club-green font-bold text-sm">
                              {e.nombre?.charAt(0) || '?'}
                            </div>
                          )}
                          <span className="font-medium">{e.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${estadoStyles[estado]}`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={() => marcarAsistencia(e.id, 'Presente')} 
                            className="px-3 py-1 bg-club-green-50 text-club-green rounded-lg text-xs font-semibold hover:bg-club-green-100 transition-all"
                          >
                            ✓ Presente
                          </button>
                          <button 
                            onClick={() => marcarAsistencia(e.id, 'Ausente')} 
                            className="px-3 py-1 bg-club-red-50 text-club-red rounded-lg text-xs font-semibold hover:bg-club-red-100 transition-all"
                          >
                            ✗ Ausente
                          </button>
                          <button 
                            onClick={() => marcarAsistencia(e.id, 'Justificado')} 
                            className="px-3 py-1 bg-club-amber-50 text-club-amber rounded-lg text-xs font-semibold hover:bg-club-amber-100 transition-all"
                          >
                            ◯ Justif.
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>📅</span> Calendario de Asistencia — {nombresMeses[mesActual]} {añoActual}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => cambiarMes('anterior')}
                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              >
                ◀
              </button>
              <button 
                onClick={() => {
                  setMesActual(hoy.getMonth());
                  setAñoActual(hoy.getFullYear());
                }}
                className="px-3 py-1 text-xs bg-club-green-50 text-club-green rounded-lg hover:bg-club-green-100 transition-colors"
              >
                Hoy
              </button>
              <button 
                onClick={() => cambiarMes('siguiente')}
                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-club-green-100 border border-club-green"></span> Todos Presentes</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-club-red-100 border border-club-red"></span> Todos Ausentes</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-club-amber-100 border border-club-amber"></span> Todos Justificados</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></span> Mixto</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-stone-50 border border-stone-200"></span> Sin registro</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {diasSemana.map(d => (
              <div key={d} className="text-center text-xs font-bold text-neutral-400 py-2">
                {d}
              </div>
            ))}
            
            {Array.from({ length: primerDia }, (_, i) => (
              <div key={`empty-${i}`} className="text-center text-xs text-neutral-200 py-2"></div>
            ))}
            
            {Array.from({ length: diasEnMes }, (_, i) => {
              const dia = i + 1;
              const estado = getEstadoDia(dia);
              const esHoy = dia === hoy.getDate() && mesActual === hoy.getMonth() && añoActual === hoy.getFullYear();
              const esDiaActual = dia === parseInt(selectedFecha.split('-')[2]) && mesActual === parseInt(selectedFecha.split('-')[1]) - 1 && añoActual === parseInt(selectedFecha.split('-')[0]);
              const tooltip = getTooltipDia(dia);
              const fechaStr = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
              
              return (
                <motion.button
                  key={dia}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFecha(fechaStr)}
                  className={`text-center py-2 rounded-lg text-xs font-medium border transition-all relative ${getColorDia(estado)} ${esHoy ? 'ring-2 ring-club-green ring-offset-1' : ''} ${esDiaActual ? 'ring-2 ring-club-orange ring-offset-1' : ''}`}
                  title={tooltip}
                >
                  {dia}
                  {esHoy && <span className="block text-[8px] font-bold text-club-green">HOY</span>}
                  {estado !== 'sin-registro' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-club-green animate-pulse"></span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex flex-wrap justify-between text-xs text-neutral-400">
              <span>📊 Días con registro: {Object.keys(asistenciasPorDia).length} / {diasEnMes}</span>
              <span>👥 Promedio de asistencia: {
                Object.keys(asistenciasPorDia).length > 0 
                  ? Math.round(Object.values(asistenciasPorDia).reduce((sum, regs) => {
                      const presentes = regs.filter(r => r.estado === 'Presente').length;
                      return sum + (presentes / regs.length);
                    }, 0) / Object.keys(asistenciasPorDia).length * 100)
                  : 0
              }%</span>
              <span>📅 Hover sobre cada día para ver detalles</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== RENDER NOTAS =====
  const renderNotas = () => {
    const estudiantes = data.estudiantes.filter(e => e.grupo === selectedGrupo);
    const notas = getNotasByGrupo(selectedGrupo);

    const getNota = (estudianteId) => {
      return notas.find(n => n.estudianteId === estudianteId);
    };

    const calcularPromedio = (nota) => {
      if (!nota) return '-';
      return ((nota.tecnica + nota.tactica + nota.actitud) / 3).toFixed(1);
    };

    const getColorPromedio = (promedio) => {
      if (promedio === '-') return 'text-neutral-400';
      if (parseFloat(promedio) >= 4) return 'text-club-green';
      if (parseFloat(promedio) >= 3) return 'text-club-amber';
      return 'text-club-red';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">📝 Evaluaciones</h3>
            <select 
              value={selectedGrupo} 
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            >
              <option value="Infantil">⚽ Infantil</option>
              <option value="Prejuvenil">⚽ Prejuvenil</option>
              <option value="Juvenil">⚽ Juvenil</option>
              <option value="Femenino">⚽ Femenino</option>
            </select>
          </div>
          <button onClick={() => openModal('nota')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2">
            ➕ Nueva Nota
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Técnica</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Táctica</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Actitud</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Promedio</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e) => {
                  const nota = getNota(e.id);
                  const promedio = calcularPromedio(nota);
                  return (
                    <motion.tr 
                      key={e.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {e.foto ? (
                            <img src={e.foto} alt={e.nombre} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-club-green-50 rounded-full flex items-center justify-center text-club-green font-bold text-sm">
                              {e.nombre.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">{e.nombre}</span>
                        </div>
                      </td>
                      <td className="text-center px-4 py-3">
                        {nota ? (
                          <span className={`font-bold ${nota.tecnica >= 4 ? 'text-club-green' : nota.tecnica >= 3 ? 'text-club-amber' : 'text-club-red'}`}>
                            {nota.tecnica}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-center px-4 py-3">
                        {nota ? (
                          <span className={`font-bold ${nota.tactica >= 4 ? 'text-club-green' : nota.tactica >= 3 ? 'text-club-amber' : 'text-club-red'}`}>
                            {nota.tactica}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-center px-4 py-3">
                        {nota ? (
                          <span className={`font-bold ${nota.actitud >= 4 ? 'text-club-green' : nota.actitud >= 3 ? 'text-club-amber' : 'text-club-red'}`}>
                            {nota.actitud}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className={`font-bold text-lg ${getColorPromedio(promedio)}`}>
                          {promedio}
                        </span>
                      </td>
                      <td className="text-center px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {nota ? (
                            <>
                              <button onClick={() => openModal('nota', nota)} className="p-2 hover:bg-club-green-50 rounded-lg transition-colors text-club-green">
                                ✏️
                              </button>
                              <button onClick={() => handleDelete('nota', nota.id)} className="p-2 hover:bg-club-red-50 rounded-lg transition-colors text-club-red">
                                🗑️
                              </button>
                            </>
                          ) : (
                            <button onClick={() => openModal('nota')} className="px-3 py-1 bg-club-green-50 text-club-green rounded-lg text-xs font-semibold hover:bg-club-green-100 transition-all">
                              + Agregar
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return renderInicio();
      case 'estudiantes': return renderEstudiantes();
      case 'asistencia': return renderAsistencia();
      case 'notas': return renderNotas();
      default: return renderInicio();
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
          <p className="text-white font-semibold">{user?.displayName || user?.nombre || 'Profesor'}</p>
          <p className="text-xs text-white/40">Profesor</p>
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
              <p className="text-sm text-neutral-500">Panel de Gestión Profesional</p>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 hover:bg-stone-100 p-2 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-700">
                  {user?.displayName || user?.nombre || 'Profesor'}
                </p>
                <p className="text-[11px] text-neutral-400">Profesor</p>
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

      {/* Modal */}
      {renderModal()}

      {/* Modal de Perfil */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userData={userData}
        onSave={handleProfileSave}
        onLogout={handleLogout}
      />

      {/* Modal de Logros */}
      {renderLogroModal()}
    </div>
  );
}