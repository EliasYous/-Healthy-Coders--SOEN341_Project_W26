const express = require('express');
const authenticateUser = require('../middleware/auth');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

// Create a new recipe
router.post('/', authenticateUser, recipeController.createRecipe);

// Get all recipes (search)
router.get('/', authenticateUser, recipeController.getAllRecipes);

// Update a recipe
router.put('/:id', authenticateUser, recipeController.updateRecipe);

module.exports = router;