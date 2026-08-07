const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Costo de hashing bcrypt — balance entre seguridad y rendimiento (estándar recomendado)
const SALT_ROUNDS = 10;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      // Mensaje genérico: no revela si falló el email o la contraseña
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
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
        foto: user.foto
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco } = req.body;
    
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'El correo ya está registrado' });
    }

    // Nunca se guarda la contraseña en texto plano — solo el hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, rol, apodo || null, telefono || null, cumpleanos || null, foto || null, hijo || null, parentesco || null]
    );

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
      'SELECT id, nombre, email, rol, apodo, telefono, cumpleanos, foto FROM usuarios WHERE id = ?',
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
      `UPDATE usuarios SET nombre = ?, apodo = ?, telefono = ?, cumpleanos = ?, foto = ? WHERE id = ?`,
      [nombre, apodo || null, telefono || null, cumpleanos || null, foto || null, req.userId]
    );

    res.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

module.exports = { login, register, getProfile, updateProfile };