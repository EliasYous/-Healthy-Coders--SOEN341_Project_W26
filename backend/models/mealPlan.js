const pool = require('../config/database');

class MealPlan {
  static async create({ userId, recipeId, dayOfWeek, mealType, weekStartDate }) {
    const query = `
      INSERT INTO meal_plans (user_id, recipe_id, day_of_week, meal_type, week_start_date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, day_of_week, meal_type, week_start_date) 
      DO UPDATE SET recipe_id = EXCLUDED.recipe_id, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [userId, recipeId, dayOfWeek, mealType, weekStartDate];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = MealPlan;