import { Iqub, IIqub } from '../models/Iqub.model';
import mongoose from 'mongoose';

/**
 * Create a new Iqub
 */
export const createIqub = async (iqubData: Partial<IIqub>): Promise<IIqub> => {
  const iqub = new Iqub(iqubData);
  return await iqub.save();
};

/**
 * Find Iqubs by collector ID with sorting
 */
export const findIqubsByCollectorId = async (
  collectorId: string | mongoose.Types.ObjectId
): Promise<IIqub[]> => {
  return await Iqub.find({ collector_id: collectorId })
    .sort({ created_at: -1 })
    .exec();
};

/**
 * Find Iqub by ID
 */
export const findIqubById = async (iqubId: string | mongoose.Types.ObjectId): Promise<IIqub | null> => {
  return await Iqub.findById(iqubId).exec();
};

/**
 * Update Iqub
 */
export const updateIqub = async (
  iqubId: string | mongoose.Types.ObjectId,
  updateData: Partial<IIqub>
): Promise<IIqub | null> => {
  return await Iqub.findByIdAndUpdate(iqubId, updateData, { new: true }).exec();
};

/**
 * Increment current members count
 */
export const incrementCurrentMembers = async (
  iqubId: string | mongoose.Types.ObjectId
): Promise<IIqub | null> => {
  return await Iqub.findByIdAndUpdate(
    iqubId,
    { $inc: { current_members: 1 } },
    { new: true }
  ).exec();
};

/**
 * Update Iqub status
 */
export const updateIqubStatus = async (
  iqubId: string | mongoose.Types.ObjectId,
  status: 'pending' | 'active' | 'completed'
): Promise<IIqub | null> => {
  return await Iqub.findByIdAndUpdate(iqubId, { status }, { new: true }).exec();
};

/**
 * Delete Iqub
 */
export const deleteIqub = async (iqubId: string | mongoose.Types.ObjectId): Promise<boolean> => {
  const result = await Iqub.findByIdAndDelete(iqubId).exec();
  return result !== null;
};
