const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

// Costo de hashing bcrypt — balance entre seguridad y rendimiento (estándar recomendado)
const SALT_ROUNDS = 10;

// El enlace de restablecimiento vence 1 hora después de solicitarse
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Puede haber más de una cuenta con el mismo correo (por ejemplo,
    // un padre y su hijo/a comparten el correo del padre, cada uno con
    // su propia contraseña). Se revisan todas hasta encontrar la que
    // coincide con la contraseña enviada.
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      // Mensaje genérico: no revela si falló el email o la contraseña
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }

    let user = null;
    for (const candidato of rows) {
      const coincide = await bcrypt.compare(password, candidato.password);
      if (coincide) {
        user = candidato;
        break;
      }
    }

    if (!user) {
      // Mismo mensaje genérico que arriba, mismo código 401
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        apodo: user.apodo,
        telefono: user.telefono,
        cumpleanos: user.cumpleanos,
        foto: user.foto,
        hijo: user.hijo,
        parentesco: user.parentesco
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco, documentoHijo } = req.body;

    // Un mismo correo puede tener varias cuentas (padre + estudiante),
    // pero no dos cuentas del mismo rol con el mismo correo.
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND rol = ?', [email, rol]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Ya existe una cuenta de este tipo con ese correo' });
    }

    // Nunca se guarda la contraseña en texto plano — solo el hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, rol, apodo || null, telefono || null, cumpleanos || null, foto || null, hijo || null, parentesco || null]
    );

    // Si quien se registra es un padre/acudiente, se crea además la
    // cuenta con la que el hijo/a inicia sesión: mismo correo del padre,
    // pero como contraseña se usa su documento de identidad.
    if (rol === 'padre' && hijo && documentoHijo) {
      const [existingHijoUsuario] = await pool.query(
        'SELECT id FROM usuarios WHERE email = ? AND rol = ?', [email, 'estudiante']
      );

      let estudianteUsuarioId;
      if (existingHijoUsuario.length === 0) {
        const hashedDocumento = await bcrypt.hash(String(documentoHijo), SALT_ROUNDS);
        const [insertUsuarioHijo] = await pool.query(
          `INSERT INTO usuarios (nombre, email, password, rol, telefono)
           VALUES (?, ?, ?, 'estudiante', ?)`,
          [hijo, email, hashedDocumento, telefono || null]
        );
        estudianteUsuarioId = insertUsuarioHijo.insertId;
      } else {
        estudianteUsuarioId = existingHijoUsuario[0].id;
      }

      // Se vincula (o se crea) el registro del estudiante en el roster
      // deportivo, quedando "Sin asignar" hasta que un Admin o Profesor
      // le asigne su grupo real (Infantil, Prejuvenil, Juvenil, Femenino).
      const [existingEstudiante] = await pool.query(
        'SELECT id FROM estudiantes WHERE documento = ?', [documentoHijo]
      );
      if (existingEstudiante.length === 0) {
        await pool.query(
          `INSERT INTO estudiantes (nombre, documento, grupo, acudiente, estado, usuario_id)
           VALUES (?, ?, 'Sin asignar', ?, 'Activo', ?)`,
          [hijo, documentoHijo, nombre, estudianteUsuarioId]
        );
      } else {
        await pool.query(
          'UPDATE estudiantes SET usuario_id = ? WHERE id = ?',
          [estudianteUsuarioId, existingEstudiante[0].id]
        );
      }
    }

    res.status(201).json({
      success: true,
      user: { id: result.insertId, nombre, email, rol }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco FROM usuarios WHERE id = ?',
      [req.userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nombre, apodo, telefono, cumpleanos, foto } = req.body;
    
    await pool.query(
      `UPDATE usuarios SET nombre = COALESCE(?, nombre), apodo = ?, telefono = ?, cumpleanos = ?, foto = ? WHERE id = ?`,
      [nombre, apodo || null, telefono || null, cumpleanos || null, foto || null, req.userId]
    );

    res.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// ===== SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA =====
// Genera un token de un solo uso y con vencimiento. Igual que la contraseña,
// en la base de datos NUNCA se guarda el token "usable": se guarda su hash
// (sha256) y solo el valor en crudo (rawToken) viaja al usuario, normalmente
// por correo. Aquí, mientras no haya un proveedor de correo configurado, se
// registra en el log del servidor y (solo fuera de producción) se devuelve
// en la respuesta para poder probar el flujo end-to-end.
const forgotPassword = async (req, res) => {
  try {
    const { email, rol } = req.body;

    if (!email || !rol) {
      return res.status(400).json({ success: false, error: 'Correo y rol son requeridos' });
    }

    const [rows] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND rol = ?',
      [email, rol]
    );

    // Respuesta genérica siempre, exista o no la cuenta: evita que alguien
    // use este endpoint para averiguar qué correos están registrados.
    const respuestaGenerica = {
      success: true,
      message: 'Si la cuenta existe, se generó un enlace de restablecimiento'
    };

    if (rows.length === 0) {
      return res.json(respuestaGenerica);
    }

    const user = rows[0];

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await pool.query(
      'UPDATE usuarios SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [hashedToken, expires, user.id]
    );

    // Enviar el correo con el enlace de restablecimiento
    try {
      const { sendResetPasswordEmail } = require('../services/emailService.cjs');
      await sendResetPasswordEmail(email, rawToken, rol);
    } catch (emailError) {
      console.error('Error enviando correo:', emailError);
      // Si falla el correo, igual devolvemos éxito pero con devToken para debug
      if (process.env.NODE_ENV !== 'production') {
        return res.json({ ...respuestaGenerica, devToken: rawToken, warning: 'No se pudo enviar el correo, verifica la configuración' });
      }
      // En producción, si falla el correo, informamos del error
      return res.status(500).json({ success: false, error: 'No se pudo enviar el correo de restablecimiento' });
    }

    res.json(respuestaGenerica);
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// ===== CONFIRMAR RESTABLECIMIENTO (guarda la nueva contraseña) =====
const resetPassword = async (req, res) => {
  try {
    const { token, email, rol, newPassword } = req.body;

    if (!token || !email || !rol || !newPassword) {
      return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [rows] = await pool.query(
      `SELECT id FROM usuarios
       WHERE email = ? AND rol = ? AND reset_password_token = ? AND reset_password_expires > NOW()`,
      [email, rol, hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'El enlace es inválido o ya expiró' });
    }

    const user = rows[0];

    // Se hashea con bcrypt exactamente igual que en login/register — la
    // contraseña en texto plano nunca llega a tocar la base de datos.
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.query(
      `UPDATE usuarios
       SET password = ?, reset_password_token = NULL, reset_password_expires = NULL
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

module.exports = { login, register, getProfile, updateProfile, forgotPassword, resetPassword };