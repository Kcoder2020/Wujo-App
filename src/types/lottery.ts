// Lottery System Types

/**
 * Represents a lottery winner (single or part of a pair)
 */
export interface LotteryWinner {
  member_id: string;
  name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_member?: {
    member_id: string;
    name: string;
    credit_amount?: number;
  };
  lottery_id?: string;
  credit_round_number?: number;
}

/**
 * Credit round information for lottery display
 */
export interface CreditRoundInfo {
  credit_round_number: number;
  saving_round_range: {
    start: number;
    end: number;
  };
  completion_percentage: number;
  is_complete: boolean;
  can_initiate_lottery: boolean;
  lottery_completed: boolean;
  winner?: LotteryWinner;
  lottery_date?: string;
}

/**
 * Wheel segment for the spin wheel component
 */
export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  isPair: boolean;
  members: {
    id: string;
    name: string;
  }[];
}

/**
 * Eligible member for lottery participation
 */
export interface EligibleMember {
  member_id: string;
  name: string;
  contribution_type: "full" | "half";
  has_won: boolean;
}

/**
 * Historical lottery record
 */
export interface LotteryRecord {
  id: string;
  iqub_id: string;
  credit_round_number: number;
  winner_member_id: string;
  winner_name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_member_id?: string;
  pair_member_name?: string;
  initiated_at: string;
}

/**
 * Result from lottery initiation
 */
export interface LotteryResult {
  success: boolean;
  winner: LotteryWinner;
  lottery_id: string;
}

// API Response Types

/**
 * API response for single winner lottery
 */
export interface LotteryInitiateResponse {
  success: true;
  data: {
    lottery_id: string;
    winner: {
      member_id: string;
      name: string;
      credit_amount: number;
    };
    credit_round_number: number;
  };
}

/**
 * API response for pair winner lottery
 */
export interface LotteryInitiatePairResponse {
  success: true;
  data: {
    lottery_id: string;
    winners: [
      {
        member_id: string;
        name: string;
        credit_amount: number;
      },
      {
        member_id: string;
        name: string;
        credit_amount: number;
      }
    ];
    credit_round_number: number;
    is_pair: true;
  };
}

/**
 * API error response for lottery initiation
 */
export interface LotteryInitiateError {
  success: false;
  message: string;
  error_code?: string;
}

/**
 * Union type for all lottery API responses
 */
export type LotteryApiResponse =
  | LotteryInitiateResponse
  | LotteryInitiatePairResponse
  | LotteryInitiateError;

/**
 * Fetch status for async operations
 */
export type LotteryFetchStatus = "idle" | "loading" | "success" | "error";

/**
 * Lottery state for Vuex store
 */
export interface LotteryState {
  lotteryHistory: LotteryRecord[];
  lotteryHistoryStatus: LotteryFetchStatus;
  lotteryHistoryError: string | null;
  currentLotteryResult: LotteryResult | null;
  isInitiatingLottery: boolean;
}

// Member Lottery Notification Types

/**
 * Participant in a lottery draw
 */
export interface LotteryParticipant {
  user_id: string;
  name: string;
  contribution_type: "full" | "half";
  paired_with_name: string | null;
}

/**
 * Winner information for a lottery result
 */
export interface LotteryWinnerInfo {
  user_id: string;
  name: string;
  is_pair: boolean;
  pair_user_id: string | null;
  pair_name: string | null;
}

/**
 * Lottery result as seen by a member
 */
export interface MemberLotteryResult {
  lottery_id: string;
  iqub_id: string;
  iqub_name: string;
  credit_round_number: number;
  credit_amount: number;
  lottery_date: string;
  winner: LotteryWinnerInfo;
  participants: LotteryParticipant[];
  is_viewed: boolean;
  is_winner: boolean;
}

/**
 * Notification count response from API
 */
export interface NotificationCount {
  unviewed_lottery_results: number;
}
