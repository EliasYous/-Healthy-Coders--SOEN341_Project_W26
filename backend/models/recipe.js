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
  }
};

module.exports = Recipe;