// postgres database initialization
const pool = require('./db');

const initializeDatabase = async () => {
 const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    diet_preferences TEXT[],
    allergies TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT[] NOT NULL,
    prep_time INTEGER NOT NULL,
    prep_steps TEXT[] NOT NULL,
    cost DECIMAL(10, 2),
    difficulty VARCHAR(50),
    dietary_tags TEXT[],
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

  try {
    await pool.query(sql);
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err.message);
    throw err;
  }
};

module.exports = initializeDatabase;