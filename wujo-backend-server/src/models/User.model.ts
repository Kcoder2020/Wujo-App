import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword } from '../utils/password.util';

/**
 * User document interface
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  role: 'collector' | 'member';
  password_hash: string;
  profile_picture_url?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * User schema definition
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allow multiple null values
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['male', 'female'],
        message: 'Gender must be either male or female',
      },
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['collector', 'member'],
        message: 'Role must be either collector or member',
      },
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
    },
    profile_picture_url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

/**
 * Pre-save hook to hash password if modified
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }

  try {
    // Only hash if it's not already hashed (doesn't start with $2a$ or $2b$)
    if (!this.password_hash.startsWith('$2a$') && !this.password_hash.startsWith('$2b$')) {
      this.password_hash = await hashPassword(this.password_hash);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * User model
 */
export const User = mongoose.model<IUser>('User', UserSchema);
