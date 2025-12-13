import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Signup controller
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, gender, role, password, email } = req.body;

    const result = await authService.signup({
      name,
      phone,
      gender,
      role,
      password,
      email,
    });

    res.status(201).json({
      message: 'Signup successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Phone number already registered') {
        sendError(res, 400, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};

/**
 * Login controller
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, password } = req.body;

    const result = await authService.login(phone, password);

    res.status(200).json({
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        sendError(res, 401, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};

/**
 * Logout controller
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  // Token invalidation is handled client-side
  sendSuccess(res, 200, 'Successfully logged out');
};

/**
 * Get user profile controller
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const user = await authService.getUserById(req.user.userId);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        sendError(res, 404, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};
