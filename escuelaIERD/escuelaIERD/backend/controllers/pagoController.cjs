const pool = require('../config/database.cjs');

const getPagos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, e.nombre as estudiante_nombre 
      FROM pagos p 
      JOIN estudiantes e ON p.estudiante_id = e.id 
      ORDER BY p.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getPagos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createPago = async (req, res) => {
  try {
    const { estudiante_id, concepto, monto, estado, fecha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pagos (estudiante_id, concepto, monto, estado, fecha) VALUES (?, ?, ?, ?, ?)',
      [estudiante_id, concepto, monto, estado || 'Pendiente', fecha]
    );
    const [newPago] = await pool.query('SELECT * FROM pagos WHERE id = ?', [result.insertId]);
    res.status(201).json(newPago[0]);
  } catch (error) {
    console.error('Error en createPago:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updatePago = async (req, res) => {
  try {
    const { concepto, monto, estado, fecha } = req.body;
    await pool.query(
      'UPDATE pagos SET concepto = ?, monto = ?, estado = ?, fecha = ? WHERE id = ?',
      [concepto, monto, estado, fecha, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM pagos WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error en updatePago:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deletePago = async (req, res) => {
  try {
    await pool.query('DELETE FROM pagos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deletePago:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getPagos, createPago, updatePago, deletePago };