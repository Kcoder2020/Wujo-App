import * as lotteryRepository from '../repositories/lottery.repository';
import * as memberRepository from '../repositories/member.repository';
import * as iqubRepository from '../repositories/iqub.repository';
import * as roundRepository from '../repositories/round.repository';
import { IMember } from '../models/Member.model';
import mongoose from 'mongoose';

/**
 * Select random winner from eligible members
 */
const selectRandomWinner = (eligibleMembers: IMember[]): IMember => {
  const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
  return eligibleMembers[randomIndex];
};

/**
 * Initiate lottery for an Iqub
 */
export const initiateLottery = async (
  iqubId: string,
  collectorId: string
): Promise<{ message: string }> => {
  // Verify Iqub exists and belongs to collector
  const iqub = await iqubRepository.findIqubById(iqubId);
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Verify Iqub status is 'active'
  if (iqub.status !== 'active') {
    throw new Error('Lottery cannot be initiated for this Iqub status');
  }

  // Get current round number (or start at 1)
  const currentRoundNumber = await roundRepository.getCurrentRoundNumber(iqubId);
  const nextRoundNumber = currentRoundNumber + 1;

  // Check if lottery already exists for this round
  const existingLottery = await lotteryRepository.lotteryExistsForRound(
    iqubId,
    nextRoundNumber
  );
  if (existingLottery) {
    throw new Error('Round already has a lottery winner');
  }

  // Get eligible members (has_won = false)
  const eligibleMembers = await memberRepository.findEligibleMembers(iqubId);
  
  if (eligibleMembers.length === 0) {
    throw new Error('No eligible members for lottery');
  }

  // Select random winner
  const winner = selectRandomWinner(eligibleMembers);

  // Create lottery record
  await lotteryRepository.createLottery({
    iqub_id: new mongoose.Types.ObjectId(iqubId),
    round_number: nextRoundNumber,
    winner_id: winner.user_id,
    lottery_date: new Date(),
  });

  // Update member's has_won flag
  await memberRepository.updateMemberHasWon(winner._id.toString(), true);

  return { message: 'Lottery initiated successfully' };
};

/**
 * Get lottery winner for an Iqub
 */
export const getLotteryWinner = async (
  iqubId: string
): Promise<{ message: string; winner: any | null; round_number: number }> => {
  const lottery = await lotteryRepository.findLatestLotteryByIqubId(iqubId);

  if (!lottery) {
    return {
      message: 'No lottery winner found for this round/Iqub',
      winner: null,
      round_number: 0,
    };
  }

  const winner: any = lottery.winner_id;
  
  return {
    message: 'Lottery winner retrieved successfully',
    winner: {
      id: winner._id,
      name: winner.name,
      phone: winner.phone,
    },
    round_number: lottery.round_number,
  };
};
