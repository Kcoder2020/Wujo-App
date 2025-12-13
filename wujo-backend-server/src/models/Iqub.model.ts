import mongoose, { Document, Schema } from 'mongoose';

/**
 * Iqub document interface
 */
export interface IIqub extends Document {
  _id: mongoose.Types.ObjectId;
  collector_id: mongoose.Types.ObjectId;
  name: string;
  saving_pattern: number;
  saving_amount: number;
  credit_pattern: number;
  credit_amount: number;
  members_count: number;
  current_members: number;
  total_collected: number;
  status: 'pending' | 'active' | 'completed';
  next_lottery_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Iqub schema definition
 */
const IqubSchema = new Schema<IIqub>(
  {
    collector_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Collector ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Iqub name is required'],
      trim: true,
    },
    saving_pattern: {
      type: Number,
      required: [true, 'Saving pattern is required'],
    },
    saving_amount: {
      type: Number,
      required: [true, 'Saving amount is required'],
      min: [0, 'Saving amount must be positive'],
    },
    credit_pattern: {
      type: Number,
      required: [true, 'Credit pattern is required'],
    },
    credit_amount: {
      type: Number,
      required: [true, 'Credit amount is required'],
      min: [0, 'Credit amount must be positive'],
    },
    members_count: {
      type: Number,
      required: [true, 'Members count is required'],
      min: [2, 'Members count must be at least 2'],
    },
    current_members: {
      type: Number,
      default: 0,
      min: [0, 'Current members cannot be negative'],
    },
    total_collected: {
      type: Number,
      default: 0,
      min: [0, 'Total collected cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'completed'],
        message: 'Status must be pending, active, or completed',
      },
      default: 'pending',
      index: true,
    },
    next_lottery_date: {
      type: Date,
      default: null,
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
 * Virtual field for hosted_lottery calculation
 * Returns format like "8/10" representing current round / total rounds
 */
IqubSchema.virtual('hosted_lottery').get(function () {
  // This will be computed in the service layer with actual round data
  return `0/${this.members_count}`;
});

/**
 * Ensure virtuals are included in JSON output
 */
IqubSchema.set('toJSON', { virtuals: true });
IqubSchema.set('toObject', { virtuals: true });

/**
 * Iqub model
 */
export const Iqub = mongoose.model<IIqub>('Iqub', IqubSchema);
