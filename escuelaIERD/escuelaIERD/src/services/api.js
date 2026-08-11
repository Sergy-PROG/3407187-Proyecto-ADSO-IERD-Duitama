const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para obtener el token guardado
function getToken() {
  return localStorage.getItem('ierd_token') || sessionStorage.getItem('ierd_token');
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
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener perfil');
    return data; // { success, user }
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al actualizar el perfil');
    return data; // { success, user }
  },

  // ===== USUARIOS =====
  async getUsuarios() {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getUsuarios:', error);
      return [];
    }
  },

  async getUsuarioByEmail(email) {
    try {
      const res = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error en getUsuarioByEmail:', error);
      return null;
    }
  },

  async createUsuario(usuario) {
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...usuario,
          createdAt: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en createUsuario:', error);
      return null;
    }
  },

  async updateUsuario(id, usuario) {
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en updateUsuario:', error);
      return null;
    }
  },

  async deleteUsuario(id) {
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deleteUsuario:', error);
      return null;
    }
  },

  // ===== ESTUDIANTES =====
  async getEstudiantes() {
    try {
      const res = await fetch(`${API_URL}/estudiantes`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getEstudiantes:', error);
      return [];
    }
  },

  async getEstudianteById(id) {
    try {
      const res = await fetch(`${API_URL}/estudiantes/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getEstudianteById:', error);
      return null;
    }
  },

  async createEstudiante(estudiante) {
    try {
      const res = await fetch(`${API_URL}/estudiantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en createEstudiante:', error);
      return null;
    }
  },

  async updateEstudiante(id, estudiante) {
    try {
      const res = await fetch(`${API_URL}/estudiantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en updateEstudiante:', error);
      return null;
    }
  },

  async deleteEstudiante(id) {
    try {
      const res = await fetch(`${API_URL}/estudiantes/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deleteEstudiante:', error);
      return null;
    }
  },

  // ===== PROFESORES =====
  async getProfesores() {
    try {
      const res = await fetch(`${API_URL}/profesores`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getProfesores:', error);
      return [];
    }
  },

  async createProfesor(profesor) {
    try {
      const res = await fetch(`${API_URL}/profesores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profesor)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en createProfesor:', error);
      return null;
    }
  },

  async updateProfesor(id, profesor) {
    try {
      const res = await fetch(`${API_URL}/profesores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profesor)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en updateProfesor:', error);
      return null;
    }
  },

  async deleteProfesor(id) {
    try {
      const res = await fetch(`${API_URL}/profesores/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deleteProfesor:', error);
      return null;
    }
  },

  // ===== PAGOS =====
  async getPagos() {
    try {
      const res = await fetch(`${API_URL}/pagos`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getPagos:', error);
      return [];
    }
  },

  async createPago(pago) {
    try {
      const res = await fetch(`${API_URL}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pago)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en createPago:', error);
      return null;
    }
  },

  async updatePago(id, pago) {
    try {
      const res = await fetch(`${API_URL}/pagos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pago)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en updatePago:', error);
      return null;
    }
  },

  async deletePago(id) {
    try {
      const res = await fetch(`${API_URL}/pagos/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deletePago:', error);
      return null;
    }
  },

  // ===== ASISTENCIAS =====
  async getAsistencias() {
    try {
      const res = await fetch(`${API_URL}/asistencias`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getAsistencias:', error);
      return [];
    }
  },

  async getAsistenciasByGrupo(grupo, fecha) {
    try {
      let url = `${API_URL}/asistencias?grupo=${encodeURIComponent(grupo)}`;
      if (fecha) url += `&fecha=${fecha}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getAsistenciasByGrupo:', error);
      return [];
    }
  },

  async createAsistencia(asistencia) {
    try {
      const res = await fetch(`${API_URL}/asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en createAsistencia:', error);
      return null;
    }
  },

  async updateAsistencia(id, asistencia) {
    try {
      const res = await fetch(`${API_URL}/asistencias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asistencia)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en updateAsistencia:', error);
      return null;
    }
  },

  async deleteAsistencia(id) {
    try {
      const res = await fetch(`${API_URL}/asistencias/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deleteAsistencia:', error);
      return null;
    }
  },

  // ===== NOTAS =====
  async getNotas() {
    try {
      const res = await fetch(`${API_URL}/notas`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getNotas:', error);
      return [];
    }
  },

  async getNotasByGrupo(grupo) {
    try {
      const res = await fetch(`${API_URL}/notas?grupo=${encodeURIComponent(grupo)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getNotasByGrupo:', error);
      return [];
    }
  },

  async createNota(nota) {
    try {
      console.log('📝 API: Creando nota:', nota);
      const res = await fetch(`${API_URL}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('📝 API: Nota creada:', data);
      return data;
    } catch (error) {
      console.error('Error en createNota:', error);
      return null;
    }
  },

  async updateNota(id, nota) {
    try {
      console.log('📝 API: Actualizando nota:', id, nota);
      const res = await fetch(`${API_URL}/notas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('📝 API: Nota actualizada:', data);
      return data;
    } catch (error) {
      console.error('Error en updateNota:', error);
      return null;
    }
  },

  async deleteNota(id) {
    try {
      const res = await fetch(`${API_URL}/notas/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en deleteNota:', error);
      return null;
    }
  }
};