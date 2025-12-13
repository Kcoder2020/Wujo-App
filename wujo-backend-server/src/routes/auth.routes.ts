import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateSignup, validateLogin } from '../middleware/validate.middleware';

const router = Router();

/**
 * POST /api/signup - Register a new user
 */
router.post('/signup', validateSignup, authController.signup);

/**
 * POST /api/login - Login user
 */
router.post('/login', validateLogin, authController.login);

/**
 * GET /api/logout - Logout user
 */
router.get('/logout', authenticateToken, authController.logout);

/**
 * GET /api/user - Get collector profile
 */
router.get('/user', authenticateToken, authController.getProfile);

/**
 * GET /api/profile - Get member profile
 */
router.get('/profile', authenticateToken, authController.getProfile);

export default router;
