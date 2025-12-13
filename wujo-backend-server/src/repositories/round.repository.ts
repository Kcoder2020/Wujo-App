import { Round, IRound } from '../models/Round.model';
import mongoose from 'mongoose';

/**
 * Create a new round
 */
export const createRound = async (roundData: Partial<IRound>): Promise<IRound> => {
  const round = new Round(roundData);
  return await round.save();
};

/**
 * Find rounds by Iqub ID with sorting
 */
export const findRoundsByIqubId = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<IRound[]> => {
  return await Round.find({ iqub_id: iqubId })
    .sort({ round_number: 1 })
    .exec();
};

/**
 * Find round by Iqub ID and round number
 */
export const findRoundByIqubAndNumber = async (
  iqubId: string | mongoose.Types.ObjectId,
  roundNumber: number
): Promise<IRound | null> => {
  return await Round.findOne({ iqub_id: iqubId, round_number: roundNumber }).exec();
};

/**
 * Update round status
 */
export const updateRoundStatus = async (
  roundId: string | mongoose.Types.ObjectId,
  status: 'pending' | 'verified' | 'rejected',
  verificationDate?: Date
): Promise<IRound | null> => {
  const updateData: any = { status };
  if (verificationDate) {
    updateData.verification_date = verificationDate;
  }
  return await Round.findByIdAndUpdate(roundId, updateData, { new: true }).exec();
};

/**
 * Get current round number for an Iqub
 */
export const getCurrentRoundNumber = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<number> => {
  const latestRound = await Round.findOne({ iqub_id: iqubId })
    .sort({ round_number: -1 })
    .exec();
  return latestRound ? latestRound.round_number : 0;
};

/**
 * Count completed rounds for an Iqub
 */
export const countCompletedRounds = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<number> => {
  return await Round.countDocuments({
    iqub_id: iqubId,
    status: 'verified',
  }).exec();
};
