const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para obtener el token guardado
function getToken() {
  return localStorage.getItem('ierd_token') || sessionStorage.getItem('ierd_token');
}

// Helper central de fetch: agrega SIEMPRE el header Authorization con el
// token de sesión (todas las rutas del backend, excepto /auth/login y
// /auth/register, están protegidas con authMiddleware y lo exigen).
async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Error HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ===== Traducción de nombres de campo =====
// El backend (MySQL) usa snake_case para la llave foránea del estudiante
// (estudiante_id) en pagos/asistencias/notas, mientras que todo el frontend
// (DataContext, Admin.jsx, Profesor.jsx, Estudiante.jsx) trabaja con
// camelCase (estudianteId). Estas funciones adaptan en ambos sentidos sin
// tener que tocar ni el backend ni los componentes ya existentes.
function toBackendEstudianteId(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const { estudianteId, ...rest } = payload;
  return estudianteId !== undefined
    ? { ...rest, estudiante_id: estudianteId }
    : payload;
}

function fromBackendEstudianteId(item) {
  if (!item || typeof item !== 'object') return item;
  if (item.estudiante_id === undefined) return item;
  return { ...item, estudianteId: item.estudiante_id };
}

// El backend guarda el rol en la columna `rol`; el panel de Admin (y el
// resto del frontend) usa `role`. Se traduce en ambos sentidos.
function toBackendRol(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const { role, ...rest } = payload;
  return role !== undefined ? { ...rest, rol: role } : payload;
}

function fromBackendRol(item) {
  if (!item || typeof item !== 'object') return item;
  if (item.rol === undefined) return item;
  return { ...item, role: item.rol };
}

