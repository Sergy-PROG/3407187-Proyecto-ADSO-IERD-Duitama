const jwt = require('jsonwebtoken');
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

module.exports = { authMiddleware, adminOnly, profesorOnly };