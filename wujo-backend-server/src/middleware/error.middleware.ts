import { Request, Response, NextFunction } from 'express';
import { sendError, generateRequestId } from '../utils/response.util';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req.headers['x-request-id'] as string) || generateRequestId();

  // Log error
  console.error('[Error]', {
    requestId,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle AppError (custom application errors)
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors, requestId);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors: Record<string, string[]> = {};
    const mongooseErr = err as any;
    
    Object.keys(mongooseErr.errors || {}).forEach((key) => {
      errors[key] = [mongooseErr.errors[key].message];
    });

    sendError(res, 422, 'Validation failed', errors, requestId);
    return;
  }

  // Handle Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0] || 'field';
    sendError(
      res,
      400,
      `Duplicate value for ${field}`,
      { [field]: [`${field} already exists`] },
      requestId
    );
    return;
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 400, 'Invalid ID format', undefined, requestId);
    return;
  }

  // Handle JWT errors (should be caught by auth middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid token', undefined, requestId);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Token expired', undefined, requestId);
    return;
  }

  // Default to 500 server error
  sendError(res, 500, 'Internal server error', undefined, requestId);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, 'Route not found');
};
