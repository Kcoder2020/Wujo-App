import { Member, IMember } from '../models/Member.model';
import mongoose from 'mongoose';

/**
 * Create a new member
 */
export const createMember = async (memberData: Partial<IMember>): Promise<IMember> => {
  const member = new Member(memberData);
  return await member.save();
};

/**
 * Find members by Iqub ID
 */
export const findMembersByIqubId = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<IMember[]> => {
  return await Member.find({ iqub_id: iqubId })
    .populate('user_id', 'name phone')
    .exec();
};

/**
 * Find member by user ID and Iqub ID
 */
export const findMemberByUserAndIqub = async (
  userId: string | mongoose.Types.ObjectId,
  iqubId: string | mongoose.Types.ObjectId
): Promise<IMember | null> => {
  return await Member.findOne({ user_id: userId, iqub_id: iqubId }).exec();
};

/**
 * Find Iqubs by user ID (for members)
 */
export const findIqubsByUserId = async (
  userId: string | mongoose.Types.ObjectId
): Promise<IMember[]> => {
  return await Member.find({ user_id: userId })
    .populate('iqub_id')
    .sort({ join_date: -1 })
    .exec();
};

/**
 * Update member's has_won flag
 */
export const updateMemberHasWon = async (
  memberId: string | mongoose.Types.ObjectId,
  hasWon: boolean = true
): Promise<IMember | null> => {
  return await Member.findByIdAndUpdate(memberId, { has_won: hasWon }, { new: true }).exec();
};

/**
 * Get eligible members for lottery (has_won = false)
 */
export const findEligibleMembers = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<IMember[]> => {
  return await Member.find({
    iqub_id: iqubId,
    status: 'active',
    has_won: false,
  }).exec();
};

/**
 * Count members in an Iqub
 */
export const countMembersByIqubId = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<number> => {
  return await Member.countDocuments({ iqub_id: iqubId }).exec();
};

/**
 * Find member by ID with populated user information
 */
export const findMemberById = async (
  memberId: string | mongoose.Types.ObjectId
): Promise<IMember | null> => {
  return await Member.findById(memberId)
    .populate('user_id', 'name phone avatar')
    .exec();
};
