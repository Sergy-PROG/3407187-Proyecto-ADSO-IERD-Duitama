const express = require('express');
const router = express.Router();
const { getProfesores, createProfesor, updateProfesor, deleteProfesor } = require('../controllers/profesorController.cjs');
const { authMiddleware, adminOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, getProfesores);
router.post('/', authMiddleware, adminOnly, createProfesor);
router.put('/:id', authMiddleware, adminOnly, updateProfesor);
router.delete('/:id', authMiddleware, adminOnly, deleteProfesor);

module.exports = router;