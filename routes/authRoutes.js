const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * Authentication Routes
 * 
 * Routes for user registration, login, and getting user details.
 */
const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', protect, getMe);

module.exports = router; 