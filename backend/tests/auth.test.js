const authController = require('../controllers/authController');
const User = require('../models/user');
const Profile = require('../models/profile');
const { validationResult } = require('express-validator');

jest.mock('../models/user');
jest.mock('../models/profile');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('register', () => {
    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it('should return 400 if user already exists', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      User.existsByEmail.mockResolvedValue(true);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User with this email already exists' });
    });

    it('should register successfully and create a profile', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      
      User.existsByEmail.mockResolvedValue(false);
      User.hashPassword.mockResolvedValue('hashedPassword');
      
      const mockUser = { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe' };
      User.create.mockResolvedValue(mockUser);
      User.toCamelCase.mockReturnValue({ id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' });

      await authController.register(req, res);

      expect(User.hashPassword).toHaveBeenCalledWith('password');
      expect(User.create).toHaveBeenCalledWith('test@example.com', 'hashedPassword', 'John', 'Doe');
      expect(Profile.create).toHaveBeenCalledWith(1, [], []);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
      });
    });

    it('should return 500 on server error', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      User.existsByEmail.mockRejectedValue(new Error('DB Error'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('login', () => {
    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it('should return 401 if user not found', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'test@example.com', password: 'password' };
      User.findByEmail.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should return 401 if password is wrong', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashedPassword' };
      User.findByEmail.mockResolvedValue(mockUser);
      User.verifyPassword.mockResolvedValue(false);

      await authController.login(req, res);

      expect(User.verifyPassword).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should return 200 on successful login', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'test@example.com', password: 'password' };
      const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashedPassword' };
      User.findByEmail.mockResolvedValue(mockUser);
      User.verifyPassword.mockResolvedValue(true);
      User.toCamelCase.mockReturnValue({ id: 1, email: 'test@example.com' });

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: 1, email: 'test@example.com' }
      });
    });

    it('should return 500 on server error', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findByEmail.mockRejectedValue(new Error('DB Error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
