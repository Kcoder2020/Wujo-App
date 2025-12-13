import { Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Get collector dashboard data
 */
export const getCollectorDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const dashboardData = await dashboardService.getCollectorDashboard(req.user.userId);

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, error.message);
    } else {
      next(error);
    }
  }
};
