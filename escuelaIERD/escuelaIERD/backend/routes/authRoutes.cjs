const express = require('express');
const router = express.Router();
const { login, register, getProfile, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;