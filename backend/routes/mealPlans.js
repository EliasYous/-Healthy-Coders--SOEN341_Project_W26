const express = require('express');
const authenticateUser = require('../middleware/auth');
const mealPlanController = require('../controllers/mealPlanController');

const router = express.Router();

router.post('/', authenticateUser, mealPlanController.createMealPlan);

module.exports = router;
