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

  static async getByWeek({ userId, weekStartDate }) {
    let query = `
      SELECT mp.*, r.title AS recipe_title, r.ingredients AS recipe_ingredients
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.user_id = $1
    `;
    const values = [userId];

    if (weekStartDate) {
      query += ` AND mp.week_start_date = $2`;
      values.push(weekStartDate);
    }

    query += ` ORDER BY mp.day_of_week, mp.meal_type`;
    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM meal_plans WHERE id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await pool.query(query, [id, userId]);
    return rows.length > 0;
  }
}

module.exports = MealPlan;
