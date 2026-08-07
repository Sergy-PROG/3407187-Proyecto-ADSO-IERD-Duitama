const express = require('express');
const router = express.Router();
const { 
  getEstudiantes, getEstudianteById, createEstudiante, 
  updateEstudiante, deleteEstudiante 
} = require('../controllers/estudianteController.cjs');
const { authMiddleware, adminOnly, profesorOnly, ownerOrStaff } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, profesorOnly, getEstudiantes);
router.get('/:id', authMiddleware, ownerOrStaff, getEstudianteById);
router.post('/', authMiddleware, adminOnly, createEstudiante);
router.put('/:id', authMiddleware, adminOnly, updateEstudiante);
router.delete('/:id', authMiddleware, adminOnly, deleteEstudiante);

module.exports = router;