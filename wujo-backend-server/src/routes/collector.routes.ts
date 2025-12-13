import { Router } from 'express';
import * as collectorController from '../controllers/collector.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import {
  validateCreateIqub,
  validateAddMember,
  validateSetLotteryDate,
  validateVerifyRound,
  validateObjectId,
} from '../middleware/validate.middleware';

const router = Router();

/**
 * GET /api/dashboard - Get collector dashboard data
 */
router.get(
  '/dashboard',
  authenticateToken,
  requireRole('collector'),
  require('../controllers/dashboard.controller').getCollectorDashboard
);

/**
 * POST /api/createIqub - Create a new Iqub
 */
router.post(
  '/createIqub',
  authenticateToken,
  requireRole('collector'),
  validateCreateIqub,
  collectorController.createIqub
);

/**
 * GET /api/myIqubs - Get all Iqubs created by collector
 */
router.get(
  '/myIqubs',
  authenticateToken,
  requireRole('collector'),
  collectorController.getMyIqubs
);

/**
 * GET /api/iqubs/:iqubId - Get Iqub details
 */
router.get(
  '/iqubs/:iqubId',
  authenticateToken,
  validateObjectId('iqubId'),
  collectorController.getIqubDetails
);

/**
 * POST /api/iqubs/:iqubId/members - Add member to Iqub
 */
router.post(
  '/iqubs/:iqubId/members',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('iqubId'),
  validateAddMember,
  collectorController.addMember
);

/**
 * GET /api/members/:memberId/iqub/:iqubId - Get member payment details
 */
router.get(
  '/members/:memberId/iqub/:iqubId',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('memberId'),
  validateObjectId('iqubId'),
  collectorController.getMemberPaymentDetails
);

/**
 * POST /api/iqubs/:iqubId/lottery/initiate - Initiate lottery
 */
router.post(
  '/iqubs/:iqubId/lottery/initiate',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('iqubId'),
  collectorController.initiateLottery
);

/**
 * PUT /api/iqubs/:iqubId/next-lottery-date - Set next lottery date
 */
router.put(
  '/iqubs/:iqubId/next-lottery-date',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('iqubId'),
  validateSetLotteryDate,
  collectorController.setNextLotteryDate
);

/**
 * GET /api/iqubs/:iqubId/rounds - Get all payment rounds
 */
router.get(
  '/iqubs/:iqubId/rounds',
  authenticateToken,
  validateObjectId('iqubId'),
  collectorController.getRounds
);

/**
 * GET /api/iqubs/:iqubId/rounds/:roundNumber - Get round details
 */
router.get(
  '/iqubs/:iqubId/rounds/:roundNumber',
  authenticateToken,
  validateObjectId('iqubId'),
  collectorController.getRoundDetails
);

/**
 * PUT /api/iqubs/:iqubId/rounds/:roundId/verify - Verify/reject payment round
 */
router.put(
  '/iqubs/:iqubId/rounds/:roundId/verify',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('iqubId'),
  validateObjectId('roundId'),
  validateVerifyRound,
  collectorController.verifyRound
);

export default router;
