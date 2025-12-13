import { Response } from 'express';
import { v4 as uuidv4 } from 'crypto';

/**
 * Success response interface
 */
export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  timestamp: string;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  requestId: string;
  timestamp: string;
}

/**
 * Send a success response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param data - Response data
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message?: string,
  data?: T
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    timestamp: new Date().toISOString(),
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param errors - Field-specific validation errors
 * @param requestId - Unique request identifier
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>,
  requestId?: string
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    requestId: requestId || generateRequestId(),
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

/**
 * Generate a unique request ID
 * @returns UUID string
 */
export const generateRequestId = (): string => {
  // Using crypto.randomUUID() for Node 14.17+
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback to timestamp-based ID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Format validation errors from express-validator
 * @param errors - Array of validation errors
 * @returns Formatted error object
 */
export const formatValidationErrors = (errors: any[]): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    const field = error.path || error.param || 'unknown';
    if (!formatted[field]) {
      formatted[field] = [];
    }
    formatted[field].push(error.msg);
  });

  return formatted;
};
