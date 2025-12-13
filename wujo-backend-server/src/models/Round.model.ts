import mongoose, { Document, Schema } from 'mongoose';

/**
 * Round document interface
 */
export interface IRound extends Document {
  _id: mongoose.Types.ObjectId;
  iqub_id: mongoose.Types.ObjectId;
  round_number: number;
  status: 'pending' | 'verified' | 'rejected';
  winner_id: mongoose.Types.ObjectId | null;
  total_collected: number;
  expected_amount: number;
  verification_date: Date | null;
  verification_status: 'pending' | 'verified' | 'rejected' | null;
  collector_notes?: string;
  created_at: Date;
}

/**
 * Round schema definition
 */
const RoundSchema = new Schema<IRound>(
  {
    iqub_id: {
      type: Schema.Types.ObjectId,
      ref: 'Iqub',
      required: [true, 'Iqub ID is required'],
      index: true,
    },
    round_number: {
      type: Number,
      required: [true, 'Round number is required'],
      min: [1, 'Round number must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected'],
        message: 'Status must be pending, verified, or rejected',
      },
      default: 'pending',
    },
    winner_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    total_collected: {
      type: Number,
      default: 0,
      min: [0, 'Total collected cannot be negative'],
    },
    expected_amount: {
      type: Number,
      required: [true, 'Expected amount is required'],
      min: [0, 'Expected amount must be positive'],
    },
    verification_date: {
      type: Date,
      default: null,
    },
    verification_status: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected', null],
        message: 'Verification status must be pending, verified, rejected, or null',
      },
      default: null,
      index: true,
    },
    collector_notes: {
      type: String,
      maxlength: [500, 'Collector notes cannot exceed 500 characters'],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using custom created_at field
  }
);

/**
 * Compound unique index to prevent duplicate rounds
 */
RoundSchema.index({ iqub_id: 1, round_number: 1 }, { unique: true });

/**
 * Round model
 */
export const Round = mongoose.model<IRound>('Round', RoundSchema);
