import mongoose, { Document, Schema } from 'mongoose';

/**
 * Member document interface
 */
export interface IMember extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  iqub_id: mongoose.Types.ObjectId;
  join_date: Date;
  status: 'active' | 'inactive';
  has_won: boolean;
  saving_rounds: number;
  created_at: Date;
}

/**
 * Member schema definition
 */
const MemberSchema = new Schema<IMember>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    iqub_id: {
      type: Schema.Types.ObjectId,
      ref: 'Iqub',
      required: [true, 'Iqub ID is required'],
      index: true,
    },
    join_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be active or inactive',
      },
      default: 'active',
    },
    has_won: {
      type: Boolean,
      default: false,
    },
    saving_rounds: {
      type: Number,
      default: 0,
      min: [0, 'Saving rounds cannot be negative'],
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
 * Compound unique index to prevent duplicate memberships
 */
MemberSchema.index({ user_id: 1, iqub_id: 1 }, { unique: true });

/**
 * Member model
 */
export const Member = mongoose.model<IMember>('Member', MemberSchema);
