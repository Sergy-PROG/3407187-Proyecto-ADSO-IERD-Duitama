const express = require('express');
const router = express.Router();
const { login, register, getProfile, updateProfile } = require('../controllers/authController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;