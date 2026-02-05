const { validationResult } = require('express-validator');
const User = require('../models/user');
const Profile = require('../models/profile');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.getOrCreate(req.user.userId);
    res.json(
      Profile.toCamelCase(profile)
    );
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
};