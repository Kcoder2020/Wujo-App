import mongoose, { Document, Schema } from 'mongoose';

/**
 * Lottery document interface
 */
export interface ILottery extends Document {
  _id: mongoose.Types.ObjectId;
  iqub_id: mongoose.Types.ObjectId;
  round_number: number;
  winner_id: mongoose.Types.ObjectId;
  lottery_date: Date;
  created_at: Date;
}

/**
 * Lottery schema definition
 */
const LotterySchema = new Schema<ILottery>(
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
    winner_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Winner ID is required'],
    },
    lottery_date: {
      type: Date,
      default: Date.now,
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
 * Compound unique index to prevent duplicate lottery records
 */
LotterySchema.index({ iqub_id: 1, round_number: 1 }, { unique: true });

/**
 * Lottery model
 */
export const Lottery = mongoose.model<ILottery>('Lottery', LotterySchema);
