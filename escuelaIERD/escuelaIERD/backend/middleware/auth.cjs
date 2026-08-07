const jwt = require('jsonwebtoken');
const pool = require('../config/database.cjs');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.rol;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }
  next();
};

const profesorOnly = (req, res, next) => {
  if (req.userRole !== 'profesor' && req.userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }
  next();
};

// Permite acceso si es admin/profesor, O si el estudiante_id del recurso
// corresponde al usuario autenticado (dueño del recurso)
const ownerOrStaff = async (req, res, next) => {
  if (req.userRole === 'admin' || req.userRole === 'profesor') {
    return next();
  }

  try {
    const estudianteId = req.params.estudianteId || req.params.id;

    const [rows] = await pool.query(
      'SELECT id FROM estudiantes WHERE id = ? AND usuario_id = ?',
      [estudianteId, req.userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    next();
  } catch (error) {
    console.error('Error en ownerOrStaff:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

module.exports = { authMiddleware, adminOnly, profesorOnly, ownerOrStaff };