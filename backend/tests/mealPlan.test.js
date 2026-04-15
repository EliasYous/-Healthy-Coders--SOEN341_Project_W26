const mealPlanController = require('../controllers/mealPlanController');
const MealPlan = require('../models/mealPlan');

jest.mock('../models/mealPlan');

describe('MealPlan Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      user: { userId: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('createMealPlan', () => {
    it('should create a meal plan and return 201', async () => {
      req.body = { recipeId: 10, dayOfWeek: 'Monday', mealType: 'Lunch', weekStartDate: '2026-04-13' };
      const mockResult = { id: 1, ...req.body, userId: 1 };
      MealPlan.create.mockResolvedValue(mockResult);

      await mealPlanController.createMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 when model throws error', async () => {
      MealPlan.create.mockRejectedValue(new Error('Internal Error'));

      await mealPlanController.createMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create meal plan' });
    });
  });

  describe('getMealPlans', () => {
    it('should fetch meal plans and return them', async () => {
      req.query = { weekStartDate: '2026-04-13' };
      const mockMealPlans = [{ id: 1, recipeId: 10, userId: 1 }];
      MealPlan.findAll.mockResolvedValue(mockMealPlans);

      await mealPlanController.getMealPlans(req, res);

      expect(res.json).toHaveBeenCalledWith(mockMealPlans);
      expect(MealPlan.findAll).toHaveBeenCalledWith({
        userId: 1,
        weekStartDate: '2026-04-13'
      });
    });

    it('should return 500 when model throws error', async () => {
      MealPlan.findAll.mockRejectedValue(new Error('Internal Error'));

      await mealPlanController.getMealPlans(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch meal plans' });
    });
  });

  describe('deleteMealPlan', () => {
    it('should delete a meal plan and return success message', async () => {
      req.params.id = '1';
      MealPlan.delete.mockResolvedValue(true);

      await mealPlanController.deleteMealPlan(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Meal plan deleted successfully' });
    });

    it('should return 404 if meal plan not found or unauthorized', async () => {
      req.params.id = '1';
      MealPlan.delete.mockResolvedValue(false);

      await mealPlanController.deleteMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Meal plan not found or unauthorized' });
    });

    it('should return 500 when model throws error', async () => {
      req.params.id = '1';
      MealPlan.delete.mockRejectedValue(new Error('Internal Error'));

      await mealPlanController.deleteMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete meal plan' });
    });
  });
});
