import { Router } from 'express';
import * as memberController from '../controllers/member.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateFetchLottery } from '../middleware/validate.middleware';

const router = Router();

/**
 * GET /api/joinedIqubs - Get all Iqubs joined by member
 */
router.get(
  '/joinedIqubs',
  authenticateToken,
  memberController.getJoinedIqubs
);

/**
 * GET /api/fetchlottery - Get lottery winner for Iqub
 */
router.get(
  '/fetchlottery',
  authenticateToken,
  validateFetchLottery,
  memberController.getLotteryWinner
);

export default router;
