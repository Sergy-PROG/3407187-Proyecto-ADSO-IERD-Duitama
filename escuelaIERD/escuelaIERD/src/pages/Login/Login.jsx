import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ===== IMÁGENES POR ROL =====
  const roleBackgrounds = {
    admin: {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-club-green/90 to-club-dark-2/90',
      icon: '👨‍💼',
      title: 'Administrador'
    },
    profesor: {
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-club-orange/90 to-club-dark-2/90',
      icon: '👨‍🏫',
      title: 'Profesor'
    },
    estudiante: {
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-blue-600/90 to-club-dark-2/90',
      icon: '👨‍🎓',
      title: 'Estudiante'
    },
    padre: {
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-pink-500/90 to-club-dark-2/90',
      icon: '👨‍👦',
      title: 'Padre de Familia'
    }
  };

  // ===== ESTADOS PARA REGISTRO =====
  const [showRegister, setShowRegister] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'padre',
    childName: '',
    childDoc: '',
    parentesco: 'Padre',
    phone: ''
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  
  // ===== ESTADOS PARA SEGURIDAD DE CONTRASEÑA =====
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, label: '', color: '' });

  // ===== FUNCIÓN PARA EVALUAR FORTALEZA DE CONTRASEÑA =====
  const evaluatePasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength({ level: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    const hasLowercase = /[a-z]/.test(pass);
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const length = pass.length;

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (hasLowercase && hasUppercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let level, label, color;
    if (score <= 1) {
      level = 1;
      label = '🔴 Débil';
      color = 'bg-club-red';
    } else if (score <= 3) {
      level = 2;
      label = '🟡 Media';
      color = 'bg-club-amber';
    } else {
      level = 3;
      label = '🟢 Fuerte';
      color = 'bg-club-green';
    }

    setPasswordStrength({ level, label, color });
  };

  // ===== FUNCIÓN PARA VERIFICAR SI CONTRASEÑAS COINCIDEN =====
  const doPasswordsMatch = () => {
    return regData.password && regData.confirmPassword && regData.password === regData.confirmPassword;
  };

  // ===== FUNCIONES DE LOGIN =====
  const quickLogin = async (rol) => {
    let credentials = {};
    if (rol === 'admin') {
      credentials = { email: 'admin@ierdduitama.com', password: 'admin123' };
    } else if (rol === 'profesor') {
      credentials = { email: 'profesor@ierdduitama.com', password: 'profe123' };
    } else if (rol === 'estudiante') {
      credentials = { email: 'santiago@iestudiante.com', password: '1123456789' };
    } else if (rol === 'padre') {
      credentials = { email: 'laura@correo.com', password: '1123456789' };
    }
    setEmail(credentials.email);
    setPassword(credentials.password);
    setRole(rol);
    await handleLogin(credentials.email, credentials.password);
  };

  const handleLogin = async (emailVal, passVal) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(emailVal, passVal, false);
      setLoading(false);
      
      if (result.success) {
        const redirectMap = {
          admin: '/admin',
          profesor: '/profesor',
          estudiante: '/estudiante',
          padre: '/estudiante'
        };
        navigate(redirectMap[result.user.rol]);
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  // ===== FUNCIONES DE REGISTRO =====
  const openPrivacyModal = () => {
    setPrivacyAccepted(false);
    setIsAdult(false);
    setShowPrivacy(true);
  };

  const closePrivacyModal = () => {
    setShowPrivacy(false);
  };

  const acceptPrivacy = () => {
    if (privacyAccepted && isAdult) {
      setShowPrivacy(false);
      setShowRegister(true);
      setRegError('');
      setRegSuccess(false);
      setRegData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'padre',
        childName: '',
        childDoc: '',
        parentesco: 'Padre',
        phone: ''
      });
      setPasswordStrength({ level: 0, label: '', color: '' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError('');
    
    const { name, email, password, confirmPassword, role, childName, childDoc, parentesco, phone } = regData;
    
    if (!privacyAccepted || !isAdult) {
      setRegError('Debes aceptar la política de privacidad y confirmar ser mayor de edad.');
      return;
    }
    
    if (!name || !email || !password || !confirmPassword) {
      setRegError('Todos los campos obligatorios deben estar llenos.');
      return;
    }
    
    if (password !== confirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }
    
    if (password.length < 6) {
      setRegError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }
    
    if (role === 'padre') {
      if (!childName || !childDoc || !phone) {
        setRegError('Para padres, todos los datos del hijo/a son obligatorios.');
        return;
      }
    }
    
    setRegSuccess(true);
    setRegError('');
    
    const newUser = {
      name,
      email,
      role,
      childName: role === 'padre' ? childName : null,
      childDoc: role === 'padre' ? childDoc : null,
      parentesco: role === 'padre' ? parentesco : null,
      phone: role === 'padre' ? phone : null,
      registeredAt: new Date().toISOString()
    };
    
    const users = JSON.parse(localStorage.getItem('ierd_registered_users') || '[]');
    users.push(newUser);
    localStorage.setItem('ierd_registered_users', JSON.stringify(users));
    
    setTimeout(() => {
      setShowRegister(false);
      setRegSuccess(false);
      setRegData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'padre',
        childName: '',
        childDoc: '',
        parentesco: 'Padre',
        phone: ''
      });
      setPasswordStrength({ level: 0, label: '', color: '' });
    }, 2000);
  };

  const roles = [
    { id: 'admin', label: 'Admin', icon: '👨‍💼', color: 'border-club-green' },
    { id: 'profesor', label: 'Profesor', icon: '👨‍🏫', color: 'border-club-orange' },
    { id: 'estudiante', label: 'Estudiante', icon: '👨‍🎓', color: 'border-blue-400' },
    { id: 'padre', label: 'Padre', icon: '👨‍👦', color: 'border-pink-400' },
  ];

  // ===== COMPONENTE DE FORTALEZA DE CONTRASEÑA =====
  const PasswordStrengthIndicator = () => {
    if (!regData.password) return null;
    
    const getWidth = () => {
      if (passwordStrength.level === 1) return 'w-1/3';
      if (passwordStrength.level === 2) return 'w-2/3';
      if (passwordStrength.level === 3) return 'w-full';
      return 'w-0';
    };

    const getLabel = () => {
      if (regData.password.length < 6) return '⚠️ Muy corta (mínimo 6 caracteres)';
      return passwordStrength.label;
    };

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60">Fortaleza:</span>
          <span className={`text-xs font-semibold ${passwordStrength.color === 'bg-club-red' ? 'text-club-red' : passwordStrength.color === 'bg-club-amber' ? 'text-club-amber' : 'text-club-green'}`}>
            {getLabel()}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color || 'bg-white/10'} ${getWidth()}`}
          ></div>
        </div>
        {regData.password.length > 0 && regData.password.length < 6 && (
          <p className="text-[10px] text-club-red/70 mt-1">La contraseña debe tener al menos 6 caracteres</p>
        )}
      </div>
    );
  };

  // ===== COMPONENTE DE VALIDACIÓN DE CONFIRMACIÓN =====
  const PasswordMatchIndicator = () => {
    if (!regData.confirmPassword) return null;
    
    const matches = doPasswordsMatch();
    
    return (
      <div className="mt-2 flex items-center gap-2">
        <span className={`text-xs font-semibold ${matches ? 'text-club-green' : 'text-club-red'}`}>
          {matches ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ===== FONDO CON IMAGEN SEGÚN ROL ===== */}
      <div className="absolute inset-0 transition-all duration-700">
        <img 
          src={roleBackgrounds[role]?.image} 
          alt={role} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${roleBackgrounds[role]?.gradient}`} />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ===== MODAL DE POLÍTICA DE PRIVACIDAD ===== */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-club-dark-2 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-white flex items-center gap-2">
                <span>🛡️</span> Política de Privacidad
              </h3>
              <button onClick={closePrivacyModal} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                ✕
              </button>
            </div>

            <div className="bg-club-orange/10 border border-club-orange/20 rounded-xl p-3 mb-4 flex items-start gap-3">
              <span className="text-club-orange-light text-base mt-0.5">ℹ️</span>
              <div>
                <p className="text-xs text-club-orange-light font-semibold mb-0.5">Registro exclusivo para mayores de edad</p>
                <p className="text-[11px] text-white/50 leading-relaxed">Los estudiantes menores de edad no pueden crear cuentas directamente. Su registro debe ser realizado por su padre, madre o acudiente legal.</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-5 max-h-56 overflow-y-auto border border-white/5">
              <div className="space-y-4 text-[12px] text-white/65 leading-relaxed">
                <div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1.5">Política de Privacidad y Protección de Datos</h4>
                  <p className="text-[11px] text-white/40 mb-3">Plataforma de Gestión Educativa Escolar (EduWeb)</p>
                  <p>La presente Política de Privacidad establece los términos y condiciones bajo los cuales se recopilan, almacenan, tratan y protegen los datos personales de los usuarios dentro de la plataforma escolar web.</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-club-green-light mb-1">1. Responsable del Tratamiento de Datos</h5>
                  <p>El tratamiento de los datos recolectados en esta aplicación web se realiza en el marco del desarrollo del proyecto académico institucional. El sistema garantiza el cumplimiento normativo aplicable a la protección de datos personales (<strong className="text-white/80">Ley 1581 de 2012</strong> en Colombia).</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-club-green-light mb-1">2. Datos Personales Recolectados</h5>
                  <ul className="space-y-1.5 ml-3">
                    <li className="flex items-start gap-2"><span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span><span><strong className="text-white/80">Estudiantes:</strong> Nombres completos, número de identificación, calificaciones, asistencias, historial académico y datos de contacto del acudiente.</span></li>
                    <li className="flex items-start gap-2"><span className="w-1 h-1 bg-club-orange-light rounded-full mt-1.5 flex-shrink-0"></span><span><strong className="text-white/80">Profesores:</strong> Información profesional, asignaturas a cargo, registros de asistencia docente, correos electrónicos institucionales y evaluaciones emitidas.</span></li>
                    <li className="flex items-start gap-2"><span className="w-1 h-1 bg-club-green-light rounded-full mt-1.5 flex-shrink-0"></span><span><strong className="text-white/80">Administradores:</strong> Registros de auditoría del sistema, credenciales de acceso cifradas y gestión de usuarios globales.</span></li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] text-club-orange-light font-semibold mb-1 flex items-center gap-1"><span>🔒</span> Nota de Confidencialidad Académica</p>
                  <p className="text-[10px] text-white/40">Este software cumple propósitos estrictamente educativos y de simulación de arquitectura de desarrollo. Toda la información almacenada es ficticia o cuenta con fines académicos controlados.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-club-green focus:ring-club-green"
                />
                <span className="text-xs text-white/55 group-hover:text-white/75 transition-colors leading-relaxed">
                  He leído y acepto la <strong className="text-club-green-light">Política de Privacidad y Protección de Datos</strong> de la plataforma EduWeb.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isAdult}
                  onChange={(e) => setIsAdult(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-club-green focus:ring-club-green"
                />
                <span className="text-xs text-white/55 group-hover:text-white/75 transition-colors leading-relaxed">
                  Declaro ser <strong className="text-club-orange-light">mayor de edad (18 años o más)</strong> y soy responsable de la veracidad de los datos proporcionados.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={closePrivacyModal} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 font-medium py-3 rounded-xl transition-all text-sm">
                Cancelar
              </button>
              <button 
                onClick={acceptPrivacy}
                className={`flex-1 font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                  privacyAccepted && isAdult 
                    ? 'bg-club-green hover:bg-club-green-light text-white' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <span>➡️</span> Continuar al Registro
              </button>
            </div>
            <p className="text-center text-[10px] text-white/20 mt-3">Debes aceptar ambos términos para continuar</p>
          </motion.div>
        </div>
      )}

      {/* ===== MODAL DE REGISTRO ===== */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-club-dark-2 border border-white/10 rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-white flex items-center gap-2">
                <span>👤</span> Crear Cuenta
              </h3>
              <button onClick={() => { setShowRegister(false); setRegSuccess(false); }} className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                ✕
              </button>
            </div>

            {regSuccess ? (
              <div className="bg-club-green/20 border border-club-green/30 rounded-xl p-4 text-center">
                <p className="text-club-green-light text-sm font-semibold">✅ ¡Cuenta creada exitosamente!</p>
                <p className="text-xs text-white/40 mt-1">Ya puedes iniciar sesión con tus credenciales.</p>
              </div>
            ) : (
              <>
                <div className="bg-club-green/10 border border-club-green/20 rounded-lg p-2.5 mb-4 flex items-center gap-2">
                  <span className="text-club-green-light text-sm">🛡️</span>
                  <p className="text-[10px] text-club-green-light">Política de privacidad aceptada · Mayor de edad verificado</p>
                </div>

                {regError && (
                  <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 mb-4 flex items-center gap-3">
                    <span className="text-club-red-light text-sm">❌</span>
                    <p className="text-xs text-club-red-light">{regError}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Nombre completo *</label>
                    <input 
                      type="text" 
                      value={regData.name}
                      onChange={(e) => setRegData({...regData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" 
                      placeholder="Tu nombre completo" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Correo electrónico *</label>
                    <input 
                      type="email" 
                      value={regData.email}
                      onChange={(e) => setRegData({...regData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" 
                      placeholder="tu@correo.com" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Contraseña *</label>
                    <div className="relative">
                      <input 
                        type={showRegPassword ? "text" : "password"} 
                        value={regData.password}
                        onChange={(e) => {
                          setRegData({...regData, password: e.target.value});
                          evaluatePasswordStrength(e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none pr-10" 
                        placeholder="Mínimo 6 caracteres" 
                        required 
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showRegPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <PasswordStrengthIndicator />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Confirmar contraseña *</label>
                    <div className="relative">
                      <input 
                        type={showRegConfirmPassword ? "text" : "password"} 
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none pr-10" 
                        placeholder="Repite tu contraseña" 
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showRegConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <PasswordMatchIndicator />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Rol</label>
                    <select 
                      value={regData.role}
                      onChange={(e) => setRegData({...regData, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-club-green outline-none"
                    >
                      <option value="padre" className="bg-club-dark-2">Padre de familia / Acudiente</option>
                      <option value="profesor" className="bg-club-dark-2">Profesor</option>
                      <option value="admin" className="bg-club-dark-2">Administrador</option>
                    </select>
                  </div>

                  {regData.role === 'padre' && (
                    <div className="bg-white/5 rounded-xl p-3 border border-club-green/15 space-y-3">
                      <p className="text-[11px] text-club-green-light font-semibold flex items-center gap-1.5 mb-1">
                        <span>👶</span> Datos del estudiante (hijo/a)
                      </p>
                      <div>
                        <label className="block text-[11px] font-medium text-white/60 mb-1">Nombre completo del hijo/a *</label>
                        <input 
                          type="text" 
                          value={regData.childName}
                          onChange={(e) => setRegData({...regData, childName: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" 
                          placeholder="Nombre del estudiante" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-white/60 mb-1">Documento de identidad del hijo/a *</label>
                        <input 
                          type="text" 
                          value={regData.childDoc}
                          onChange={(e) => setRegData({...regData, childDoc: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" 
                          placeholder="Ej: 1123456789" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-white/60 mb-1">Parentesco *</label>
                        <select 
                          value={regData.parentesco}
                          onChange={(e) => setRegData({...regData, parentesco: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-club-green outline-none"
                        >
                          <option value="Padre">Padre</option>
                          <option value="Madre">Madre</option>
                          <option value="Acudiente">Acudiente</option>
                          <option value="Tutor legal">Tutor legal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-white/60 mb-1">Teléfono de contacto *</label>
                        <input 
                          type="tel" 
                          value={regData.phone}
                          onChange={(e) => setRegData({...regData, phone: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" 
                          placeholder="Ej: 300 555 6677" 
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-club-red hover:bg-club-red-light text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>👤</span> Crear Cuenta
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* ===== LOGIN PRINCIPAL ===== */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <img 
            src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" 
            alt="IERD" 
            className="h-12 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-sm text-white/40">{roleBackgrounds[role]?.title || 'Selecciona tu rol'}</p>
        </motion.div>

        {/* ===== ROLES CON ANIMACIÓN ===== */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {roles.map((r) => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole(r.id)}
              className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                role === r.id 
                  ? `${r.color} bg-white/20 border-opacity-100` 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="relative z-10">
                <div className="text-2xl">{r.icon}</div>
                <p className={`text-xs font-semibold ${role === r.id ? 'text-white' : 'text-white/50'}`}>
                  {r.label}
                </p>
              </div>
              {role === r.id && (
                <motion.div
                  layoutId="activeRole"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* ===== FORMULARIO DE LOGIN ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              {role === 'admin' || role === 'profesor' ? 'Correo electrónico' : 'Usuario'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'admin' ? 'admin@ierdduitama.com' :
                  role === 'profesor' ? 'profesor@ierdduitama.com' :
                  'santiago@iestudiante.com'
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              {role === 'admin' || role === 'profesor' ? 'Contraseña' : 'Documento de identidad'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={role === 'admin' || role === 'profesor' ? '••••••••' : '1123456789'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 text-club-red-light text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-club-green/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verificando...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </motion.button>
        </form>

        {/* ===== BOTONES DE ACCESO RÁPIDO ===== */}
        <div className="mt-6">
          <p className="text-center text-xs text-white/40 mb-3">⚡ Acceso rápido (sin formulario)</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'admin', label: 'Admin', icon: '👨‍💼' },
              { id: 'profesor', label: 'Profesor', icon: '👨‍🏫' },
              { id: 'estudiante', label: 'Estudiante', icon: '👨‍🎓' },
              { id: 'padre', label: 'Padre', icon: '👨‍👦' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => quickLogin(item.id)}
                className={`py-2 ${item.id === 'admin' ? 'bg-club-green/20 hover:bg-club-green/30 border-club-green/30 text-club-green-light' : 
                  item.id === 'profesor' ? 'bg-club-orange/20 hover:bg-club-orange/30 border-club-orange/30 text-club-orange-light' :
                  item.id === 'estudiante' ? 'bg-blue-400/20 hover:bg-blue-400/30 border-blue-400/30 text-blue-400' :
                  'bg-pink-400/20 hover:bg-pink-400/30 border-pink-400/30 text-pink-400'} 
                  border text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1`}
              >
                <span>{item.icon}</span> {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ===== BOTÓN CREAR CUENTA ===== */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[12px] text-white/40 mb-3">¿No tienes una cuenta?</p>
          <button 
            onClick={openPrivacyModal}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
          >
            <span>👤</span> Crear nueva cuenta
          </button>
        </div>

        {/* ===== CREDENCIALES DE PRUEBA ===== */}
        <div className="mt-4 bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-white/40 font-semibold mb-1.5">🔑 Credenciales de prueba:</p>
          <div className="space-y-0.5 text-[10px] text-white/40">
            <p><span className="text-club-green-light font-bold">Admin:</span> admin@ierdduitama.com / admin123</p>
            <p><span className="text-club-orange-light font-bold">Profesor:</span> profesor@ierdduitama.com / profe123</p>
            <p><span className="text-blue-400 font-bold">Estudiante:</span> santiago@iestudiante.com / 1123456789</p>
            <p><span className="text-pink-400 font-bold">Padre:</span> laura@correo.com / 1123456789</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">← Volver al sitio</a>
        </div>
      </div>
    </div>
  );
}