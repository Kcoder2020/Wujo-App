import { User, IUser } from '../models/User.model';
import mongoose from 'mongoose';

/**
 * Create a new user
 */
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Find user by phone number
 */
export const findUserByPhone = async (phone: string): Promise<IUser | null> => {
  return await User.findOne({ phone }).exec();
};

/**
 * Find user by ID
 */
export const findUserById = async (userId: string | mongoose.Types.ObjectId): Promise<IUser | null> => {
  return await User.findById(userId).select('-password_hash').exec();
};

/**
 * Find user by ID including password hash (for authentication)
 */
export const findUserByIdWithPassword = async (userId: string | mongoose.Types.ObjectId): Promise<IUser | null> => {
  return await User.findById(userId).exec();
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string | mongoose.Types.ObjectId,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password_hash').exec();
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string | mongoose.Types.ObjectId): Promise<boolean> => {
  const result = await User.findByIdAndDelete(userId).exec();
  return result !== null;
};
