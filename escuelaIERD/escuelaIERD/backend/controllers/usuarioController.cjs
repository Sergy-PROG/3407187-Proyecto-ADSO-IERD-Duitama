const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Nunca se devuelve la contraseña (ni su hash) al frontend
const SELECT_SAFE = 'id, nombre, email, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco, created_at';

const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${SELECT_SAFE} FROM usuarios ORDER BY nombre`);
    res.json(rows);
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${SELECT_SAFE} FROM usuarios WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Nombre, email, contraseña y rol son obligatorios' });
    }

   const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND rol = ?', [email, rol]);

   if (existing.length > 0) {
     return res.status(400).json({ error: 'Ya existe una cuenta de este tipo con ese correo' });
   }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, rol, apodo || null, telefono || null, cumpleanos || null, foto || null, hijo || null, parentesco || null]
    );

    const [newUsuario] = await pool.query(`SELECT ${SELECT_SAFE} FROM usuarios WHERE id = ?`, [result.insertId]);
    res.status(201).json(newUsuario[0]);
  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, apodo, telefono, cumpleanos, foto, hijo, parentesco } = req.body;

    if (password) {
      // Solo se re-hashea si el admin escribió una contraseña nueva
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await pool.query(
        `UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?, apodo = ?, telefono = ?, cumpleanos = ?, foto = ?, hijo = ?, parentesco = ? WHERE id = ?`,
        [nombre, email, hashedPassword, rol, apodo || null, telefono || null, cumpleanos || null, foto || null, hijo || null, parentesco || null, req.params.id]
      );
    } else {
      await pool.query(
        `UPDATE usuarios SET nombre = ?, email = ?, rol = ?, apodo = ?, telefono = ?, cumpleanos = ?, foto = ?, hijo = ?, parentesco = ? WHERE id = ?`,
        [nombre, email, rol, apodo || null, telefono || null, cumpleanos || null, foto || null, hijo || null, parentesco || null, req.params.id]
      );
    }

    const [updated] = await pool.query(`SELECT ${SELECT_SAFE} FROM usuarios WHERE id = ?`, [req.params.id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };
