import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({
    estudiantes: [],
    profesores: [],
    pagos: [],
    asistencias: [],
    notas: [],
    usuarios: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 DataContext: Cargando datos...');
      
      const [estudiantes, profesores, pagos, asistencias, notas, usuarios] = await Promise.all([
        api.getEstudiantes().catch(() => []),
        api.getProfesores().catch(() => []),
        api.getPagos().catch(() => []),
        api.getAsistencias().catch(() => []),
        api.getNotas().catch(() => []),
        api.getUsuarios().catch(() => [])
      ]);

      console.log('📊 DataContext: Datos cargados:', { estudiantes, profesores, pagos, asistencias, notas, usuarios });

      setData({
        estudiantes: estudiantes || [],
        profesores: profesores || [],
        pagos: pagos || [],
        asistencias: asistencias || [],
        notas: notas || [],
        usuarios: usuarios || []
      });
    } catch (error) {
      console.error('❌ DataContext: Error cargando datos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  // ===== ESTUDIANTES =====
  const addEstudiante = async (estudiante) => {
    try {
      const nuevo = await api.createEstudiante(estudiante);
      if (nuevo) {
        setData(prev => ({
          ...prev,
          estudiantes: [...prev.estudiantes, nuevo]
        }));
        return { success: true, data: nuevo };
      }
      return { success: false, error: 'Error al crear estudiante' };
    } catch (error) {
      console.error('Error creando estudiante:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEstudiante = async (id, updatedData) => {
    try {
      const actualizado = await api.updateEstudiante(id, updatedData);
      if (actualizado) {
        setData(prev => ({
          ...prev,
          estudiantes: prev.estudiantes.map(e => e.id === id ? actualizado : e)
        }));
        return { success: true, data: actualizado };
      }
      return { success: false, error: 'Error al actualizar estudiante' };
    } catch (error) {
      console.error('Error actualizando estudiante:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteEstudiante = async (id) => {
    try {
      await api.deleteEstudiante(id);
      setData(prev => ({
        ...prev,
        estudiantes: prev.estudiantes.filter(e => e.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando estudiante:', error);
      return { success: false, error: error.message };
    }
  };

  const getEstudianteById = (id) => data.estudiantes.find(e => e.id === id);
  const getEstudiantesByGrupo = (grupo) => data.estudiantes.filter(e => e.grupo === grupo);

  // ===== PROFESORES =====
  const addProfesor = async (profesor) => {
    try {
      const nuevo = await api.createProfesor(profesor);
      if (nuevo) {
        setData(prev => ({
          ...prev,
          profesores: [...prev.profesores, nuevo]
        }));
        return { success: true, data: nuevo };
      }
      return { success: false, error: 'Error al crear profesor' };
    } catch (error) {
      console.error('Error creando profesor:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfesor = async (id, updatedData) => {
    try {
      const actualizado = await api.updateProfesor(id, updatedData);
      if (actualizado) {
        setData(prev => ({
          ...prev,
          profesores: prev.profesores.map(p => p.id === id ? actualizado : p)
        }));
        return { success: true, data: actualizado };
      }
      return { success: false, error: 'Error al actualizar profesor' };
    } catch (error) {
      console.error('Error actualizando profesor:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProfesor = async (id) => {
    try {
      await api.deleteProfesor(id);
      setData(prev => ({
        ...prev,
        profesores: prev.profesores.filter(p => p.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando profesor:', error);
      return { success: false, error: error.message };
    }
  };

  const getProfesorById = (id) => data.profesores.find(p => p.id === id);

  // ===== PAGOS =====
  const addPago = async (pago) => {
    try {
      const nuevo = await api.createPago(pago);
      if (nuevo) {
        setData(prev => ({
          ...prev,
          pagos: [...prev.pagos, nuevo]
        }));
        return { success: true, data: nuevo };
      }
      return { success: false, error: 'Error al crear pago' };
    } catch (error) {
      console.error('Error creando pago:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePago = async (id, updatedData) => {
    try {
      const actualizado = await api.updatePago(id, updatedData);
      if (actualizado) {
        setData(prev => ({
          ...prev,
          pagos: prev.pagos.map(p => p.id === id ? actualizado : p)
        }));
        return { success: true, data: actualizado };
      }
      return { success: false, error: 'Error al actualizar pago' };
    } catch (error) {
      console.error('Error actualizando pago:', error);
      return { success: false, error: error.message };
    }
  };

  const deletePago = async (id) => {
    try {
      await api.deletePago(id);
      setData(prev => ({
        ...prev,
        pagos: prev.pagos.filter(p => p.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando pago:', error);
      return { success: false, error: error.message };
    }
  };

  const getPagosByEstudiante = (estudianteId) => data.pagos.filter(p => p.estudianteId === estudianteId);

  // ===== ASISTENCIAS =====
  const addAsistencia = async (asistencia) => {
    try {
      const nueva = await api.createAsistencia(asistencia);
      if (nueva) {
        setData(prev => ({
          ...prev,
          asistencias: [...prev.asistencias, nueva]
        }));
        return { success: true, data: nueva };
      }
      return { success: false, error: 'Error al crear asistencia' };
    } catch (error) {
      console.error('Error creando asistencia:', error);
      return { success: false, error: error.message };
    }
  };

  const updateAsistencia = async (id, updatedData) => {
    try {
      const actualizada = await api.updateAsistencia(id, updatedData);
      if (actualizada) {
        setData(prev => ({
          ...prev,
          asistencias: prev.asistencias.map(a => a.id === id ? actualizada : a)
        }));
        return { success: true, data: actualizada };
      }
      return { success: false, error: 'Error al actualizar asistencia' };
    } catch (error) {
      console.error('Error actualizando asistencia:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteAsistencia = async (id) => {
    try {
      await api.deleteAsistencia(id);
      setData(prev => ({
        ...prev,
        asistencias: prev.asistencias.filter(a => a.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando asistencia:', error);
      return { success: false, error: error.message };
    }
  };

  const getAsistenciasByEstudiante = (estudianteId) => data.asistencias.filter(a => a.estudianteId === estudianteId);
  const getAsistenciasByGrupo = (grupo, fecha) => {
    const estudiantesEnGrupo = data.estudiantes.filter(e => e.grupo === grupo);
    const ids = estudiantesEnGrupo.map(e => e.id);
    let asistencias = data.asistencias.filter(a => ids.includes(a.estudianteId));
    if (fecha) asistencias = asistencias.filter(a => a.fecha === fecha);
    return asistencias;
  };

  // ===== NOTAS =====
  const addNota = async (nota) => {
    try {
      console.log('📝 DataContext: Creando nota:', nota);
      const nueva = await api.createNota(nota);
      console.log('📝 DataContext: Nota creada:', nueva);
      if (nueva) {
        setData(prev => ({
          ...prev,
          notas: [...prev.notas, nueva]
        }));
        return { success: true, data: nueva };
      }
      return { success: false, error: 'Error al crear nota' };
    } catch (error) {
      console.error('Error creando nota:', error);
      return { success: false, error: error.message };
    }
  };

  const updateNota = async (id, updatedData) => {
    try {
      console.log('📝 DataContext: Actualizando nota:', id, updatedData);
      const actualizada = await api.updateNota(id, updatedData);
      console.log('📝 DataContext: Nota actualizada:', actualizada);
      if (actualizada) {
        setData(prev => ({
          ...prev,
          notas: prev.notas.map(n => n.id === id ? actualizada : n)
        }));
        return { success: true, data: actualizada };
      }
      return { success: false, error: 'Error al actualizar nota' };
    } catch (error) {
      console.error('Error actualizando nota:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteNota = async (id) => {
    try {
      await api.deleteNota(id);
      setData(prev => ({
        ...prev,
        notas: prev.notas.filter(n => n.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando nota:', error);
      return { success: false, error: error.message };
    }
  };

  const getNotasByEstudiante = (estudianteId) => data.notas.filter(n => n.estudianteId === estudianteId);
  const getNotasByGrupo = (grupo) => {
    const estudiantesEnGrupo = data.estudiantes.filter(e => e.grupo === grupo);
    const ids = estudiantesEnGrupo.map(e => e.id);
    return data.notas.filter(n => ids.includes(n.estudianteId));
  };

  // ===== USUARIOS =====
  const addUsuario = async (usuario) => {
    try {
      const nuevo = await api.createUsuario(usuario);
      if (nuevo) {
        setData(prev => ({
          ...prev,
          usuarios: [...prev.usuarios, nuevo]
        }));
        return { success: true, data: nuevo };
      }
      return { success: false, error: 'Error al crear usuario' };
    } catch (error) {
      console.error('Error creando usuario:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUsuario = async (id, updatedData) => {
    try {
      const actualizado = await api.updateUsuario(id, updatedData);
      if (actualizado) {
        setData(prev => ({
          ...prev,
          usuarios: prev.usuarios.map(u => u.id === id ? actualizado : u)
        }));
        return { success: true, data: actualizado };
      }
      return { success: false, error: 'Error al actualizar usuario' };
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await api.deleteUsuario(id);
      setData(prev => ({
        ...prev,
        usuarios: prev.usuarios.filter(u => u.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return { success: false, error: error.message };
    }
  };

  const getPromedioByEstudiante = (estudianteId) => {
    const notas = data.notas.filter(n => n.estudianteId === estudianteId);
    if (notas.length === 0) return 0;
    const total = notas.reduce((sum, n) => sum + (n.tecnica + n.tactica + n.actitud) / 3, 0);
    return Math.round((total / notas.length) * 10) / 10;
  };

  const value = {
    data,
    loading,
    error,
    cargarDatos,
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    getEstudianteById,
    getEstudiantesByGrupo,
    addProfesor,
    updateProfesor,
    deleteProfesor,
    getProfesorById,
    addPago,
    updatePago,
    deletePago,
    getPagosByEstudiante,
    addAsistencia,
    updateAsistencia,
    deleteAsistencia,
    getAsistenciasByEstudiante,
    getAsistenciasByGrupo,
    addNota,
    updateNota,
    deleteNota,
    getNotasByEstudiante,
    getNotasByGrupo,
    getPromedioByEstudiante,
    addUsuario,
    updateUsuario,
    deleteUsuario
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
}