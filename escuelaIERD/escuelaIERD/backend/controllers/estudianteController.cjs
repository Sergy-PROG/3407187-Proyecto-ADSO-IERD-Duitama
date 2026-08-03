const pool = require('../config/database.cjs');

const getEstudiantes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estudiantes ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('Error en getEstudiantes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getEstudianteById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getEstudianteById:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createEstudiante = async (req, res) => {
  try {
    const { nombre, documento, grupo, acudiente, estado, foto } = req.body;
    const [result] = await pool.query(
      'INSERT INTO estudiantes (nombre, documento, grupo, acudiente, estado, foto) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, documento, grupo, acudiente || null, estado || 'Activo', foto || null]
    );
    const [newEstudiante] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [result.insertId]);
    res.status(201).json(newEstudiante[0]);
  } catch (error) {
    console.error('Error en createEstudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateEstudiante = async (req, res) => {
  try {
    const { nombre, documento, grupo, acudiente, estado, foto } = req.body;
    await pool.query(
      'UPDATE estudiantes SET nombre = ?, documento = ?, grupo = ?, acudiente = ?, estado = ?, foto = ? WHERE id = ?',
      [nombre, documento, grupo, acudiente || null, estado || 'Activo', foto || null, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updateEstudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteEstudiante = async (req, res) => {
  try {
    await pool.query('DELETE FROM estudiantes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteEstudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getEstudiantes, getEstudianteById, createEstudiante, updateEstudiante, deleteEstudiante };