export const api = {
  // ===== AUTH =====
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data; // { success, token, user }
  },

  async register(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrar usuario');
    return data; // { success, user }
  },

  async getProfile() {
    const data = await request('/auth/profile');
    return data; // { success, user }
  },

  async forgotPassword(email, rol) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, rol })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al solicitar el restablecimiento');
    return data; // { success, message, devToken? }
  },

  async resetPassword(token, email, rol, newPassword) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, rol, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al restablecer la contraseña');
    return data; // { success, message }
  },

  async updateProfile(profileData) {
    const data = await request('/auth/profile', { method: 'PUT', body: profileData });
    return data; // { success, user }
  },

  // ===== USUARIOS =====
  async getUsuarios() {
    try {
      const data = await request('/usuarios');
      return (data || []).map(fromBackendRol);
    } catch (error) {
      console.error('Error en getUsuarios:', error);
      return [];
    }
  },

  async getUsuarioByEmail(email) {
    try {
      const usuarios = await this.getUsuarios();
      return usuarios.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error en getUsuarioByEmail:', error);
      return null;
    }
  },

  async createUsuario(usuario) {
    try {
      const data = await request('/usuarios', { method: 'POST', body: toBackendRol(usuario) });
      return fromBackendRol(data);
    } catch (error) {
      console.error('Error en createUsuario:', error);
      return null;
    }
  },

  async updateUsuario(id, usuario) {
    try {
      const data = await request(`/usuarios/${id}`, { method: 'PUT', body: toBackendRol(usuario) });
      return fromBackendRol(data);
    } catch (error) {
      console.error('Error en updateUsuario:', error);
      return null;
    }
  },

  async deleteUsuario(id) {
    try {
      return await request(`/usuarios/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deleteUsuario:', error);
      return null;
    }
  },

  // ===== ESTUDIANTES =====
  async getEstudiantes() {
    try {
      return await request('/estudiantes');
    } catch (error) {
      console.error('Error en getEstudiantes:', error);
      return [];
    }
  },

  async getEstudianteById(id) {
    try {
      return await request(`/estudiantes/${id}`);
    } catch (error) {
      console.error('Error en getEstudianteById:', error);
      return null;
    }
  },

  async createEstudiante(estudiante) {
    try {
      return await request('/estudiantes', { method: 'POST', body: estudiante });
    } catch (error) {
      console.error('Error en createEstudiante:', error);
      return null;
    }
  },

  async updateEstudiante(id, estudiante) {
    try {
      return await request(`/estudiantes/${id}`, { method: 'PUT', body: estudiante });
    } catch (error) {
      console.error('Error en updateEstudiante:', error);
      return null;
    }
  },

  async deleteEstudiante(id) {
    try {
      return await request(`/estudiantes/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deleteEstudiante:', error);
      return null;
    }
  },

  // ===== PROFESORES =====
  async getProfesores() {
    try {
      return await request('/profesores');
    } catch (error) {
      console.error('Error en getProfesores:', error);
      return [];
    }
  },

  async createProfesor(profesor) {
    try {
      return await request('/profesores', { method: 'POST', body: profesor });
    } catch (error) {
      console.error('Error en createProfesor:', error);
      return null;
    }
  },

  async updateProfesor(id, profesor) {
    try {
      return await request(`/profesores/${id}`, { method: 'PUT', body: profesor });
    } catch (error) {
      console.error('Error en updateProfesor:', error);
      return null;
    }
  },

  async deleteProfesor(id) {
    try {
      return await request(`/profesores/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deleteProfesor:', error);
      return null;
    }
  },

  // ===== PAGOS =====
  async getPagos() {
    try {
      const data = await request('/pagos');
      return (data || []).map(fromBackendEstudianteId);
    } catch (error) {
      console.error('Error en getPagos:', error);
      return [];
    }
  },

  async createPago(pago) {
    try {
      const data = await request('/pagos', { method: 'POST', body: toBackendEstudianteId(pago) });
      return fromBackendEstudianteId(data);
    } catch (error) {
      console.error('Error en createPago:', error);
      return null;
    }
  },

  async updatePago(id, pago) {
    try {
      const data = await request(`/pagos/${id}`, { method: 'PUT', body: toBackendEstudianteId(pago) });
      return fromBackendEstudianteId(data);
    } catch (error) {
      console.error('Error en updatePago:', error);
      return null;
    }
  },

  async deletePago(id) {
    try {
      return await request(`/pagos/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deletePago:', error);
      return null;
    }
  },

  // ===== ASISTENCIAS =====
  async getAsistencias() {
    try {
      const data = await request('/asistencias');
      return (data || []).map(fromBackendEstudianteId);
    } catch (error) {
      console.error('Error en getAsistencias:', error);
      return [];
    }
  },

  async getAsistenciasByGrupo(grupo, fecha) {
    try {
      let path = `/asistencias/grupo?grupo=${encodeURIComponent(grupo)}`;
      if (fecha) path += `&fecha=${fecha}`;
      const data = await request(path);
      return (data || []).map(fromBackendEstudianteId);
    } catch (error) {
      console.error('Error en getAsistenciasByGrupo:', error);
      return [];
    }
  },

  async createAsistencia(asistencia) {
    try {
      const data = await request('/asistencias', { method: 'POST', body: toBackendEstudianteId(asistencia) });
      return fromBackendEstudianteId(data);
    } catch (error) {
      console.error('Error en createAsistencia:', error);
      return null;
    }
  },

  async updateAsistencia(id, asistencia) {
    try {
      const data = await request(`/asistencias/${id}`, { method: 'PUT', body: toBackendEstudianteId(asistencia) });
      return fromBackendEstudianteId(data);
    } catch (error) {
      console.error('Error en updateAsistencia:', error);
      return null;
    }
  },

  async deleteAsistencia(id) {
    try {
      return await request(`/asistencias/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deleteAsistencia:', error);
      return null;
    }
  },

  // ===== NOTAS =====
  async getNotas() {
    try {
      const data = await request('/notas');
      return (data || []).map(fromBackendEstudianteId);
    } catch (error) {
      console.error('Error en getNotas:', error);
      return [];
    }
  },

  async getNotasByGrupo(grupo) {
    try {
      const data = await request(`/notas/grupo?grupo=${encodeURIComponent(grupo)}`);
      return (data || []).map(fromBackendEstudianteId);
    } catch (error) {
      console.error('Error en getNotasByGrupo:', error);
      return [];
    }
  },

  async createNota(nota) {
    try {
      console.log('📝 API: Creando nota:', nota);
      const data = await request('/notas', { method: 'POST', body: toBackendEstudianteId(nota) });
      const result = fromBackendEstudianteId(data);
      console.log('📝 API: Nota creada:', result);
      return result;
    } catch (error) {
      console.error('Error en createNota:', error);
      return null;
    }
  },

  async updateNota(id, nota) {
    try {
      console.log('📝 API: Actualizando nota:', id, nota);
      const data = await request(`/notas/${id}`, { method: 'PUT', body: toBackendEstudianteId(nota) });
      const result = fromBackendEstudianteId(data);
      console.log('📝 API: Nota actualizada:', result);
      return result;
    } catch (error) {
      console.error('Error en updateNota:', error);
      return null;
    }
  },

  async deleteNota(id) {
    try {
      return await request(`/notas/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error en deleteNota:', error);
      return null;
    }
  }
};