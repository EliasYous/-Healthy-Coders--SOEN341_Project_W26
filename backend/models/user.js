const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
// Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  // Find user by ID
  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Check if user exists by email
  existsByEmail: async (email) => {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  },

  // Create new user
  create: async (email, passwordHash, firstName, lastName) => {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at',
      [email, passwordHash, firstName, lastName]
    );
    return result.rows[0];
  },

  // Hash password
  hashPassword: async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

    // Verify password
  verifyPassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Transform database row to camelCase format
  toCamelCase: (user) => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    };
  },
};

module.exports = User;