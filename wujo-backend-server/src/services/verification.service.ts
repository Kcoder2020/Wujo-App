import * as iqubRepository from '../repositories/iqub.repository';
import mongoose from 'mongoose';

/**
 * Approve payment verification
 */
export const approvePaymentVerification = async (
  requestId: string,
  collectorId: string,
  notes?: string
): Promise<any> => {
  const PaymentVerification = require('../models/PaymentVerification.model').PaymentVerification;
  const Round = require('../models/Round.model').Round;
  const Member = require('../models/Member.model').Member;

  // Get verification request
  const verification = await PaymentVerification.findById(requestId);
  if (!verification) {
    throw new Error('Verification request not found');
  }

  // Verify collector owns the Iqub
  const iqub = await iqubRepository.findIqubById(verification.iqub_id.toString());
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update verification status
    verification.status = 'approved';
    verification.collector_id = new mongoose.Types.ObjectId(collectorId);
    verification.decision_date = new Date();
    verification.collector_notes = notes;
    await verification.save({ session });

    // Update payment round status
    const paymentRound = await Round.findOne({
      iqub_id: verification.iqub_id,
      round_number: verification.round_number,
    }).session(session);

    if (paymentRound) {
      paymentRound.status = 'verified';
      paymentRound.verification_status = 'verified';
      paymentRound.verification_date = new Date();
      paymentRound.collector_notes = notes;
      await paymentRound.save({ session });
    }

    // Update member's saving rounds
    const member = await Member.findById(verification.member_id).session(session);
    if (member) {
      member.saving_rounds += 1;
      await member.save({ session });
    }

    // Update Iqub total collected
    const currentTotal = iqub.total_collected || 0;
    await iqubRepository.updateIqub(verification.iqub_id.toString(), {
      total_collected: currentTotal + verification.amount,
    });

    // Commit transaction
    await session.commitTransaction();

    return {
      success: true,
      message: 'Payment verification approved successfully',
      data: verification,
    };
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Reject payment verification
 */
export const rejectPaymentVerification = async (
  requestId: string,
  collectorId: string,
  reason: string,
  notes?: string
): Promise<any> => {
  const PaymentVerification = require('../models/PaymentVerification.model').PaymentVerification;
  const Round = require('../models/Round.model').Round;

  if (!reason || reason.trim() === '') {
    throw new Error('Rejection reason is required');
  }

  // Get verification request
  const verification = await PaymentVerification.findById(requestId);
  if (!verification) {
    throw new Error('Verification request not found');
  }

  // Verify collector owns the Iqub
  const iqub = await iqubRepository.findIqubById(verification.iqub_id.toString());
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Update verification status
  verification.status = 'rejected';
  verification.collector_id = new mongoose.Types.ObjectId(collectorId);
  verification.decision_date = new Date();
  verification.rejection_reason = reason;
  verification.collector_notes = notes;
  await verification.save();

  // Update payment round status
  const paymentRound = await Round.findOne({
    iqub_id: verification.iqub_id,
    round_number: verification.round_number,
  });

  if (paymentRound) {
    paymentRound.verification_status = 'rejected';
    paymentRound.collector_notes = `${reason}${notes ? ` - ${notes}` : ''}`;
    await paymentRound.save();
  }

  return {
    success: true,
    message: 'Payment verification rejected',
    data: verification,
  };
};
