const express = require('express');
const router = express.Router();
const { 
  getEstudiantes, getEstudianteById, createEstudiante, 
  updateEstudiante, deleteEstudiante 
} = require('../controllers/estudianteController.cjs');
const { authMiddleware, adminOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, getEstudiantes);
router.get('/:id', authMiddleware, getEstudianteById);
router.post('/', authMiddleware, adminOnly, createEstudiante);
router.put('/:id', authMiddleware, adminOnly, updateEstudiante);
router.delete('/:id', authMiddleware, adminOnly, deleteEstudiante);

module.exports = router;