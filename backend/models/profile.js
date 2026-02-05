const pool = require('../config/database');

const Profile = {
  // Create new profile
  create: async (userId, dietPreferences = [], allergies = []) => {
    const result = await pool.query(
      'INSERT INTO user_profiles (user_id, diet_preferences, allergies) VALUES ($1, $2, $3) RETURNING *',
      [userId, dietPreferences, allergies]
    );
    return result.rows[0];
  },

  // Transform database row to camelCase format
  toCamelCase: (profile) => {
    if (!profile) return null;
    return {
      dietPreferences: profile.diet_preferences || [],
      allergies: profile.allergies || [],
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
    };
  },
};

module.exports = Profile;
