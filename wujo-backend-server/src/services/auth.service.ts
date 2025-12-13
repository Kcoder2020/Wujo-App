import * as userRepository from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { IUser } from '../models/User.model';

export interface SignupData {
  name: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'collector' | 'member';
  password: string;
  email?: string;
}

export interface AuthResult {
  user: Partial<IUser>;
  token: string;
}

/**
 * Register a new user
 */
export const signup = async (signupData: SignupData): Promise<AuthResult> => {
  // Check if phone already exists
  const existingUser = await userRepository.findUserByPhone(signupData.phone);
  if (existingUser) {
    throw new Error('Phone number already registered');
  }

  // Hash password
  const password_hash = await hashPassword(signupData.password);

  // Create user
  const user = await userRepository.createUser({
    name: signupData.name,
    phone: signupData.phone,
    email: signupData.email,
    gender: signupData.gender,
    role: signupData.role,
    password_hash,
  });

  // Generate token
  const token = generateToken(user._id.toString(), user.role);

  // Return user without password
  const userResponse = {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    gender: user.gender,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user: userResponse, token };
};

/**
 * Login user
 */
export const login = async (phone: string, password: string): Promise<AuthResult> => {
  // Find user by phone (need password hash for comparison)
  const user = await userRepository.findUserByPhone(phone);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user._id.toString(), user.role);

  // Return user without password
  const userResponse = {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    gender: user.gender,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user: userResponse, token };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<Partial<IUser>> => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    gender: user.gender,
    role: user.role,
    profile_picture_url: user.profile_picture_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
