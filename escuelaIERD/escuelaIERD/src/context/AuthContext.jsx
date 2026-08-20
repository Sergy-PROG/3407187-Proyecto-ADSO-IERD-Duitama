import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ierd_session') || sessionStorage.getItem('ierd_session');
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        console.log('📦 Sesión recuperada:', parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('❌ Error al recuperar sesión:', e);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // ===== LOGIN =====
  const login = async (email, password, remember = false) => {
    try {
      console.log('🔐 AuthContext: Intentando login con:', email);

      const result = await api.login(email, password);
      console.log('📦 AuthContext: Respuesta del servidor:', result);

      const userData = { ...result.user, logged: true };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('ierd_session', JSON.stringify(userData));
      storage.setItem('ierd_token', result.token);

      setUser(userData);

      console.log('✅ AuthContext: Usuario guardado correctamente');
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ AuthContext: Error en login:', error);
      return { success: false, error: error.message || 'Error al conectar con el servidor' };
    }
  };

  // ===== REGISTRO =====
  const register = async (userData) => {
    try {
      const result = await api.register({
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        rol: userData.rol || userData.role || 'estudiante',
        apodo: userData.apodo || '',
        telefono: userData.telefono || '',
        cumpleanos: userData.cumpleanos || '',
        foto: userData.foto || '',
        hijo: userData.hijo || '',
        parentesco: userData.parentesco || '',
        documentoHijo: userData.documentoHijo || ''
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message || 'Error al registrar usuario' };
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    localStorage.removeItem('ierd_session');
    localStorage.removeItem('ierd_token');
    sessionStorage.removeItem('ierd_session');
    sessionStorage.removeItem('ierd_token');
    setUser(null);
    console.log('👋 Sesión cerrada');
  };

  // ===== ACTUALIZAR PERFIL =====
  const updateProfile = async (data) => {
    try {
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      const result = await api.updateProfile(data);

      const updatedUser = { ...user, ...result.user, logged: true };

      const storage = localStorage.getItem('ierd_session') ? localStorage : sessionStorage;
      storage.setItem('ierd_session', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, error: error.message || 'Error al actualizar el perfil' };
    }
  };

  // ===== OBTENER USUARIO =====
  const getUser = () => user;

  // ===== VERIFICAR SI ESTÁ AUTENTICADO =====
  const isAuthenticated = () => user !== null && user.logged === true;

  // ===== VERIFICAR ROL =====
  const hasRole = (role) => {
    if (!user) return false;
    const userRol = user.rol || user.role;
    return userRol === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getUser,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}