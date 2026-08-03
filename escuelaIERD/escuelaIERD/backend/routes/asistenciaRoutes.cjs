const express = require('express');
const router = express.Router();
const { 
  getAsistencias, getAsistenciasByGrupo, 
  createAsistencia, updateAsistencia, deleteAsistencia 
} = require('../controllers/asistenciaController.cjs');
const { authMiddleware, profesorOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, getAsistencias);
router.get('/grupo', authMiddleware, getAsistenciasByGrupo);
router.post('/', authMiddleware, profesorOnly, createAsistencia);
router.put('/:id', authMiddleware, profesorOnly, updateAsistencia);
router.delete('/:id', authMiddleware, profesorOnly, deleteAsistencia);

module.exports = router;