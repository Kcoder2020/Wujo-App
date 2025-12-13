import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';

/**
 * Extend Express Request to include user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'collector' | 'member';
  };
}

/**
 * Authentication middleware - verify JWT token
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      sendError(res, 401, 'Authorization required');
      return;
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      sendError(res, 401, 'Invalid authorization format. Use: Bearer <token>');
      return;
    }

    const token = parts[1];

    // Verify token
    const decoded: JWTPayload = verifyToken(token);

    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token expired') {
        sendError(res, 401, 'Token expired');
      } else if (error.message === 'Invalid token') {
        sendError(res, 401, 'Invalid token');
      } else {
        sendError(res, 401, 'Authentication failed');
      }
    } else {
      sendError(res, 401, 'Authentication failed');
    }
  }
};

/**
 * Role authorization middleware - check if user has required role
 */
export const requireRole = (requiredRole: 'collector' | 'member') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    if (req.user.role !== requiredRole) {
      sendError(res, 403, `Access denied. ${requiredRole} role required`);
      return;
    }

    next();
  };
};
