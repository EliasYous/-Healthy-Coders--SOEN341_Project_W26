// api endpoints for profile
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name,
              up.diet_preferences, up.allergies
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profile
router.put('/', async (req, res) => {
  const { first_name, last_name, diet_preferences, allergies } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [first_name, last_name, req.userId]
    );

    await client.query(
      `INSERT INTO user_profiles (user_id, diet_preferences, allergies)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET
         diet_preferences = EXCLUDED.diet_preferences,
         allergies = EXCLUDED.allergies,
         updated_at = CURRENT_TIMESTAMP`,
      [req.userId, diet_preferences, allergies]
    );

    await client.query('COMMIT');
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;