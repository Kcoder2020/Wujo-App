import { Router } from 'express';
import * as verificationController from '../controllers/verification.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { validateObjectId } from '../middleware/validate.middleware';

const router = Router();

/**
 * POST /api/payment-verifications/:requestId/approve - Approve payment verification
 */
router.post(
  '/payment-verifications/:requestId/approve',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('requestId'),
  verificationController.approvePaymentVerification
);

/**
 * POST /api/payment-verifications/:requestId/reject - Reject payment verification
 */
router.post(
  '/payment-verifications/:requestId/reject',
  authenticateToken,
  requireRole('collector'),
  validateObjectId('requestId'),
  verificationController.rejectPaymentVerification
);

export default router;
