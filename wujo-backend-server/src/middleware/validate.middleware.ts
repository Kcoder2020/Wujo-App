import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError, formatValidationErrors } from '../utils/response.util';

/**
 * Validation result handler
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    sendError(res, 422, 'Validation failed', formattedErrors);
    return;
  }
  
  next();
};

/**
 * Signup validation rules
 */
export const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Phone must be in E.164 format (e.g., +251911110000)'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be either male or female'),
  body('role')
    .isIn(['collector', 'member'])
    .withMessage('Role must be either collector or member'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('password_confirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  handleValidationErrors,
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Phone must be in E.164 format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Create Iqub validation rules
 */
export const validateCreateIqub = [
  body('name').trim().notEmpty().withMessage('Iqub name is required'),
  body('saving_pattern').notEmpty().withMessage('Saving pattern is required'),
  body('saving_amount')
    .notEmpty()
    .withMessage('Saving amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Saving amount must be a positive number'),
  body('credit_pattern').notEmpty().withMessage('Credit pattern is required'),
  body('credit_amount')
    .notEmpty()
    .withMessage('Credit amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Credit amount must be a positive number'),
  body('members_count')
    .isInt({ min: 2 })
    .withMessage('Members count must be an integer greater than 1'),
  handleValidationErrors,
];

/**
 * Add member validation rules
 */
export const validateAddMember = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Phone must be in E.164 format'),
  handleValidationErrors,
];

/**
 * Set next lottery date validation rules
 */
export const validateSetLotteryDate = [
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format'),
  handleValidationErrors,
];

/**
 * Verify round validation rules
 */
export const validateVerifyRound = [
  body('status')
    .isIn(['verified', 'rejected'])
    .withMessage('Status must be either verified or rejected'),
  handleValidationErrors,
];

/**
 * Fetch lottery validation rules
 */
export const validateFetchLottery = [
  query('iqub_id').notEmpty().withMessage('iqub_id query parameter is required'),
  handleValidationErrors,
];

/**
 * MongoDB ObjectId validation
 */
export const validateObjectId = (paramName: string) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  handleValidationErrors,
];
