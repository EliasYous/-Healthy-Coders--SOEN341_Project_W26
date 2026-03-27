const profileController = require('../controllers/profileController');
const Profile = require('../models/profile');
const { validationResult } = require('express-validator');

jest.mock('../models/profile');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Profile Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { userId: 1 }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockProfile = { id: 1, user_id: 1, diet_preferences: [], allergies: [] };
      Profile.getOrCreate.mockResolvedValue(mockProfile);
      Profile.toCamelCase.mockReturnValue({ id: 1, userId: 1, dietPreferences: [], allergies: [] });

      await profileController.getProfile(req, res);

      expect(Profile.getOrCreate).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, dietPreferences: [], allergies: [] });
    });

    it('should return 500 on server error', async () => {
      Profile.getOrCreate.mockRejectedValue(new Error('DB Error'));

      await profileController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateProfile', () => {
    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await profileController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it('should update profile and return updated data', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { dietPreferences: ['Vegan'], allergies: ['Nut'] };
      
      const updatedProfile = { id: 1, user_id: 1, diet_preferences: ['Vegan'], allergies: ['Nut'] };
      Profile.update.mockResolvedValue(true);
      Profile.findByUserId.mockResolvedValue(updatedProfile);
      Profile.toCamelCase.mockReturnValue({ id: 1, userId: 1, dietPreferences: ['Vegan'], allergies: ['Nut'] });

      await profileController.updateProfile(req, res);

      expect(Profile.update).toHaveBeenCalledWith(1, { dietPreferences: ['Vegan'], allergies: ['Nut'] });
      expect(Profile.findByUserId).toHaveBeenCalledWith(1);
      
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        id: 1, userId: 1, dietPreferences: ['Vegan'], allergies: ['Nut']
      });
    });

    it('should return 500 on server error', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      Profile.update.mockRejectedValue(new Error('DB Error'));

      await profileController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
