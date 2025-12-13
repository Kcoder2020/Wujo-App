import { Response, NextFunction } from 'express';
import * as verificationService from '../services/verification.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Approve payment verification controller
 */
export const approvePaymentVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { requestId } = req.params;
    const { notes } = req.body;

    const result = await verificationService.approvePaymentVerification(
      requestId,
      req.user.userId,
      notes
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Verification request not found' ||
        error.message === 'Iqub not found'
      ) {
        sendError(res, 404, error.message);
      } else if (error.message === 'Access denied') {
        sendError(res, 403, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};

/**
 * Reject payment verification controller
 */
export const rejectPaymentVerification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { requestId } = req.params;
    const { reason, notes } = req.body;

    const result = await verificationService.rejectPaymentVerification(
      requestId,
      req.user.userId,
      reason,
      notes
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Rejection reason is required') {
        sendError(res, 400, error.message);
      } else if (
        error.message === 'Verification request not found' ||
        error.message === 'Iqub not found'
      ) {
        sendError(res, 404, error.message);
      } else if (error.message === 'Access denied') {
        sendError(res, 403, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};
