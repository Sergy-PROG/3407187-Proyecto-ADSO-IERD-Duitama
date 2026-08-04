const express = require('express');
const router = express.Router();
const { getNotas, getNotasByGrupo, createNota, updateNota, deleteNota } = require('../controllers/notaController.cjs');
const { authMiddleware, profesorOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, getNotas);
router.get('/grupo', authMiddleware, getNotasByGrupo);
router.post('/', authMiddleware, profesorOnly, createNota);
router.put('/:id', authMiddleware, profesorOnly, updateNota);
router.delete('/:id', authMiddleware, profesorOnly, deleteNota);

module.exports = router;