import * as memberRepository from '../repositories/member.repository';
import * as iqubRepository from '../repositories/iqub.repository';
import * as userRepository from '../repositories/user.repository';
import mongoose from 'mongoose';

/**
 * Add member to Iqub
 */
export const addMember = async (
  iqubId: string,
  collectorId: string,
  phone: string
): Promise<{ message: string }> => {
  // Verify Iqub exists and belongs to collector
  const iqub = await iqubRepository.findIqubById(iqubId);
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Check if Iqub is full
  if (iqub.current_members >= iqub.members_count) {
    throw new Error('Iqub is full');
  }

  // Find user by phone
  const user = await userRepository.findUserByPhone(phone);
  if (!user) {
    throw new Error('User not found with this phone number');
  }

  // Check if user is already a member
  const existingMember = await memberRepository.findMemberByUserAndIqub(
    user._id.toString(),
    iqubId
  );
  if (existingMember) {
    throw new Error('Member already exists in this Iqub');
  }

  // Create member record
  await memberRepository.createMember({
    user_id: user._id,
    iqub_id: new mongoose.Types.ObjectId(iqubId),
    status: 'active',
    has_won: false,
    saving_rounds: 0,
  });

  // Increment current_members
  await iqubRepository.incrementCurrentMembers(iqubId);

  // Update Iqub status to 'active' if members_count reached
  const updatedIqub = await iqubRepository.findIqubById(iqubId);
  if (updatedIqub && updatedIqub.current_members >= updatedIqub.members_count) {
    await iqubRepository.updateIqubStatus(iqubId, 'active');
  }

  return { message: 'Member added successfully' };
};

/**
 * Get members by Iqub
 */
export const getMembersByIqub = async (iqubId: string): Promise<any[]> => {
  const members = await memberRepository.findMembersByIqubId(iqubId);
  
  return members.map((member: any) => ({
    id: member._id,
    user_id: member.user_id._id,
    name: member.user_id.name,
    phone: member.user_id.phone,
    iqub_id: member.iqub_id,
    join_date: member.join_date,
    status: member.status,
    has_won: member.has_won,
    saving_rounds: member.saving_rounds,
  }));
};

/**
 * Get joined Iqubs for a member
 */
export const getJoinedIqubs = async (userId: string): Promise<any[]> => {
  const memberships = await memberRepository.findIqubsByUserId(userId);

  return memberships.map((membership: any) => {
    const iqub = membership.iqub_id;
    return {
      id: iqub._id,
      user_id: iqub.collector_id,
      name: iqub.name,
      saving_pattern: iqub.saving_pattern,
      saving_amount: iqub.saving_amount,
      credit_pattern: iqub.credit_pattern,
      credit_amount: iqub.credit_amount,
      members_count: iqub.members_count,
      current_members: iqub.current_members,
      status: iqub.status,
      next_lottery_date: iqub.next_lottery_date,
      created_at: iqub.created_at,
      updated_at: iqub.updated_at,
      saving_rounds: `${membership.saving_rounds}/${iqub.members_count}`,
    };
  });
};

/**
 * Get member payment details for a specific Iqub
 */
export const getMemberPaymentDetails = async (
  memberId: string,
  iqubId: string,
  collectorId: string
): Promise<any> => {
  // Verify Iqub exists and belongs to collector
  const iqub = await iqubRepository.findIqubById(iqubId);
  if (!iqub) {
    throw new Error('Iqub not found');
  }
  if (iqub.collector_id.toString() !== collectorId) {
    throw new Error('Access denied');
  }

  // Get member details with populated user information
  const member = await memberRepository.findMemberById(memberId);
  if (!member) {
    throw new Error('Member not found');
  }

  // Verify member belongs to this Iqub
  if (member.iqub_id.toString() !== iqubId) {
    throw new Error('Member does not belong to this Iqub');
  }

  // Get payment history (using Round model as payment rounds)
  const Round = require('../models/Round.model').Round;
  const paymentHistory = await Round.find({ iqub_id: iqubId })
    .sort({ round_number: -1 })
    .lean();

  // Get pending verification requests
  const PaymentVerification = require('../models/PaymentVerification.model').PaymentVerification;
  const pendingVerifications = await PaymentVerification.find({
    iqub_id: iqubId,
    member_id: memberId,
    status: 'pending',
  })
    .sort({ submission_date: -1 })
    .lean();

  // Calculate payment statistics
  const verifiedPayments = paymentHistory.filter(
    (p: any) => p.verification_status === 'verified'
  );
  const totalPaid = verifiedPayments.reduce(
    (sum: number, p: any) => sum + (p.total_collected || 0),
    0
  );
  const totalExpected = iqub.saving_amount * iqub.members_count;
  const completionPercentage = (member.saving_rounds / iqub.members_count) * 100;

  // Format response
  return {
    member: {
      id: member._id,
      user_id: (member.user_id as any)._id,
      name: (member.user_id as any).name,
      phone: (member.user_id as any).phone,
      avatar: (member.user_id as any).avatar,
      join_date: member.join_date,
    },
    iqub: {
      id: iqub._id,
      name: iqub.name,
      total_rounds: iqub.members_count,
    },
    payment_stats: {
      current_round: member.saving_rounds + 1,
      total_paid: totalPaid,
      total_expected: totalExpected,
      completion_percentage: Math.round(completionPercentage),
    },
    payment_history: paymentHistory.map((p: any) => ({
      id: p._id,
      round_number: p.round_number,
      amount: p.total_collected || 0,
      payment_date: p.verification_date,
      due_date: p.created_at,
      payment_method: 'manual', // Default for now
      status: p.status,
      verification_status: p.verification_status,
      receipt_urls: [],
      verification_date: p.verification_date,
      collector_notes: p.collector_notes,
    })),
    pending_verifications: pendingVerifications.map((v: any) => ({
      id: v._id,
      member_id: v.member_id,
      iqub_id: v.iqub_id,
      round_number: v.round_number,
      amount: v.amount,
      receipt_urls: v.receipt_urls,
      submission_date: v.submission_date,
      status: v.status,
      member_notes: v.member_notes,
    })),
  };
};
