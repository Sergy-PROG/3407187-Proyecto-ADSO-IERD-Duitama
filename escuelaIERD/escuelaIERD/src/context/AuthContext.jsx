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
      
      const usuario = await api.getUsuarioByEmail(email);
      console.log('📦 AuthContext: Usuario encontrado:', usuario);
      
      if (usuario && usuario.password === password) {
        console.log('✅ AuthContext: Contraseña correcta');
        
        const userData = {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol || usuario.role, // Por si acaso
          apodo: usuario.apodo || '',
          telefono: usuario.telefono || '',
          cumpleanos: usuario.cumpleanos || '',
          foto: usuario.foto || '',
          logged: true
        };

        console.log('👤 AuthContext: userData a guardar:', userData);

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('ierd_session', JSON.stringify(userData));
        setUser(userData);
        
        console.log('✅ AuthContext: Usuario guardado correctamente');
        return { success: true, user: userData };
      }
      
      console.log('❌ AuthContext: Credenciales incorrectas');
      return { success: false, error: 'Credenciales incorrectas' };
    } catch (error) {
      console.error('❌ AuthContext: Error en login:', error);
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  // ===== REGISTRO =====
  const register = async (userData) => {
    try {
      const existing = await api.getUsuarioByEmail(userData.email);
      if (existing) {
        return { success: false, error: 'El correo ya está registrado' };
      }

      const newUser = await api.createUsuario({
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        rol: userData.rol || userData.role || 'estudiante',
        apodo: userData.apodo || '',
        telefono: userData.telefono || '',
        cumpleanos: userData.cumpleanos || '',
        foto: userData.foto || ''
      });

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    localStorage.removeItem('ierd_session');
    sessionStorage.removeItem('ierd_session');
    setUser(null);
    console.log('👋 Sesión cerrada');
  };

  // ===== ACTUALIZAR PERFIL =====
  const updateProfile = async (data) => {
    try {
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      // Actualizar en la API (si tienes endpoint)
      // Por ahora solo actualizamos localmente
      const updatedUser = {
        ...user,
        nombre: data.nombre || user.nombre,
        apodo: data.apodo || user.apodo,
        telefono: data.telefono || user.telefono,
        cumpleanos: data.cumpleanos || user.cumpleanos,
        foto: data.foto || user.foto,
        email: data.email || user.email
      };

      const storage = localStorage.getItem('ierd_session') ? localStorage : sessionStorage;
      storage.setItem('ierd_session', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, error: 'Error al actualizar el perfil' };
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