const Recipe = require('../models/recipe');

const recipeController = {
  createRecipe: async (req, res) => {
    try {
      const recipeData = {
        ...req.body,
        userId: req.user.userId
      };
      const recipe = await Recipe.create(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  },

  getAllRecipes: async (req, res) => {
    try {
      const { search, difficulty, maxTime, maxCost, dietaryTags } = req.query;
      const filters = {
        userId: req.user.userId,
        search,
        difficulty,
        maxTime: maxTime ? parseInt(maxTime) : null,
        maxCost: maxCost ? parseFloat(maxCost) : null,
        dietaryTags: dietaryTags ? dietaryTags.split(',') : null
      };
      const recipes = await Recipe.findAll(filters);
      res.json(recipes);
    } catch (error) {
      console.error('Error getting recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  },
};

module.exports = recipeController;
