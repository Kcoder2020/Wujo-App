import { Response, NextFunction } from 'express';
import * as memberService from '../services/member.service';
import * as lotteryService from '../services/lottery.service';
import { sendError } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Get joined Iqubs controller
 */
export const getJoinedIqubs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const iqubs = await memberService.getJoinedIqubs(req.user.userId);
    res.status(200).json({
      data: iqubs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lottery winner controller
 */
export const getLotteryWinner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { iqub_id } = req.query;

    if (!iqub_id || typeof iqub_id !== 'string') {
      sendError(res, 400, 'iqub_id query parameter is required');
      return;
    }

    const result = await lotteryService.getLotteryWinner(iqub_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
