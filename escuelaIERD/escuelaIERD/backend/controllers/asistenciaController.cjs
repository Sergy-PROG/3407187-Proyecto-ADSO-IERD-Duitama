const pool = require('../config/database.cjs');

const getAsistencias = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, e.nombre as estudiante_nombre 
      FROM asistencias a 
      JOIN estudiantes e ON a.estudiante_id = e.id 
      ORDER BY a.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAsistencias:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getAsistenciasByGrupo = async (req, res) => {
  try {
    const { grupo, fecha } = req.query;
    let query = 'SELECT a.*, e.nombre as estudiante_nombre FROM asistencias a JOIN estudiantes e ON a.estudiante_id = e.id WHERE e.grupo = ?';
    const params = [grupo];
    
    if (fecha) {
      query += ' AND a.fecha = ?';
      params.push(fecha);
    }
    
    query += ' ORDER BY a.fecha DESC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAsistenciasByGrupo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createAsistencia = async (req, res) => {
  try {
    const { estudiante_id, fecha, estado, grupo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO asistencias (estudiante_id, fecha, estado, grupo) VALUES (?, ?, ?, ?)',
      [estudiante_id, fecha, estado, grupo]
    );
    const [newAsistencia] = await pool.query('SELECT * FROM asistencias WHERE id = ?', [result.insertId]);
    res.status(201).json(newAsistencia[0]);
  } catch (error) {
    console.error('Error en createAsistencia:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateAsistencia = async (req, res) => {
  try {
    const { estado } = req.body;
    await pool.query('UPDATE asistencias SET estado = ? WHERE id = ?', [estado, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM asistencias WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updateAsistencia:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteAsistencia = async (req, res) => {
  try {
    await pool.query('DELETE FROM asistencias WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteAsistencia:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getAsistencias, getAsistenciasByGrupo, createAsistencia, updateAsistencia, deleteAsistencia };