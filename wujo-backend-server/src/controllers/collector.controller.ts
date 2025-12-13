import { Response, NextFunction } from 'express';
import * as iqubService from '../services/iqub.service';
import * as memberService from '../services/member.service';
import * as lotteryService from '../services/lottery.service';
import * as roundService from '../services/round.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Create Iqub controller
 */
export const createIqub = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const iqub = await iqubService.createIqub(req.user.userId, req.body);

    res.status(201).json({
      message: 'Iqub created successfully',
      iqub,
    });
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 400, error.message);
    } else {
      next(error);
    }
  }
};

/**
 * Get my Iqubs controller
 */
export const getMyIqubs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const iqubs = await iqubService.getIqubsByCollector(req.user.userId);
    res.status(200).json({
      data: iqubs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Iqub details controller
 */
export const getIqubDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { iqubId } = req.params;
    const iqub = await iqubService.getIqubById(iqubId, req.user.userId);
    
    res.status(200).json({
      data: iqub,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Iqub not found') {
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
 * Add member controller
 */
export const addMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { iqubId } = req.params;
    const { phone } = req.body;

    const result = await memberService.addMember(iqubId, req.user.userId, phone);
    sendSuccess(res, 200, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Iqub is full' ||
        error.message === 'Member already exists in this Iqub' ||
        error.message === 'User not found with this phone number'
      ) {
        sendError(res, 400, error.message);
      } else if (error.message === 'Iqub not found') {
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
 * Initiate lottery controller
 */
export const initiateLottery = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { iqubId } = req.params;
    const result = await lotteryService.initiateLottery(iqubId, req.user.userId);
    
    sendSuccess(res, 200, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Lottery cannot be initiated for this Iqub status' ||
        error.message === 'Round already has a lottery winner' ||
        error.message === 'No eligible members for lottery'
      ) {
        sendError(res, 400, error.message);
      } else if (error.message === 'Iqub not found') {
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
 * Set next lottery date controller
 */
export const setNextLotteryDate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { iqubId } = req.params;
    const { date } = req.body;

    const iqub = await iqubService.updateNextLotteryDate(iqubId, req.user.userId, date);

    res.status(200).json({
      message: 'Next lottery date updated successfully',
      iqub,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Date must be in the future') {
        sendError(res, 422, error.message);
      } else if (error.message === 'Iqub not found') {
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
 * Get rounds controller
 */
export const getRounds = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { iqubId } = req.params;
    const rounds = await roundService.getRoundsByIqub(iqubId);
    
    res.status(200).json({
      data: rounds,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get round details controller
 */
export const getRoundDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { iqubId, roundNumber } = req.params;
    const round = await roundService.getRoundDetails(iqubId, parseInt(roundNumber, 10));
    
    res.status(200).json({
      data: round,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Round not found') {
      sendError(res, 404, error.message);
    } else {
      next(error);
    }
  }
};

/**
 * Verify round controller
 */
export const verifyRound = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { iqubId, roundId } = req.params;
    const { status } = req.body;

    const result = await roundService.verifyRound(iqubId, roundId, req.user.userId, status);
    sendSuccess(res, 200, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Only the collector can verify rounds') {
        sendError(res, 403, error.message);
      } else if (error.message === 'Round not found' || error.message === 'Iqub not found') {
        sendError(res, 404, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};

/**
 * Get member payment details controller
 */
export const getMemberPaymentDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { memberId, iqubId } = req.params;
    const paymentDetails = await memberService.getMemberPaymentDetails(
      memberId,
      iqubId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: paymentDetails,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Member not found' || error.message === 'Iqub not found') {
        sendError(res, 404, error.message);
      } else if (
        error.message === 'Access denied' ||
        error.message === 'Member does not belong to this Iqub'
      ) {
        sendError(res, 403, error.message);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};
