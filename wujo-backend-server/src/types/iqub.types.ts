export interface IqubResponse {
  id: string;
  user_id: string;
  name: string;
  saving_pattern: number;
  saving_amount: number;
  credit_pattern: number;
  credit_amount: number;
  members_count: number;
  current_members: number;
  status: 'pending' | 'active' | 'completed';
  next_lottery_date: Date | null;
  created_at: Date;
  updated_at: Date;
  hosted_lottery?: string;
  total_collected?: number;
}

export interface CreateIqubRequest {
  name: string;
  saving_pattern: number | string;
  saving_amount: number | string;
  credit_pattern: number | string;
  credit_amount: number | string;
  members_count: number;
}

export interface AddMemberRequest {
  phone: string;
}

export interface SetLotteryDateRequest {
  date: string;
}
