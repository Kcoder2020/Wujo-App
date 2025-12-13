import { Lottery, ILottery } from '../models/Lottery.model';
import mongoose from 'mongoose';

/**
 * Create a new lottery record
 */
export const createLottery = async (lotteryData: Partial<ILottery>): Promise<ILottery> => {
  const lottery = new Lottery(lotteryData);
  return await lottery.save();
};

/**
 * Find latest lottery by Iqub ID
 */
export const findLatestLotteryByIqubId = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<ILottery | null> => {
  return await Lottery.findOne({ iqub_id: iqubId })
    .sort({ round_number: -1 })
    .populate('winner_id', 'name phone')
    .exec();
};

/**
 * Find lottery by Iqub ID and round number
 */
export const findLotteryByIqubAndRound = async (
  iqubId: string | mongoose.Types.ObjectId,
  roundNumber: number
): Promise<ILottery | null> => {
  return await Lottery.findOne({ iqub_id: iqubId, round_number: roundNumber })
    .populate('winner_id', 'name phone')
    .exec();
};

/**
 * Check if lottery exists for a round
 */
export const lotteryExistsForRound = async (
  iqubId: string | mongoose.Types.ObjectId,
  roundNumber: number
): Promise<boolean> => {
  const count = await Lottery.countDocuments({ iqub_id: iqubId, round_number: roundNumber }).exec();
  return count > 0;
};

/**
 * Get all lotteries for an Iqub
 */
export const findLotteriesByIqubId = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<ILottery[]> => {
  return await Lottery.find({ iqub_id: iqubId })
    .sort({ round_number: 1 })
    .populate('winner_id', 'name phone')
    .exec();
};

/**
 * Count total lotteries by collector
 */
export const countLotteriesByCollector = async (
  collectorId: string | mongoose.Types.ObjectId
): Promise<number> => {
  const Iqub = require('../models/Iqub.model').Iqub;
  
  // Get all Iqubs by collector
  const iqubs = await Iqub.find({ collector_id: collectorId }).select('_id');
  const iqubIds = iqubs.map((iqub: any) => iqub._id);
  
  // Count lotteries for these Iqubs
  return await Lottery.countDocuments({ iqub_id: { $in: iqubIds } }).exec();
};

/**
 * Get recent activities by collector
 */
export const getRecentActivitiesByCollector = async (
  collectorId: string | mongoose.Types.ObjectId,
  limit: number = 10
): Promise<any[]> => {
  const Iqub = require('../models/Iqub.model').Iqub;
  
  // Get all Iqubs by collector
  const iqubs = await Iqub.find({ collector_id: collectorId }).select('_id name');
  const iqubIds = iqubs.map((iqub: any) => iqub._id);
  
  // Get recent lotteries
  const recentLotteries = await Lottery.find({ iqub_id: { $in: iqubIds } })
    .sort({ created_at: -1 })
    .limit(limit)
    .populate('winner_id', 'name phone')
    .populate('iqub_id', 'name')
    .exec();
  
  // Format activities
  return recentLotteries.map((lottery: any) => ({
    type: 'lottery',
    message: `${lottery.winner_id?.name || 'Member'} won lottery for ${lottery.iqub_id?.name || 'Iqub'}`,
    iqub_name: lottery.iqub_id?.name,
    winner_name: lottery.winner_id?.name,
    round_number: lottery.round_number,
    timestamp: lottery.created_at,
  }));
};
