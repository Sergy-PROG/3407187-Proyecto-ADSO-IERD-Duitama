const pool = require('../config/database.cjs');

const getProfesores = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profesores ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('Error en getProfesores:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createProfesor = async (req, res) => {
  try {
    const { nombre, email, especialidad, foto } = req.body;
    const [result] = await pool.query(
      'INSERT INTO profesores (nombre, email, especialidad, foto) VALUES (?, ?, ?, ?)',
      [nombre, email, especialidad || null, foto || null]
    );
    const [newProfesor] = await pool.query('SELECT * FROM profesores WHERE id = ?', [result.insertId]);
    res.status(201).json(newProfesor[0]);
  } catch (error) {
    console.error('Error en createProfesor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateProfesor = async (req, res) => {
  try {
    const { nombre, email, especialidad, foto } = req.body;
    await pool.query(
      'UPDATE profesores SET nombre = ?, email = ?, especialidad = ?, foto = ? WHERE id = ?',
      [nombre, email, especialidad || null, foto || null, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM profesores WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updateProfesor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteProfesor = async (req, res) => {
  try {
    await pool.query('DELETE FROM profesores WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteProfesor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getProfesores, createProfesor, updateProfesor, deleteProfesor };