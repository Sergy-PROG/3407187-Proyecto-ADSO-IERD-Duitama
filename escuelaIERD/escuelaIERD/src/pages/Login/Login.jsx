import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { usePasswordReset } from '../../hooks/usePasswordReset';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  const [regLoading, setRegLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, label: '', color: '' });

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotRol, setForgotRol] = useState('admin');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const passwordReset = usePasswordReset();

  const openForgotModal = () => {
    setForgotEmail(email);
    setForgotRol(role);
    setResetToken('');
    setNewPassword('');
    setNewPasswordConfirm('');
    passwordReset.reset();
    setShowForgot(true);
  };

  const closeForgotModal = () => {
    setShowForgot(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    await passwordReset.requestReset(forgotEmail, forgotRol);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) return;
    await passwordReset.confirmReset(resetToken, forgotEmail, forgotRol, newPassword);
  };

  const evaluatePasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength({ level: 0, label: '', color: '' });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;

    let level, label, color;
    if (score <= 1) { level = 1; label = '🔴 Débil'; color = 'bg-club-red'; }
    else if (score <= 3) { level = 2; label = '🟡 Media'; color = 'bg-club-amber'; }
    else { level = 3; label = '🟢 Fuerte'; color = 'bg-club-green'; }
    setPasswordStrength({ level, label, color });
  };

  const doPasswordsMatch = () => {
    return regData.password && regData.confirmPassword && regData.password === regData.confirmPassword;
  };

  const quickLogin = async (rol) => {
    let credentials = {};
    if (rol === 'admin') credentials = { email: 'admin@ierdduitama.com', password: 'admin123' };
    else if (rol === 'profesor') credentials = { email: 'profesor@ierdduitama.com', password: 'profe123' };
    else if (rol === 'estudiante') credentials = { email: 'santiago@iestudiante.com', password: '1123456789' };
    else if (rol === 'padre') credentials = { email: 'laura@correo.com', password: '1123456789' };
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
        const redirectMap = { admin: '/admin', profesor: '/profesor', estudiante: '/estudiante', padre: '/estudiante' };
        navigate(redirectMap[result.user.rol]);
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

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
      setRegData({ name: '', email: '', password: '', confirmPassword: '', role: 'padre', childName: '', childDoc: '', parentesco: 'Padre', phone: '' });
      setPasswordStrength({ level: 0, label: '', color: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    const { name, email, password, confirmPassword, role, childName, childDoc, parentesco, phone } = regData;
    if (!privacyAccepted || !isAdult) { setRegError('Debes aceptar la política de privacidad y confirmar ser mayor de edad.'); return; }
    if (!name || !email || !password || !confirmPassword) { setRegError('Todos los campos obligatorios deben estar llenos.'); return; }
    if (password !== confirmPassword) { setRegError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6) { setRegError('La contraseña debe tener mínimo 6 caracteres.'); return; }
    if (role === 'padre' && (!childName || !childDoc || !phone)) { setRegError('Para padres, todos los datos del hijo/a son obligatorios.'); return; }

    setRegLoading(true);
    const result = await register({
      nombre: name, email, password, rol: role,
      telefono: role === 'padre' ? phone : '',
      hijo: role === 'padre' ? childName : '',
      parentesco: role === 'padre' ? parentesco : '',
      documentoHijo: role === 'padre' ? childDoc : ''
    });
    setRegLoading(false);

    if (!result.success) { setRegError(result.error || 'No se pudo completar el registro.'); return; }
    setRegSuccess(true);
    setTimeout(() => {
      setShowRegister(false);
      setRegSuccess(false);
      setRegData({ name: '', email: '', password: '', confirmPassword: '', role: 'padre', childName: '', childDoc: '', parentesco: 'Padre', phone: '' });
      setPasswordStrength({ level: 0, label: '', color: '' });
    }, 2000);
  };

  const roles = [
    { id: 'admin', label: 'Admin', icon: '👨‍💼', color: 'border-club-green' },
    { id: 'profesor', label: 'Profesor', icon: '👨‍🏫', color: 'border-club-orange' },
    { id: 'estudiante', label: 'Estudiante', icon: '👨‍🎓', color: 'border-blue-400' },
    { id: 'padre', label: 'Padre', icon: '👨‍👦', color: 'border-pink-400' },
  ];

  const PasswordStrengthIndicator = () => {
    if (!regData.password) return null;
    const getWidth = () => { if (passwordStrength.level === 1) return 'w-1/3'; if (passwordStrength.level === 2) return 'w-2/3'; if (passwordStrength.level === 3) return 'w-full'; return 'w-0'; };
    const getLabel = () => { if (regData.password.length < 6) return '⚠️ Muy corta (mínimo 6 caracteres)'; return passwordStrength.label; };
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60">Fortaleza:</span>
          <span className={`text-xs font-semibold ${passwordStrength.color === 'bg-club-red' ? 'text-club-red' : passwordStrength.color === 'bg-club-amber' ? 'text-club-amber' : 'text-club-green'}`}>{getLabel()}</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color || 'bg-white/10'} ${getWidth()}`}></div>
        </div>
        {regData.password.length > 0 && regData.password.length < 6 && <p className="text-[10px] text-club-red/70 mt-1">La contraseña debe tener al menos 6 caracteres</p>}
      </div>
    );
  };

  const PasswordMatchIndicator = () => {
    if (!regData.confirmPassword) return null;
    const matches = doPasswordsMatch();
    return <div className="mt-2 flex items-center gap-2"><span className={`text-xs font-semibold ${matches ? 'text-club-green' : 'text-club-red'}`}>{matches ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}</span></div>;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ===== FONDO DINÁMICO ===== */}
      <div className="absolute inset-0 transition-all duration-700">
        <img src={roleBackgrounds[role]?.image} alt={role} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-r ${roleBackgrounds[role]?.gradient}`} />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ===== MODAL RESTABLECER CONTRASEÑA ===== */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-club-dark-2 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={closeForgotModal} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">✕</button>
            <h2 className="text-xl font-bold text-white mb-1">Restablecer contraseña</h2>
            <p className="text-sm text-white/40 mb-6">
              {passwordReset.step === 'request' && 'Ingresa tu correo y rol para generar el enlace'}
              {passwordReset.step === 'confirm' && 'Ingresa el código recibido y tu nueva contraseña'}
              {passwordReset.step === 'done' && '¡Listo!'}
            </p>

            {passwordReset.step === 'request' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Correo electrónico</label>
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Rol de la cuenta</label>
                  <select value={forgotRol} onChange={(e) => setForgotRol(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-club-green outline-none">
                    <option value="admin" className="text-black">Administrador</option>
                    <option value="profesor" className="text-black">Profesor</option>
                    <option value="padre" className="text-black">Padre de familia</option>
                  </select>
                </div>
                {passwordReset.error && <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 text-club-red-light text-sm">{passwordReset.error}</div>}
                <button type="submit" disabled={passwordReset.loading} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">{passwordReset.loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}</button>
              </form>
            )}

            {passwordReset.step === 'confirm' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                {passwordReset.info && <div className="bg-club-green/10 border border-club-green/30 rounded-xl p-3 text-club-green-light text-xs">{passwordReset.info}</div>}
                {passwordReset.devToken && <div className="bg-club-amber/10 border border-club-amber/30 rounded-xl p-3 text-club-amber text-[11px] break-all"><p className="font-semibold mb-1">🔧 Modo desarrollo — token generado:</p>{passwordReset.devToken}</div>}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Código / token recibido</label>
                  <input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="Pega aquí el token" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Nueva contraseña</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="Mínimo 8 caracteres" minLength={8} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Confirmar contraseña</label>
                  <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" minLength={8} required />
                  {newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm && <p className="text-xs text-club-red-light mt-1">Las contraseñas no coinciden</p>}
                </div>
                {passwordReset.error && <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 text-club-red-light text-sm">{passwordReset.error}</div>}
                <button type="submit" disabled={passwordReset.loading || newPassword !== newPasswordConfirm} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">{passwordReset.loading ? 'Guardando...' : 'Guardar nueva contraseña'}</button>
              </form>
            )}

            {passwordReset.step === 'done' && (
              <div className="text-center space-y-4">
                <div className="text-5xl">✅</div>
                <p className="text-white/70 text-sm">{passwordReset.info}</p>
                <button onClick={closeForgotModal} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all">Ir a iniciar sesión</button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ===== MODAL PRIVACIDAD ===== */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-club-dark-2 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={closePrivacyModal} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">✕</button>
            <h2 className="text-xl font-bold text-white mb-4">📋 Tratamiento de datos personales</h2>
            <div className="text-sm text-white/60 space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              <p>La Escuela IERD Duitama, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, informa que los datos personales recolectados serán tratados con la finalidad de gestionar el proceso académico, administrativo y de comunicaciones institucionales.</p>
              <p>Como titular de la información, usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales, así como a revocar la autorización otorgada para su tratamiento.</p>
              <p>Los datos serán almacenados de forma segura y no serán compartidos con terceros sin su autorización previa, salvo obligación legal.</p>
              <p>Para ejercer sus derechos, puede contactar a la administración institucional a través de los canales oficiales.</p>
            </div>
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-club-green rounded" />
                <span className="text-sm text-white/70">He leído y acepto el tratamiento de mis datos personales conforme a la política de privacidad institucional.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} className="mt-1 w-4 h-4 accent-club-green rounded" />
                <span className="text-sm text-white/70">Confirmo ser mayor de edad (18+) o actuar como representante legal de un menor de edad.</span>
              </label>
            </div>
            <button onClick={acceptPrivacy} disabled={!privacyAccepted || !isAdult} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Continuar con el registro
            </button>
          </motion.div>
        </div>
      )}

      {/* ===== MODAL REGISTRO ===== */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-club-dark-2 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowRegister(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">✕</button>
            <h2 className="text-xl font-bold text-white mb-1">Crear nueva cuenta</h2>
            <p className="text-sm text-white/40 mb-6">Completa los datos para registrarte en el sistema</p>

            {regSuccess ? (
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl">✅</div>
                <p className="text-white font-semibold">¡Registro exitoso!</p>
                <p className="text-sm text-white/50">Redirigiendo al login...</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-medium text-white/60 mb-1">Nombre completo</label>
                  <input id="reg-name" name="name" type="text" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="Ej: Juan Pérez" required />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-white/60 mb-1">Correo electrónico</label>
                  <input id="reg-email" name="email" type="email" value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="correo@ejemplo.com" required />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-medium text-white/60 mb-1">Contraseña</label>
                  <div className="relative">
                    <input id="reg-password" name="password" type={showRegPassword ? "text" : "password"} value={regData.password} onChange={(e) => { setRegData({...regData, password: e.target.value}); evaluatePasswordStrength(e.target.value); }} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none pr-10" placeholder="Mínimo 6 caracteres" required />
                    <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                      {showRegPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <PasswordStrengthIndicator />
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-medium text-white/60 mb-1">Confirmar contraseña</label>
                  <div className="relative">
                    <input id="reg-confirm" name="confirmPassword" type={showRegConfirmPassword ? "text" : "password"} value={regData.confirmPassword} onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none pr-10" required />
                    <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                      {showRegConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <PasswordMatchIndicator />
                </div>

                <div>
                  <label htmlFor="reg-role" className="block text-xs font-medium text-white/60 mb-1">Rol</label>
                  <select id="reg-role" name="role" value={regData.role} onChange={(e) => setRegData({...regData, role: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-club-green outline-none">
                    <option value="padre" className="text-black">Padre de familia</option>
                  </select>
                </div>

                {regData.role === 'padre' && (
                  <>
                    <div>
                      <label htmlFor="reg-child" className="block text-xs font-medium text-white/60 mb-1">Nombre del hijo/a</label>
                      <input id="reg-child" name="childName" type="text" value={regData.childName} onChange={(e) => setRegData({...regData, childName: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" required={regData.role === 'padre'} />
                    </div>
                    <div>
                      <label htmlFor="reg-doc" className="block text-xs font-medium text-white/60 mb-1">Documento del hijo/a</label>
                      <input id="reg-doc" name="childDoc" type="text" value={regData.childDoc} onChange={(e) => setRegData({...regData, childDoc: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="Ej: 1123456789" required={regData.role === 'padre'} />
                    </div>
                    <div>
                      <label htmlFor="reg-parentesco" className="block text-xs font-medium text-white/60 mb-1">Parentesco</label>
                      <select id="reg-parentesco" name="parentesco" value={regData.parentesco} onChange={(e) => setRegData({...regData, parentesco: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-club-green outline-none">
                        <option value="Padre" className="text-black">Padre</option>
                        <option value="Madre" className="text-black">Madre</option>
                        <option value="Tutor" className="text-black">Tutor legal</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="reg-phone" className="block text-xs font-medium text-white/60 mb-1">Teléfono de contacto</label>
                      <input id="reg-phone" name="phone" type="tel" value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none" placeholder="Ej: 3101234567" required={regData.role === 'padre'} />
                    </div>
                  </>
                )}

                {regError && <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 text-club-red-light text-sm">{regError}</div>}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={regLoading} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {regLoading ? <div className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando cuenta...</div> : 'Crear cuenta'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* ===== LOGIN PRINCIPAL ===== */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <img src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" alt="IERD" className="h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-sm text-white/40">{roleBackgrounds[role]?.title || 'Selecciona tu rol'}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {roles.map((r) => (
            <motion.button key={r.id} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setRole(r.id)} className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden ${role === r.id ? `${r.color} bg-white/20 border-opacity-100` : 'border-white/10 hover:border-white/30'}`}>
              <div className="relative z-10"><div className="text-2xl">{r.icon}</div><p className={`text-xs font-semibold ${role === r.id ? 'text-white' : 'text-white/50'}`}>{r.label}</p></div>
              {role === r.id && <motion.div layoutId="activeRole" className="absolute inset-0 bg-white/10 rounded-xl" transition={{ duration: 0.3 }} />}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-white/60 mb-1">{role === 'admin' || role === 'profesor' ? 'Correo electrónico' : 'Usuario'}</label>
            <div className="relative">
              <input id="login-email" name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === 'admin' ? 'admin@ierdduitama.com' : role === 'profesor' ? 'profesor@ierdduitama.com' : 'santiago@iestudiante.com'} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none transition-all" required />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-white/60 mb-1">{role === 'admin' || role === 'profesor' ? 'Contraseña' : 'Documento de identidad'}</label>
            <div className="relative">
              <input id="login-password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={role === 'admin' || role === 'profesor' ? '••••••••' : '1123456789'} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-club-green outline-none transition-all pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">{showPassword ? '👁️' : '👁️‍🗨️'}</button>
            </div>

            {(role === 'admin' || role === 'profesor' || role === 'padre') && (
              <div className="text-right mt-2">
                <button type="button" onClick={openForgotModal} className="text-xs text-club-green-light hover:text-white underline transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </div>

          {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 text-club-red-light text-sm">{error}</motion.div>}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-club-green/25 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <div className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Verificando...</div> : 'Iniciar Sesión'}
          </motion.button>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-white/40 mb-3">⚡ Acceso rápido (sin formulario)</p>
          <div className="grid grid-cols-2 gap-2">
            {[ { id: 'admin', label: 'Admin', icon: '👨‍💼' }, { id: 'profesor', label: 'Profesor', icon: '👨‍🏫' }, { id: 'estudiante', label: 'Estudiante', icon: '👨‍🎓' }, { id: 'padre', label: 'Padre', icon: '👨‍👦' } ].map((item) => (
              <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => quickLogin(item.id)} className={`py-2 ${item.id === 'admin' ? 'bg-club-green/20 hover:bg-club-green/30 border-club-green/30 text-club-green-light' : item.id === 'profesor' ? 'bg-club-orange/20 hover:bg-club-orange/30 border-club-orange/30 text-club-orange-light' : item.id === 'estudiante' ? 'bg-blue-400/20 hover:bg-blue-400/30 border-blue-400/30 text-blue-400' : 'bg-pink-400/20 hover:bg-pink-400/30 border-pink-400/30 text-pink-400'} border text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1`}>
                <span>{item.icon}</span> {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[12px] text-white/40 mb-3">¿No tienes una cuenta?</p>
          <button onClick={openPrivacyModal} className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"><span>👤</span> Crear nueva cuenta</button>
        </div>

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