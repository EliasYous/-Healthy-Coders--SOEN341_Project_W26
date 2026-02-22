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
};

module.exports = recipeController;
