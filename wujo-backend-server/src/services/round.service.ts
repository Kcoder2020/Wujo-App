import * as roundRepository from '../repositories/round.repository';
import * as iqubRepository from '../repositories/iqub.repository';
import { IRound } from '../models/Round.model';

/**
 * Get rounds by Iqub
 */
export const getRoundsByIqub = async (iqubId: string): Promise<IRound[]> => {
  const rounds = await roundRepository.findRoundsByIqubId(iqubId);
  return rounds;
};

/**
 * Get round details
 */
export const getRoundDetails = async (
  iqubId: string,
  roundNumber: number
): Promise<IRound> => {
  const round = await roundRepository.findRoundByIqubAndNumber(iqubId, roundNumber);
  
  if (!round) {
    throw new Error('Round not found');
  }

  return round;
};

/**
 * Verify or reject a payment round
 */
export const verifyRound = async (
  iqubId: string,
  roundId: string,
  collectorId: string,
  status: 'verified' | 'rejected'
): Promise<{ message: string }> => {
  // Verify Iqub exists and belongs to collector
  const iqub = await iqubRepository.findIqubById(iqubId);
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Only the collector can verify rounds');
  }

  // Update round status
  const verificationDate = new Date();
  const updatedRound = await roundRepository.updateRoundStatus(
    roundId,
    status,
    verificationDate
  );

  if (!updatedRound) {
    throw new Error('Round not found');
  }

  // If all rounds are verified, update Iqub status to 'completed'
  if (status === 'verified') {
    const completedRounds = await roundRepository.countCompletedRounds(iqubId);
    if (completedRounds >= iqub.members_count) {
      await iqubRepository.updateIqubStatus(iqubId, 'completed');
    }
  }

  return { message: 'Payment round verified successfully' };
};
