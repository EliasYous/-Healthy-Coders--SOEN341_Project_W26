const express = require('express');
const authenticateUser = require('../middleware/auth');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

// Get all recipes (with optional filters)
router.get('/', authenticateUser, recipeController.getAllRecipes);

// Create a new recipe
router.post('/', authenticateUser, recipeController.createRecipe);

// Update a recipe
router.put('/:id', authenticateUser, recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', authenticateUser, recipeController.deleteRecipe);

module.exports = router;