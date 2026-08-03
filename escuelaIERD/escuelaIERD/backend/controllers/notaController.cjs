const pool = require('../config/database.cjs');

const getNotas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT n.*, e.nombre as estudiante_nombre 
      FROM notas n 
      JOIN estudiantes e ON n.estudiante_id = e.id 
      ORDER BY n.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getNotas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getNotasByGrupo = async (req, res) => {
  try {
    const { grupo } = req.query;
    const [rows] = await pool.query(`
      SELECT n.*, e.nombre as estudiante_nombre 
      FROM notas n 
      JOIN estudiantes e ON n.estudiante_id = e.id 
      WHERE e.grupo = ? 
      ORDER BY n.fecha DESC
    `, [grupo]);
    res.json(rows);
  } catch (error) {
    console.error('Error en getNotasByGrupo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createNota = async (req, res) => {
  try {
    const { estudiante_id, fecha, tecnica, tactica, actitud, grupo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO notas (estudiante_id, fecha, tecnica, tactica, actitud, grupo) VALUES (?, ?, ?, ?, ?, ?)',
      [estudiante_id, fecha, tecnica, tactica, actitud, grupo]
    );
    const [newNota] = await pool.query('SELECT * FROM notas WHERE id = ?', [result.insertId]);
    res.status(201).json(newNota[0]);
  } catch (error) {
    console.error('Error en createNota:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateNota = async (req, res) => {
  try {
    const { tecnica, tactica, actitud } = req.body;
    await pool.query(
      'UPDATE notas SET tecnica = ?, tactica = ?, actitud = ? WHERE id = ?',
      [tecnica, tactica, actitud, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM notas WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updateNota:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteNota = async (req, res) => {
  try {
    await pool.query('DELETE FROM notas WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteNota:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getNotas, getNotasByGrupo, createNota, updateNota, deleteNota };