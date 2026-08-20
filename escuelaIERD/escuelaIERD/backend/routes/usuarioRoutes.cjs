const express = require('express');
const router = express.Router();
const {
  getUsuarios, getUsuarioById, createUsuario,
  updateUsuario, deleteUsuario
} = require('../controllers/usuarioController.cjs');
const { authMiddleware, adminOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, adminOnly, getUsuarios);
router.get('/:id', authMiddleware, adminOnly, getUsuarioById);
router.post('/', authMiddleware, adminOnly, createUsuario);
router.put('/:id', authMiddleware, adminOnly, updateUsuario);
router.delete('/:id', authMiddleware, adminOnly, deleteUsuario);

module.exports = router;
