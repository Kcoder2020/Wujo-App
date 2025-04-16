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
