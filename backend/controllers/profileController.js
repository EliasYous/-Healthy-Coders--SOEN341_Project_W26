const { validationResult } = require('express-validator');
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

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dietPreferences, allergies, pantry } = req.body;

    // Update profile
    await Profile.update(req.user.userId, { dietPreferences, allergies, pantry });

    // Fetch updated profile
    const profile = await Profile.findByUserId(req.user.userId);

    res.json({
      message: 'Profile updated successfully',
      ...Profile.toCamelCase(profile),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};