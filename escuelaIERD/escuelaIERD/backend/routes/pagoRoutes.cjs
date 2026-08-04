const express = require('express');
const router = express.Router();
const { getPagos, createPago, updatePago, deletePago } = require('../controllers/pagoController.cjs');
const { authMiddleware, adminOnly } = require('../middleware/auth.cjs');

router.get('/', authMiddleware, getPagos);
router.post('/', authMiddleware, adminOnly, createPago);
router.put('/:id', authMiddleware, adminOnly, updatePago);
router.delete('/:id', authMiddleware, adminOnly, deletePago);

module.exports = router;