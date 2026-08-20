import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileModal from '../../components/common/ProfileModal';
import StatsCard from './components/StatsCard';
import RecentActivity from './components/RecentActivity';

export default function Admin() {
  const { user, logout, updateProfile } = useAuth();
  const { 
    data, 
    addEstudiante, updateEstudiante, deleteEstudiante,
    addProfesor, updateProfesor, deleteProfesor,
    addPago, updatePago, deletePago,
    addUsuario, updateUsuario, deleteUsuario
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [filtroGrupoAsis, setFiltroGrupoAsis] = useState('todos');
  const [filtroFechaAsis, setFiltroFechaAsis] = useState('');
  const [filtroGrupoNotas, setFiltroGrupoNotas] = useState('todos');
  const [buscarUsuario, setBuscarUsuario] = useState('');

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

  // ===== FUNCIONES =====
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (modalType === 'estudiante') {
      if (!formData.nombre || !formData.documento || !formData.grupo) {
        setFormError('Nombre, documento y grupo son obligatorios');
        return;
      }
      if (editingItem) {
        updateEstudiante(editingItem.id, formData);
      } else {
        addEstudiante(formData);
      }
    } else if (modalType === 'profesor') {
      if (!formData.nombre || !formData.email) {
        setFormError('Nombre y email son obligatorios');
        return;
      }
      if (editingItem) {
        updateProfesor(editingItem.id, formData);
      } else {
        addProfesor(formData);
      }
    } else if (modalType === 'pago') {
      if (!formData.estudianteId || !formData.concepto || !formData.monto) {
        setFormError('Estudiante, concepto y monto son obligatorios');
        return;
      }
      if (editingItem) {
        updatePago(editingItem.id, formData);
      } else {
        addPago(formData);
      }
    } else if (modalType === 'usuario') {
      if (!formData.nombre || !formData.email || !formData.role) {
        setFormError('Nombre, email y rol son obligatorios');
        return;
      }
      if (!editingItem && !formData.password) {
        setFormError('Contraseña es obligatoria para nuevos usuarios');
        return;
      }
      if (editingItem) {
        updateUsuario(editingItem.id, formData);
      } else {
        addUsuario(formData);
      }
    }

    closeModal();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      if (type === 'estudiante') deleteEstudiante(id);
      else if (type === 'profesor') deleteProfesor(id);
      else if (type === 'pago') deletePago(id);
      else if (type === 'usuario') deleteUsuario(id);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'estudiantes', label: '👨‍🎓 Estudiantes', icon: '👨‍🎓' },
    { id: 'profesores', label: '👨‍🏫 Profesores', icon: '👨‍🏫' },
    { id: 'pagos', label: '💰 Pagos', icon: '💰' },
    { id: 'asistencias', label: '✅ Asistencias', icon: '✅' },
    { id: 'notas', label: '📊 Notas', icon: '📊' },
    { id: 'usuarios', label: '👤 Usuarios', icon: '👤' },
    { id: 'verificar', label: '🗄️ Verificar DB', icon: '🗄️' },
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
        { name: 'foto', label: 'URL Foto', type: 'text' },
      ];
    } else if (modalType === 'profesor') {
      title = editingItem ? '✏️ Editar Profesor' : '➕ Nuevo Profesor';
      fields = [
        { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'especialidad', label: 'Especialidad', type: 'text' },
        { name: 'foto', label: 'URL Foto', type: 'text' },
      ];
    } else if (modalType === 'pago') {
      title = editingItem ? '✏️ Editar Pago' : '➕ Nuevo Pago';
      fields = [
        { name: 'estudianteId', label: 'Estudiante', type: 'select', options: data.estudiantes?.map(e => ({ value: e.id, label: e.nombre })) || [], required: true },
        { name: 'concepto', label: 'Concepto', type: 'text', required: true },
        { name: 'monto', label: 'Monto', type: 'number', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Pagado', 'Pendiente'] },
        { name: 'fecha', label: 'Fecha', type: 'date' },
      ];
    } else if (modalType === 'usuario') {
      title = editingItem ? '✏️ Editar Usuario' : '➕ Nuevo Usuario';
      fields = [
        { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Rol', type: 'select', options: ['admin', 'profesor'], required: true },
        { name: 'password', label: 'Contraseña', type: 'password', required: !editingItem },
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

  // ===== RENDER DASHBOARD =====
  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Estudiantes" 
          value={data.estudiantes?.length || 0} 
          icon="lucide:users" 
          color="green" 
          change={12}
          subtitle="+2 esta semana"
        />
        <StatsCard 
          title="Profesores" 
          value={data.profesores?.length || 0} 
          icon="lucide:graduation-cap" 
          color="orange"
          subtitle="1 nuevo este mes"
        />
        <StatsCard 
          title="Pagos" 
          value={data.pagos?.length || 0} 
          icon="lucide:credit-card" 
          color="red"
          subtitle={`Total: $${data.pagos?.reduce((sum, p) => sum + p.monto, 0).toLocaleString() || 0}`}
        />
        <StatsCard 
          title="Asistencias" 
          value={data.asistencias?.length || 0} 
          icon="lucide:clipboard-check" 
          color="blue"
          subtitle={`${data.asistencias?.filter(a => a.estado === 'Presente').length || 0} presentes`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>📊</span> Estadísticas Rápidas
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Asistencia promedio</span>
                <span className="font-bold text-club-green">
                  {data.asistencias?.length > 0 
                    ? Math.round((data.asistencias.filter(a => a.estado === 'Presente').length / data.asistencias.length) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${data.asistencias?.length > 0 ? Math.round((data.asistencias.filter(a => a.estado === 'Presente').length / data.asistencias.length) * 100) : 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-club-green rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Estudiantes Activos</span>
                <span className="font-bold text-club-orange">
                  {data.estudiantes?.filter(e => e.estado === 'Activo').length || 0}/{data.estudiantes?.length || 0}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${data.estudiantes?.length > 0 ? Math.round((data.estudiantes.filter(e => e.estado === 'Activo').length / data.estudiantes.length) * 100) : 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-club-orange rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Pagos al día</span>
                <span className="font-bold text-club-green">
                  {data.pagos?.filter(p => p.estado === 'Pagado').length || 0}/{data.pagos?.length || 0}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${data.pagos?.length > 0 ? Math.round((data.pagos.filter(p => p.estado === 'Pagado').length / data.pagos.length) * 100) : 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-club-green rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ===== RENDER ESTUDIANTES =====
  const renderEstudiantes = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">👨‍🎓 Gestión de Estudiantes</h3>
        <button onClick={() => openModal('estudiante')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2">
          ➕ Nuevo Estudiante
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Documento</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Grupo</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.estudiantes?.map((e) => (
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
                  <td className="px-4 py-3">{e.documento}</td>
                  <td className="px-4 py-3">{e.grupo}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${e.estado === 'Activo' ? 'bg-club-green-50 text-club-green' : 'bg-club-red-50 text-club-red'}`}>
                      {e.estado || 'Activo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('estudiante', e)} className="p-2 hover:bg-club-green-50 rounded-lg transition-colors text-club-green">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete('estudiante', e.id)} className="p-2 hover:bg-club-red-50 rounded-lg transition-colors text-club-red">
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // ===== RENDER PROFESORES =====
  const renderProfesores = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">👨‍🏫 Gestión de Profesores</h3>
        <button onClick={() => openModal('profesor')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2">
          ➕ Nuevo Profesor
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.profesores?.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              {p.foto ? (
                <img src={p.foto} alt={p.nombre} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 bg-club-orange-50 rounded-xl flex items-center justify-center text-club-orange font-bold text-xl">
                  {p.nombre?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-semibold">{p.nombre}</p>
                <p className="text-xs text-neutral-400">{p.especialidad || 'Sin especialidad'}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-3">{p.email}</p>
            <div className="flex gap-2">
              <button onClick={() => openModal('profesor', p)} className="flex-1 py-2 bg-club-green-50 text-club-green rounded-xl text-sm font-semibold hover:bg-club-green-100 transition-all">
                ✏️ Editar
              </button>
              <button onClick={() => handleDelete('profesor', p.id)} className="py-2 px-4 bg-club-red-50 text-club-red rounded-xl text-sm font-semibold hover:bg-club-red-100 transition-all">
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // ===== RENDER PAGOS =====
  const renderPagos = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">💰 Gestión de Pagos</h3>
        <button onClick={() => openModal('pago')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2">
          ➕ Nuevo Pago
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Concepto</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Monto</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.pagos?.map((p) => {
                const estudiante = data.estudiantes?.find(e => e.id === p.estudianteId);
                return (
                  <motion.tr 
                    key={p.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{estudiante?.nombre || 'Desconocido'}</td>
                    <td className="px-4 py-3">{p.concepto}</td>
                    <td className="px-4 py-3 font-bold">${p.monto?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.estado === 'Pagado' ? 'bg-club-green-50 text-club-green' : 'bg-club-amber-50 text-club-amber'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openModal('pago', p)} className="p-2 hover:bg-club-green-50 rounded-lg transition-colors text-club-green">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete('pago', p.id)} className="p-2 hover:bg-club-red-50 rounded-lg transition-colors text-club-red">
                          🗑️
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
    </motion.div>
  );

  // ===== RENDER ASISTENCIAS =====
  const renderAsistencias = () => {
    const grupos = ['todos', 'Infantil', 'Prejuvenil', 'Juvenil', 'Femenino'];
    
    const asistenciasFiltradas = data.asistencias?.filter(a => {
      if (filtroGrupoAsis !== 'todos') {
        const est = data.estudiantes?.find(e => e.id === a.estudianteId);
        if (!est || est.grupo !== filtroGrupoAsis) return false;
      }
      if (filtroFechaAsis && a.fecha !== filtroFechaAsis) return false;
      return true;
    }).sort((a, b) => b.fecha?.localeCompare(a.fecha)) || [];

    const estadoCfg = {
      'Presente': { label: 'Presente', color: 'bg-club-green-50 text-club-green' },
      'Ausente': { label: 'Ausente', color: 'bg-club-red-50 text-club-red' },
      'Justificado': { label: 'Justificado', color: 'bg-club-amber-50 text-club-amber' }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">✅ Historial de Asistencias</h3>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <select 
              value={filtroGrupoAsis}
              onChange={(e) => setFiltroGrupoAsis(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            >
              {grupos.map(g => (
                <option key={g} value={g}>{g === 'todos' ? '📋 Todos los grupos' : `⚽ ${g}`}</option>
              ))}
            </select>
            <input 
              type="date" 
              value={filtroFechaAsis}
              onChange={(e) => setFiltroFechaAsis(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            />
            {filtroFechaAsis && (
              <button 
                onClick={() => setFiltroFechaAsis('')}
                className="px-3 py-2 bg-stone-100 text-neutral-500 rounded-xl text-sm hover:bg-stone-200 transition-all"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-stone-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Grupo</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistenciasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-neutral-400">
                      No hay registros de asistencia
                    </td>
                  </tr>
                ) : (
                  asistenciasFiltradas.map(a => {
                    const est = data.estudiantes?.find(e => e.id === a.estudianteId);
                    return (
                      <tr key={a.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">{a.fecha}</td>
                        <td className="px-4 py-3 font-medium">{est?.nombre || 'Desconocido'}</td>
                        <td className="px-4 py-3">{est?.grupo || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${estadoCfg[a.estado]?.color || 'bg-stone-50 text-stone-400'}`}>
                            {estadoCfg[a.estado]?.label || a.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== RENDER NOTAS =====
  const renderNotas = () => {
    const grupos = ['todos', 'Infantil', 'Prejuvenil', 'Juvenil', 'Femenino'];
    
    const notasFiltradas = data.notas?.filter(n => {
      if (filtroGrupoNotas !== 'todos') {
        const est = data.estudiantes?.find(e => e.id === n.estudianteId);
        if (!est || est.grupo !== filtroGrupoNotas) return false;
      }
      return true;
    }).sort((a, b) => b.fecha?.localeCompare(a.fecha)) || [];

    const getPromedio = (nota) => {
      if (!nota) return '0';
      return ((nota.tecnica + nota.tactica + nota.actitud) / 3).toFixed(1);
    };

    const getColorPromedio = (prom) => {
      const p = parseFloat(prom);
      if (p >= 4) return 'text-club-green';
      if (p >= 3) return 'text-club-amber';
      return 'text-club-red';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">📊 Historial de Notas</h3>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <select 
              value={filtroGrupoNotas}
              onChange={(e) => setFiltroGrupoNotas(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            >
              {grupos.map(g => (
                <option key={g} value={g}>{g === 'todos' ? '📋 Todos los grupos' : `⚽ ${g}`}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-stone-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Estudiante</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Grupo</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Técnica</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Táctica</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Actitud</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {notasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-neutral-400">
                      No hay evaluaciones registradas
                    </td>
                  </tr>
                ) : (
                  notasFiltradas.map(n => {
                    const est = data.estudiantes?.find(e => e.id === n.estudianteId);
                    const prom = getPromedio(n);
                    return (
                      <tr key={n.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">{n.fecha}</td>
                        <td className="px-4 py-3 font-medium">{est?.nombre || 'Desconocido'}</td>
                        <td className="px-4 py-3">{est?.grupo || '-'}</td>
                        <td className="text-center px-4 py-3 font-bold">{n.tecnica}</td>
                        <td className="text-center px-4 py-3 font-bold">{n.tactica}</td>
                        <td className="text-center px-4 py-3 font-bold">{n.actitud}</td>
                        <td className={`text-center px-4 py-3 font-bold text-lg ${getColorPromedio(prom)}`}>
                          {prom}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== RENDER USUARIOS =====
  const ROL_LABELS = {
    admin: { label: 'Administrador', className: 'bg-club-green-50 text-club-green' },
    profesor: { label: 'Profesor', className: 'bg-club-orange-50 text-club-orange' },
    estudiante: { label: 'Estudiante', className: 'bg-blue-50 text-blue-600' },
    padre: { label: 'Padre/Acudiente', className: 'bg-purple-50 text-purple-600' }
  };

  const renderUsuarios = () => {
    const term = buscarUsuario.trim().toLowerCase();
    const usuariosFiltrados = (data.usuarios || []).filter(u => {
      if (!term) return true;
      const rolLabel = (ROL_LABELS[u.role]?.label || u.role || '').toLowerCase();
      return (
        u.nombre?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        rolLabel.includes(term)
      );
    });

    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="font-semibold text-lg">👤 Gestión de Usuarios</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
            <input
              type="text"
              value={buscarUsuario}
              onChange={(e) => setBuscarUsuario(e.target.value)}
              placeholder="Buscar por nombre, correo o rol..."
              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-club-green outline-none"
            />
          </div>
          <button onClick={() => openModal('usuario')} className="bg-club-green text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2 whitespace-nowrap">
            ➕ Nuevo Usuario
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                    {term ? `Sin resultados para "${buscarUsuario}"` : 'No hay usuarios registrados'}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => (
                <motion.tr 
                  key={u.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ROL_LABELS[u.role]?.className || 'bg-stone-100 text-neutral-500'}`}>
                      {ROL_LABELS[u.role]?.label || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('usuario', u)} className="p-2 hover:bg-club-green-50 rounded-lg transition-colors text-club-green">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete('usuario', u.id)} className="p-2 hover:bg-club-red-50 rounded-lg transition-colors text-club-red">
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
    );
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'estudiantes': return renderEstudiantes();
      case 'profesores': return renderProfesores();
      case 'pagos': return renderPagos();
      case 'asistencias': return renderAsistencias();
      case 'notas': return renderNotas();
      case 'usuarios': return renderUsuarios();
      case 'verificar': 
        window.location.href = '/verificar-db';
        return null;
      default: return renderDashboard();
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
          <p className="text-white font-semibold">{user?.displayName || user?.nombre || 'Admin'}</p>
          <p className="text-xs text-white/40">Administrador</p>
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
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-neutral-500">Panel de Administración IERD Duitama</p>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 hover:bg-stone-100 p-2 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-700">
                  {user?.displayName || user?.nombre || 'Admin'}
                </p>
                <p className="text-[11px] text-neutral-400">Administrador</p>
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
    </div>
  );
}