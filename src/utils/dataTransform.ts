/**
 * Data Transformation Utilities
 * Converts backend snake_case responses to frontend camelCase
 */

interface BackendPaymentRecord {
  id: string;
  round_number: number;
  amount: number;
  payment_date: string;
  payment_method:
    | "mobile_money"
    | "bank_transfer"
    | "cash"
    | "manual"
    | "chapa";
  status: "success" | "pending" | "failed";
  chapa_tx_ref: string | null;
  verification_id: string | null;
  receipt_urls?: string[];
}

interface FrontendPaymentRecord {
  id: string;
  roundNumber: number;
  amount: number;
  paymentDate: string;
  paymentMethod: "mobile_money" | "bank_transfer" | "cash" | "manual" | "chapa";
  status: "success" | "pending" | "failed";
  chapaTxRef: string | null;
  verificationId: string | null;
  receiptUrls?: string[];
}

interface BackendVerificationRequest {
  id: string;
  member_id: string;
  iqub_id: string;
  round_number: number;
  amount: number;
  receipt_urls: string[];
  submission_date: string;
  status: "pending" | "approved" | "rejected";
  member_notes?: string;
}

interface FrontendVerificationRequest {
  id: string;
  memberId: string;
  iqubId: string;
  roundNumber: number;
  amount: number;
  receiptUrls: string[];
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  memberNotes?: string;
}

/**
 * Transform payment history from backend format to frontend format
 */
export function transformPaymentHistory(
  backendPayments: BackendPaymentRecord[]
): FrontendPaymentRecord[] {
  if (!Array.isArray(backendPayments)) {
    console.warn(
      "transformPaymentHistory: Expected array, got:",
      typeof backendPayments
    );
    return [];
  }

  return backendPayments.map((payment) => ({
    id: payment.id,
    roundNumber: payment.round_number,
    amount: payment.amount,
    paymentDate: payment.payment_date,
    paymentMethod: payment.payment_method,
    status: payment.status,
    chapaTxRef: payment.chapa_tx_ref,
    verificationId: payment.verification_id,
    receiptUrls: payment.receipt_urls || [],
  }));
}

/**
 * Transform verification requests from backend format to frontend format
 */
export function transformVerificationRequests(
  backendRequests: BackendVerificationRequest[]
): FrontendVerificationRequest[] {
  if (!Array.isArray(backendRequests)) {
    console.warn(
      "transformVerificationRequests: Expected array, got:",
      typeof backendRequests
    );
    return [];
  }

  return backendRequests.map((request) => ({
    id: request.id,
    memberId: request.member_id,
    iqubId: request.iqub_id,
    roundNumber: request.round_number,
    amount: request.amount,
    receiptUrls: request.receipt_urls,
    submissionDate: request.submission_date,
    status: request.status,
    memberNotes: request.member_notes,
  }));
}

/**
 * Transform complete member payment data
 */
export function transformMemberPaymentData(backendData: any): any {
  if (!backendData) {
    console.warn("transformMemberPaymentData: No data provided");
    return null;
  }

  return {
    member: backendData.member,
    iqub: backendData.iqub,
    current_credit_round: backendData.current_credit_round,
    payment_stats: backendData.payment_stats,
    payment_history: transformPaymentHistory(backendData.payment_history || []),
    pending_verifications: transformVerificationRequests(
      backendData.pending_verifications || []
    ),
  };
}
