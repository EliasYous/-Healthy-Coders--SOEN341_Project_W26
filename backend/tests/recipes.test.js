const recipeController = require('../controllers/recipeController');
const Recipe = require('../models/recipe');

jest.mock('../models/recipe');

describe('Recipe Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = { user: { userId: 1 }, body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('createRecipe', () => {
    it('should create a recipe and return 201', async () => {
      req.body = { title: 'Test Recipe', instructions: 'Stir well' };
      const createdRecipe = { id: 10, userId: 1, title: 'Test Recipe', instructions: 'Stir well' };
      
      Recipe.create.mockResolvedValue(createdRecipe);

      await recipeController.createRecipe(req, res);

      expect(Recipe.create).toHaveBeenCalledWith({ title: 'Test Recipe', instructions: 'Stir well', userId: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdRecipe);
    });

    it('should return 500 on server error', async () => {
      Recipe.create.mockRejectedValue(new Error('DB Error'));

      await recipeController.createRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create recipe' });
    });
  });

  describe('getAllRecipes', () => {
    it('should return all recipes filtering by query params', async () => {
      req.query = { search: 'pasta', difficulty: 'easy', maxTime: '30', maxCost: '15.5', dietaryTags: 'vegan,gluten-free' };
      const mockRecipes = [{ id: 1, title: 'Vegan Pasta' }];
      
      Recipe.findAll.mockResolvedValue(mockRecipes);

      await recipeController.getAllRecipes(req, res);

      const expectedFilters = {
        userId: 1,
        search: 'pasta',
        difficulty: 'easy',
        maxTime: 30,
        maxCost: 15.5,
        dietaryTags: ['vegan', 'gluten-free']
      };

      expect(Recipe.findAll).toHaveBeenCalledWith(expectedFilters);
      expect(res.json).toHaveBeenCalledWith(mockRecipes);
    });

    it('should handle missing optional query params correctly', async () => {
      const mockRecipes = [{ id: 1, title: 'Pasta' }];
      Recipe.findAll.mockResolvedValue(mockRecipes);

      await recipeController.getAllRecipes(req, res);

      const expectedFilters = {
        userId: 1,
        search: undefined,
        difficulty: undefined,
        maxTime: null,
        maxCost: null,
        dietaryTags: null
      };

      expect(Recipe.findAll).toHaveBeenCalledWith(expectedFilters);
      expect(res.json).toHaveBeenCalledWith(mockRecipes);
    });

    it('should return 500 on server error', async () => {
      Recipe.findAll.mockRejectedValue(new Error('DB Error'));

      await recipeController.getAllRecipes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch recipes' });
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe and return the updated recipe data', async () => {
      req.params = { id: 10 };
      req.body = { title: 'Updated Title' };
      const updatedRecipe = { id: 10, title: 'Updated Title' };
      
      Recipe.update.mockResolvedValue(updatedRecipe);

      await recipeController.updateRecipe(req, res);

      expect(Recipe.update).toHaveBeenCalledWith(10, 1, { title: 'Updated Title' });
      expect(res.json).toHaveBeenCalledWith(updatedRecipe);
    });

    it('should return 404 if recipe to update is not found or unauthorized', async () => {
      req.params = { id: 10 };
      req.body = { title: 'Updated Title' };
      
      Recipe.update.mockResolvedValue(null);

      await recipeController.updateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found or unauthorized' });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 10 };
      Recipe.update.mockRejectedValue(new Error('DB Error'));

      await recipeController.updateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update recipe' });
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe returning a success message', async () => {
      req.params = { id: 10 };
      Recipe.delete.mockResolvedValue(true);

      await recipeController.deleteRecipe(req, res);

      expect(Recipe.delete).toHaveBeenCalledWith(10, 1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe deleted successfully' });
    });

    it('should return 404 if recipe to delete is not found or unauthorized', async () => {
      req.params = { id: 10 };
      Recipe.delete.mockResolvedValue(false);

      await recipeController.deleteRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found or unauthorized' });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 10 };
      Recipe.delete.mockRejectedValue(new Error('DB Error'));

      await recipeController.deleteRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete recipe' });
    });
  });
});
