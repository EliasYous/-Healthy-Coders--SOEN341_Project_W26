const MealPlan = require('../models/mealPlan');

const mealPlanController = {
  createMealPlan: async (req, res) => {
    try {
      const mealPlanData = {
        ...req.body,
        userId: req.user.userId
      };

      const mealPlan = await MealPlan.create(mealPlanData);
      res.status(201).json(mealPlan);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      res.status(500).json({ error: 'Failed to create meal plan' });
    }
  }
};

module.exports = mealPlanController;
