const express = require('express');
const { body } = require('express-validator');
const authenticateUser = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Get user profile
router.get('/', authenticateUser, profileController.getProfile);

// Update user profile
router.put('/', authenticateUser, [
  body('dietPreferences').optional().isArray(),
  body('allergies').optional().isArray(),
], profileController.updateProfile);

module.exports = router;