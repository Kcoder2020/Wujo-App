export interface AppState {
  auth: {
    token: string | null;
  };
}

export interface Iqub {
  id: number;
  name: string;
  collector_id: number;
  saving_pattern: number | string;
  saving_amount: string | number;
  credit_pattern: number | string;
  credit_amount: string | number;
  members_count: number;
  current_members?: number;
  joined_members?: number;
  lottery_winner?: string;
  members_list: Member[];
  status?: string;
  created_at?: string;
  members?: Member[];
  hosted_lottery?: string;
  total_collected?: string | number;
  next_lottery_date?: string | null;
}

export interface Member {
  id: number;
  user_id: number;
  iqub_id: number;
  phone?: string;
  name?: string;
  join_date?: string;
  status?: string;
  saving_rounds?: string;
}

export interface User {
  role: string;
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
}

// ** New Interface for Payment Rounds **
export interface PaymentRound {
  id: number; // Unique ID for the payment round entry
  iqub_id: number; // ID of the iqub this round belongs to
  round_number: number; // The sequential number of this round (1st, 2nd, etc.)
  // Assuming API returns winner/collector details within the round object
  winner_member_id?: number | null; // The member ID who is collecting/winning this round
  winner_member_name?: string | null; // The name of the member collecting/winning
  due_date: string; // The date the payment for this round is due (string format like 'YYYY-MM-DD')
  payment_date?: string | null; // The date the payment was actually made by the paying member
  collection_date?: string | null; // The date the collection was received by the winner
  amount: number | string; // The amount for this specific round
  status: string; // General status of the round (e.g., 'pending', 'completed', 'missed')
  // This field aligns with the 'verifyPaymentRound' action payload
  verification_status?: "pending" | "verified" | "rejected" | null; // Status of the payment verification
  // Optional: Who is responsible for paying this round (if different from winner)?
  // paying_member_id?: number | null;
  // paying_member_name?: string | null;
}
