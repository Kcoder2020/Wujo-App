import * as iqubRepository from '../repositories/iqub.repository';
import * as roundRepository from '../repositories/round.repository';
import * as memberRepository from '../repositories/member.repository';
import { IIqub } from '../models/Iqub.model';
import { isPositiveNumber, isPositiveInteger, isFutureDate } from '../utils/validation.util';
import mongoose from 'mongoose';

export interface CreateIqubData {
  name: string;
  saving_pattern: number | string;
  saving_amount: number | string;
  credit_pattern: number | string;
  credit_amount: number | string;
  members_count: number;
}

/**
 * Create a new Iqub
 */
export const createIqub = async (
  collectorId: string,
  iqubData: CreateIqubData
): Promise<IIqub> => {
  // Validate amounts
  if (!isPositiveNumber(iqubData.saving_amount)) {
    throw new Error('Saving amount must be a positive number');
  }
  if (!isPositiveNumber(iqubData.credit_amount)) {
    throw new Error('Credit amount must be a positive number');
  }

  // Validate members count
  if (!isPositiveInteger(iqubData.members_count) || iqubData.members_count < 2) {
    throw new Error('Members count must be an integer greater than 1');
  }

  // Convert string values to numbers
  const saving_amount = typeof iqubData.saving_amount === 'string' 
    ? parseFloat(iqubData.saving_amount) 
    : iqubData.saving_amount;
  
  const credit_amount = typeof iqubData.credit_amount === 'string'
    ? parseFloat(iqubData.credit_amount)
    : iqubData.credit_amount;

  const saving_pattern = typeof iqubData.saving_pattern === 'string'
    ? parseInt(iqubData.saving_pattern, 10)
    : iqubData.saving_pattern;

  const credit_pattern = typeof iqubData.credit_pattern === 'string'
    ? parseInt(iqubData.credit_pattern, 10)
    : iqubData.credit_pattern;

  // Create Iqub with status 'pending'
  const iqub = await iqubRepository.createIqub({
    collector_id: new mongoose.Types.ObjectId(collectorId),
    name: iqubData.name,
    saving_pattern,
    saving_amount,
    credit_pattern,
    credit_amount,
    members_count: iqubData.members_count,
    current_members: 0,
    status: 'pending',
  });

  return iqub;
};

/**
 * Get Iqubs by collector with computed fields
 */
export const getIqubsByCollector = async (collectorId: string): Promise<any[]> => {
  const iqubs = await iqubRepository.findIqubsByCollectorId(collectorId);

  // Compute hosted_lottery and total_collected for each Iqub
  const iqubsWithComputedFields = await Promise.all(
    iqubs.map(async (iqub) => {
      const completedRounds = await roundRepository.countCompletedRounds(iqub._id);
      const hosted_lottery = `${completedRounds}/${iqub.members_count}`;
      
      // Calculate total collected (completed rounds * saving amount * members count)
      const total_collected = completedRounds * iqub.saving_amount * iqub.current_members;

      return {
        id: iqub._id,
        user_id: iqub.collector_id,
        name: iqub.name,
        saving_pattern: iqub.saving_pattern,
        saving_amount: iqub.saving_amount,
        credit_pattern: iqub.credit_pattern,
        credit_amount: iqub.credit_amount,
        members_count: iqub.members_count,
        current_members: iqub.current_members,
        status: iqub.status,
        next_lottery_date: iqub.next_lottery_date,
        created_at: iqub.created_at,
        updated_at: iqub.updated_at,
        hosted_lottery,
        total_collected,
      };
    })
  );

  return iqubsWithComputedFields;
};

/**
 * Get Iqub by ID with ownership verification and members list
 */
export const getIqubById = async (iqubId: string, userId: string): Promise<any> => {
  const iqub = await iqubRepository.findIqubById(iqubId);
  
  if (!iqub) {
    throw new Error('Iqub not found');
  }

  // Verify ownership (collector can access their own Iqubs)
  if (iqub.collector_id.toString() !== userId) {
    throw new Error('Access denied');
  }

  // Fetch members for this Iqub
  const members = await memberRepository.findMembersByIqubId(iqubId);
  
  // Calculate computed fields
  const completedRounds = await roundRepository.countCompletedRounds(iqub._id);
  const hosted_lottery = `${completedRounds}/${iqub.members_count}`;
  const total_collected = completedRounds * iqub.saving_amount * iqub.current_members;

  // Return Iqub with members list and computed fields
  return {
    id: iqub._id,
    user_id: iqub.collector_id,
    name: iqub.name,
    saving_pattern: iqub.saving_pattern,
    saving_amount: iqub.saving_amount,
    credit_pattern: iqub.credit_pattern,
    credit_amount: iqub.credit_amount,
    members_count: iqub.members_count,
    current_members: iqub.current_members,
    status: iqub.status,
    next_lottery_date: iqub.next_lottery_date,
    created_at: iqub.created_at,
    updated_at: iqub.updated_at,
    hosted_lottery,
    total_collected,
    members_list: members.map((member: any) => ({
      id: member._id,
      user_id: member.user_id._id,
      iqub_id: member.iqub_id,
      name: member.user_id.name,
      phone: member.user_id.phone,
      join_date: member.join_date,
      status: member.status,
      saving_rounds: member.saving_rounds,
    })),
  };
};

/**
 * Update next lottery date
 */
export const updateNextLotteryDate = async (
  iqubId: string,
  collectorId: string,
  date: string
): Promise<IIqub> => {
  // Verify ownership
  const iqub = await iqubRepository.findIqubById(iqubId);
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Validate date is in the future
  if (!isFutureDate(date)) {
    throw new Error('Date must be in the future');
  }

  // Update next lottery date
  const updatedIqub = await iqubRepository.updateIqub(iqubId, {
    next_lottery_date: new Date(date),
  });

  if (!updatedIqub) {
    throw new Error('Failed to update lottery date');
  }

  return updatedIqub;
};
