import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  userData, 
  onSave, 
  onLogout,
  blockedFields = [] 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apodo: '',
    email: '',
    telefono: '',
    cumpleanos: '',
    foto: '',
    rol: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        apodo: userData.apodo || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
        cumpleanos: userData.cumpleanos || '',
        foto: userData.foto || '',
        rol: userData.rol || ''
      });
      setPreviewImage(userData.foto || '');
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (blockedFields.includes(name)) return;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
      setFormData({
        ...formData,
        foto: event.target.result
      });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const editableData = {
        apodo: formData.apodo,
        telefono: formData.telefono,
        foto: formData.foto
      };
      await onSave(editableData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = (fieldName) => blockedFields.includes(fieldName);

  if (!isOpen) return null;

  const showNombre = userData?.nombre !== undefined;
  const showEmail = userData?.email !== undefined;
  const showCumpleanos = userData?.cumpleanos !== undefined;
  const showRol = userData?.rol !== undefined;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <span>👤</span> Mi Perfil
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-club-red/20 border border-club-red/30 rounded-xl p-3 mb-4 text-club-red-light text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Foto de perfil - SIEMPRE EDITABLE */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-club-green/30 shadow-lg">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-club-green-50 flex items-center justify-center text-5xl text-club-green">
                    {formData.nombre?.charAt(0) || '👤'}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-club-green text-white rounded-full cursor-pointer hover:bg-club-green-light transition-all shadow-lg">
                <Icon icon="lucide:camera" className="text-sm" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-neutral-400 mt-2">Toca la cámara para cambiar la foto</p>
          </div>

          {/* Nombre - BLOQUEADO */}
          {showNombre && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nombre completo {isBlocked('nombre') && <span className="text-xs text-neutral-400">(No editable)</span>}
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isBlocked('nombre')}
                className={`w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm outline-none ${isBlocked('nombre') ? 'bg-stone-50 text-neutral-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-club-green'}`}
              />
            </div>
          )}

          {/* Apodo - EDITABLE */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Apodo
            </label>
            <input
              type="text"
              name="apodo"
              value={formData.apodo}
              onChange={handleChange}
              placeholder="Ej: El Crack, Santi..."
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-club-green outline-none"
            />
          </div>

          {/* Email - BLOQUEADO */}
          {showEmail && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Correo electrónico {isBlocked('email') && <span className="text-xs text-neutral-400">(No editable)</span>}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isBlocked('email')}
                className={`w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm outline-none ${isBlocked('email') ? 'bg-stone-50 text-neutral-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-club-green'}`}
              />
            </div>
          )}

          {/* Teléfono - EDITABLE */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 300 555 6677"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-club-green outline-none"
            />
          </div>

          {/* Fecha de nacimiento - BLOQUEADA */}
          {showCumpleanos && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Fecha de nacimiento {isBlocked('cumpleanos') && <span className="text-xs text-neutral-400">(No editable)</span>}
              </label>
              <input
                type="date"
                name="cumpleanos"
                value={formData.cumpleanos}
                onChange={handleChange}
                disabled={isBlocked('cumpleanos')}
                className={`w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm outline-none ${isBlocked('cumpleanos') ? 'bg-stone-50 text-neutral-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-club-green'}`}
              />
            </div>
          )}

          {/* Rol - BLOQUEADO */}
          {showRol && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Rol {isBlocked('rol') && <span className="text-xs text-neutral-400">(No editable)</span>}
              </label>
              <input
                type="text"
                name="rol"
                value={formData.rol === 'admin' ? 'Administrador' : formData.rol === 'profesor' ? 'Profesor' : formData.rol === 'padre' ? 'Padre de familia' : 'Estudiante'}
                onChange={handleChange}
                disabled={isBlocked('rol')}
                className={`w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm outline-none ${isBlocked('rol') ? 'bg-stone-50 text-neutral-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-club-green'}`}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-club-green text-white font-semibold py-3 rounded-xl hover:bg-club-green-light transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-stone-100 text-neutral-600 font-semibold rounded-xl hover:bg-stone-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100">
          <button
            onClick={onLogout}
            className="w-full py-3 text-club-red font-semibold rounded-xl hover:bg-club-red-50 transition-all flex items-center justify-center gap-2"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}