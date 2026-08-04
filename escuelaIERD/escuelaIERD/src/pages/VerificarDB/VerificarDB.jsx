import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function VerificarDB() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    usuarios: [],
    estudiantes: [],
    profesores: [],
    pagos: [],
    asistencias: [],
    notas: []
  });
  const [activeTab, setActiveTab] = useState('usuarios');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const [usuarios, estudiantes, profesores, pagos, asistencias, notas] = await Promise.all([
        api.getUsuarios(),
        api.getEstudiantes(),
        api.getProfesores(),
        api.getPagos(),
        api.getAsistencias(),
        api.getNotas()
      ]);

      setData({
        usuarios: usuarios || [],
        estudiantes: estudiantes || [],
        profesores: profesores || [],
        pagos: pagos || [],
        asistencias: asistencias || [],
        notas: notas || []
      });
    } catch (err) {
      setError('Error al cargar los datos. Asegúrate de que JSON Server esté corriendo.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'usuarios', label: '👤 Usuarios', count: data.usuarios.length },
    { id: 'estudiantes', label: '👨‍🎓 Estudiantes', count: data.estudiantes.length },
    { id: 'profesores', label: '👨‍🏫 Profesores', count: data.profesores.length },
    { id: 'pagos', label: '💰 Pagos', count: data.pagos.length },
    { id: 'asistencias', label: '✅ Asistencias', count: data.asistencias.length },
    { id: 'notas', label: '📊 Notas', count: data.notas.length },
  ];

  const renderTabContent = () => {
    const items = data[activeTab] || [];

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-neutral-400">No hay datos en {activeTab}</p>
          <p className="text-xs text-neutral-300 mt-2">Registra algunos datos para verlos aquí</p>
        </div>
      );
    }

    const columns = Object.keys(items[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 sticky top-0">
            <tr>
              {columns.map(col => (
                <th key={col} className="text-left px-4 py-3 font-medium text-neutral-500 uppercase text-xs tracking-wider">
                  {col}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-medium text-neutral-500 uppercase text-xs tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 max-w-[200px] truncate">
                    {typeof item[col] === 'object' ? JSON.stringify(item[col]).slice(0, 50) : String(item[col] || '-')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleDelete(activeTab, item.id)}
                    className="text-club-red hover:bg-club-red-50 p-1.5 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-neutral-400 text-right px-4 py-2 border-t border-stone-100">
          Total: {items.length} registros
        </div>
      </div>
    );
  };

  const handleDelete = async (tab, id) => {
    if (!window.confirm(`¿Eliminar este registro de ${tab}?`)) return;

    try {
      const endpoint = {
        usuarios: api.deleteUsuario,
        estudiantes: api.deleteEstudiante,
        profesores: api.deleteProfesor,
        pagos: api.deletePago,
        asistencias: api.deleteAsistencia,
        notas: api.deleteNota
      };

      if (endpoint[tab]) {
        await endpoint[tab](id);
        await cargarDatos();
      }
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-neutral-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-64 bg-club-dark-2 min-h-screen p-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
        <div className="mb-8">
          <img 
            src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" 
            alt="IERD" 
            className="h-10 mx-auto"
          />
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <p className="text-white font-semibold">{user?.nombre || 'Admin'}</p>
          <p className="text-xs text-white/40">Verificación de Base de Datos</p>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                activeTab === tab.id 
                  ? 'bg-club-green/20 text-club-green-light' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tab.count > 0 ? 'bg-club-green/30 text-club-green-light' : 'bg-white/10 text-white/30'}`}>
                {tab.count}
              </span>
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

      <main className="ml-64 flex-1 p-8">
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">
                🗄️ Verificación de Base de Datos
              </h1>
              <p className="text-sm text-neutral-500">
                Estado de la conexión: {error ? '❌ Error' : '✅ Conectado'}
              </p>
            </div>
            <button
              onClick={cargarDatos}
              className="px-4 py-2 bg-club-green text-white text-sm font-semibold rounded-xl hover:bg-club-green-light transition-all flex items-center gap-2"
            >
              🔄 Actualizar
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-4 mb-6 text-club-red-light">
            <p className="font-semibold">⚠️ {error}</p>
            <p className="text-sm mt-1">Asegúrate de que JSON Server esté corriendo en http://localhost:5001</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {tabs.find(t => t.id === activeTab)?.label || activeTab}
            </h2>
            <div className="flex gap-2">
              <span className="text-xs bg-stone-100 px-3 py-1 rounded-full">
                {data[activeTab]?.length || 0} registros
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(data[activeTab], null, 2));
                  alert('✅ Datos copiados al portapapeles');
                }}
                className="text-xs bg-club-green-50 text-club-green px-3 py-1 rounded-full hover:bg-club-green-100 transition-colors"
              >
                📋 Copiar JSON
              </button>
            </div>
          </div>
          {renderTabContent()}
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h3 className="font-semibold text-sm mb-3">📊 Resumen de la Base de Datos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {tabs.map((tab) => (
              <div key={tab.id} className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-neutral-800">{tab.count}</p>
                <p className="text-xs text-neutral-400">{tab.label.replace(/[^\w\s]/g, '').trim()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-neutral-400 text-center">
            Total de registros: {tabs.reduce((sum, tab) => sum + tab.count, 0)}
          </div>
        </div>
      </main>
    </div>
  );
}