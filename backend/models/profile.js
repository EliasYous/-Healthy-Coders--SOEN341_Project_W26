const pool = require('../config/db');

const Profile = {

    // Get user profile with user info
  findByUserId: async (userId) => {
    const result = await pool.query(
      `SELECT up.diet_preferences, up.allergies, up.pantry, u.first_name, u.last_name, u.email
       FROM user_profiles up
       JOIN users u ON up.user_id = u.id
       WHERE up.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  // Check if profile exists
  exists: async (userId) => {
    const result = await pool.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    return result.rows.length > 0;
  },
  
  // Create new profile
  create: async (userId, dietPreferences = [], allergies = [], pantry = []) => {
    const result = await pool.query(
      'INSERT INTO user_profiles (user_id, diet_preferences, allergies, pantry) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, dietPreferences, allergies, pantry]
    );
    return result.rows[0];
  },

    // Update profile
  update: async (userId, updates) => {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (updates.dietPreferences !== undefined) {
      updateFields.push(`diet_preferences = $${paramCount++}`);
      values.push(updates.dietPreferences);
    }
    if (updates.allergies !== undefined) {
      updateFields.push(`allergies = $${paramCount++}`);
      values.push(updates.allergies);
    }
    if (updates.pantry !== undefined) {
      updateFields.push(`pantry = $${paramCount++}`);
      values.push(updates.pantry);
    }
    if (updateFields.length === 0) {
      return null;
    }

    values.push(userId);
    const result = await pool.query(
      `UPDATE user_profiles SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  // Get or create profile (returns profile with user info)
  getOrCreate: async (userId) => {
    let profile = await Profile.findByUserId(userId);

    if (!profile) {
      await Profile.create(userId, [], []);
      // Fetch again with user info
      profile = await Profile.findByUserId(userId);
    }

    return profile;
  },

  // Transform database row to camelCase format
  toCamelCase: (profile) => {
    if (!profile) return null;
    return {
      dietPreferences: profile.diet_preferences || [],
      allergies: profile.allergies || [],
      pantry: profile.pantry || [],
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
    };
  },
};

module.exports = Profile;
