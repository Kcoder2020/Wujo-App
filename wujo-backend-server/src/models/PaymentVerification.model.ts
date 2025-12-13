import mongoose, { Document, Schema } from 'mongoose';

/**
 * Payment Verification document interface
 * Represents a manual payment verification request submitted by a member
 */
export interface IPaymentVerification extends Document {
  _id: mongoose.Types.ObjectId;
  member_id: mongoose.Types.ObjectId;
  iqub_id: mongoose.Types.ObjectId;
  round_number: number;
  amount: number;
  receipt_urls: string[];
  submission_date: Date;
  status: 'pending' | 'approved' | 'rejected';
  member_notes?: string;
  collector_id?: mongoose.Types.ObjectId;
  decision_date?: Date;
  collector_notes?: string;
  rejection_reason?: string;
  created_at: Date;
}

/**
 * Payment Verification schema definition
 */
const PaymentVerificationSchema = new Schema<IPaymentVerification>(
  {
    member_id: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID is required'],
      index: true,
    },
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
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount must be positive'],
    },
    receipt_urls: {
      type: [String],
      required: [true, 'At least one receipt is required'],
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: 'Receipt URLs array cannot be empty',
      },
    },
    submission_date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected',
      },
      default: 'pending',
      index: true,
    },
    member_notes: {
      type: String,
      maxlength: [500, 'Member notes cannot exceed 500 characters'],
    },
    collector_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    decision_date: {
      type: Date,
    },
    collector_notes: {
      type: String,
      maxlength: [500, 'Collector notes cannot exceed 500 characters'],
    },
    rejection_reason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
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
 * Compound indexes for efficient querying
 */
// Index for finding pending verifications by Iqub
PaymentVerificationSchema.index({ iqub_id: 1, status: 1 });

// Index for finding member's verification requests
PaymentVerificationSchema.index({ member_id: 1, iqub_id: 1, status: 1 });

// Index for finding verification by round
PaymentVerificationSchema.index({ iqub_id: 1, round_number: 1 });

/**
 * Payment Verification model
 */
export const PaymentVerification = mongoose.model<IPaymentVerification>(
  'PaymentVerification',
  PaymentVerificationSchema
);
