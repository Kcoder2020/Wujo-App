// Credit Round Status Types

export interface CreditRoundStatus {
  iqub: {
    id: string;
    name: string;
    total_credit_rounds: number;
    saving_rounds_per_credit_round: number;
  };
  is_iqub_complete?: boolean;
  current_credit_round: {
    credit_round_number: number;
    saving_round_range: {
      start: number;
      end: number;
    };
    total_saving_rounds: number;
    completion_percentage: number;
    is_complete: boolean;
    lottery_initiated?: boolean;
    can_initiate_lottery: boolean;
  };
  members: CreditRoundMember[];
}

export interface CreditRoundMember {
  member_id: string;
  user_id: string;
  name: string;
  phone: string;
  contribution_type: "full" | "half";
  saving_rounds: SavingRoundStatus[];
  completed_count: number;
  required_count: number;
  is_complete: boolean;
}

export interface SavingRoundStatus {
  saving_round_number: number;
  status: "not_started" | "pending" | "verified" | "failed";
  amount: number;
  payment_date: string | null;
}

// Lottery Credit Rounds Types (for lottery view - all credit rounds)
export interface LotteryWinnerInfo {
  lottery_id: string;
  winner_id: string;
  winner_name: string;
  credit_amount: number;
  is_pair: boolean;
  pair_winner_id: string | null;
  pair_winner_name: string | null;
  lottery_date: string;
}

export interface LotteryCreditRound {
  credit_round_number: number;
  saving_round_range: {
    start: number;
    end: number;
  };
  total_saving_rounds: number;
  completion_percentage: number;
  is_complete: boolean;
  lottery_initiated: boolean;
  can_initiate_lottery: boolean;
  lottery_winner: LotteryWinnerInfo | null;
  members: CreditRoundMember[];
}

export interface LotteryCreditRoundsResponse {
  iqub: {
    id: string;
    name: string;
    total_credit_rounds: number;
    saving_rounds_per_credit_round: number;
    credit_amount: number;
  };
  is_iqub_complete: boolean;
  credit_rounds: LotteryCreditRound[];
}
