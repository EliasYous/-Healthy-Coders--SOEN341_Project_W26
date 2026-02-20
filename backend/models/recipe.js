const pool = require('../config/database');

const Recipe = {
  create: async (recipeData) => {
    const { userId, title, ingredients, prepTime, prepSteps, cost, difficulty, dietaryTags, isPublic } = recipeData;
    const result = await pool.query(
      `INSERT INTO recipes (user_id, title, ingredients, prep_time, prep_steps, cost, difficulty, dietary_tags, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, title, ingredients, prepTime, prepSteps, cost, difficulty, dietaryTags, isPublic !== undefined ? isPublic : true]
    );
    return result.rows[0];
  },

   findAll: async (filters = {}) => {
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.userId) {
      query += ` AND (is_public = TRUE OR user_id = $${paramCount})`;
      params.push(filters.userId);
      paramCount++;
    } else {
      // If no userId, only show public recipes
      query += ` AND is_public = TRUE`;
    }

    if (filters.search) {
      query += ` AND (title ILIKE $${paramCount} OR EXISTS (SELECT 1 FROM unnest(ingredients) i WHERE i ILIKE $${paramCount}))`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.difficulty) {
      query += ` AND difficulty = $${paramCount}`;
      params.push(filters.difficulty);
      paramCount++;
    }

    if (filters.maxTime) {
      query += ` AND prep_time <= $${paramCount}`;
      params.push(filters.maxTime);
      paramCount++;
    }

    if (filters.maxCost) {
      query += ` AND cost <= $${paramCount}`;
      params.push(filters.maxCost);
      paramCount++;
    }

    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      query += ` AND dietary_tags && $${paramCount}`;
      params.push(filters.dietaryTags);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }, 

   update: async (id, userId, recipeData) => {
    const { title, ingredients, prepTime, prepSteps, cost, difficulty, dietaryTags, isPublic } = recipeData;
    const result = await pool.query(
      `UPDATE recipes 
       SET title = $1, ingredients = $2, prep_time = $3, prep_steps = $4, cost = $5, difficulty = $6, dietary_tags = $7, is_public = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, ingredients, prepTime, prepSteps, cost, difficulty, dietaryTags, isPublic !== undefined ? isPublic : true, id, userId]
    );
    return result.rows[0];
  }

};

module.exports = Recipe;