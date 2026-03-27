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
  },

  getMealPlans: async (req, res) => {
    try {
      const { weekStartDate } = req.query;
      const mealPlans = await MealPlan.findAll({
        userId: req.user.userId,
        weekStartDate: req.query.weekStartDate
      });
      res.json(mealPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
  },

  deleteMealPlan: async (req, res) => {
    try {
      const success = await MealPlan.delete(req.params.id, req.user.userId);
      if (!success) {
        return res.status(404).json({ error: 'Meal plan not found or unauthorized' });
      }
      res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      res.status(500).json({ error: 'Failed to delete meal plan' });
    }
  }
};

module.exports = mealPlanController;
