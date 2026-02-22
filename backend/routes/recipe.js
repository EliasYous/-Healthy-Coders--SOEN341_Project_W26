const express = require('express');
const authenticateUser = require('../middleware/auth');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

// Create a new recipe
router.post('/', authenticateUser, recipeController.createRecipe);

// Get all recipes (search)
router.get('/', authenticateUser, recipeController.getAllRecipes);


module.exports = router;