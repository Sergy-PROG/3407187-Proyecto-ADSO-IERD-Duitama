const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Costo de hashing bcrypt — balance entre seguridad y rendimiento (estándar recomendado)
const SALT_ROUNDS = 10;

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

module.exports = { login, register, getProfile, updateProfile };