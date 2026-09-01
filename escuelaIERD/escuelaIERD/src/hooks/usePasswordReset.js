import { useState } from 'react';
import { api } from '../services/api';

/**
 * Hook para el flujo de "olvidé mi contraseña", en 2 pasos:
 *
 *  1) requestReset(email, rol)
 *     -> el backend genera un token de un solo uso, lo guarda HASHEADO en la BD
 *        con vencimiento de 1h, y lo envía (por ahora, log de servidor / devToken
 *        en desarrollo; en producción se conecta a un servicio real de correo).
 *
 *  2) confirmReset(token, email, rol, newPassword)
 *     -> el backend valida el token contra su hash en la BD y, si es válido,
 *        hashea la nueva contraseña con bcrypt y la guarda — nunca se guarda
 *        ni se transmite en texto plano a la base de datos.
 *
 * El componente que use este hook solo necesita leer `step`, `loading`,
 * `error`, `info` y llamar a `requestReset` / `confirmReset`.
 */
export function usePasswordReset() {
  const [step, setStep] = useState('request'); // 'request' | 'confirm' | 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [devToken, setDevToken] = useState(''); // solo aparece en modo desarrollo

  const requestReset = async (email, rol) => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const data = await api.forgotPassword(email, rol);
      setInfo(data.message || 'Si la cuenta existe, se generó un enlace de restablecimiento');
      if (data.devToken) setDevToken(data.devToken);
      setStep('confirm');
      return { success: true };
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (token, email, rol, newPassword) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.resetPassword(token, email, rol, newPassword);
      setInfo(data.message || 'Contraseña actualizada correctamente');
      setStep('done');
      return { success: true };
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('request');
    setError('');
    setInfo('');
    setDevToken('');
  };

  return { step, loading, error, info, devToken, requestReset, confirmReset, reset };
}