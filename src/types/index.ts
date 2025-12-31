export interface AppState {
  auth: {
    token: string | null;
  };
}

export interface Iqub {
  half_contributors: number;
  id: number | string; // Support both numeric IDs and MongoDB ObjectId strings
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
  saving_rounds?: string; // Format: "completed/total" e.g., "1/9"
  // New fields from backend API updates
  effective_members?: number;
  credit_round?: number;
  saving_round?: number;
  saving_rounds_per_credit_round?: number;
  completed_saving_rounds?: number;
  completed_credit_rounds?: number;
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

// ** Notification System Types **
export type NotificationType =
  | "payment_verification"
  | "payment_reminder"
  | "payment_confirmed"
  | "lottery_scheduled"
  | "lottery_win"
  | "member_join_request"
  | "iqub_invitation"
  | "iqub_milestone"
  | "system_update"
  | "account_security"
  | "general";

export type UserRole = "collector" | "member";

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string; // ISO 8601 format
  read: boolean;
  type: NotificationType;
  targetRoles: UserRole[]; // ['collector'] | ['member'] | ['collector', 'member']
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string; // Optional navigation target
  metadata?: {
    iqubId?: number;
    memberId?: number;
    paymentId?: number;
    [key: string]: any;
  };
}

// ** SideMenu Types **
export interface MenuItemConfig {
  label?: string;
  icon?: string;
  route?: string | null;
  roles?: UserRole[]; // Made optional for divider items
  badge?: () => number; // Reactive badge count function
  action?: string; // For special actions like logout
  divider?: boolean; // For visual separators
}

export interface MenuSection {
  title?: string; // Optional section title
  items: MenuItemConfig[];
}

// ** Tab Bar Types **
export interface TabItemConfig {
  name: string; // Unique identifier (e.g., "dashboard")
  label: string; // Display text (e.g., "Dashboard")
  icon: string; // Ionicon reference
  route: string; // Navigation path (e.g., "/collector/dashboard")
  roles: UserRole[]; // Access control
  badge?: () => number; // Optional reactive badge count
}

// ** Member Iqub Details Types **
export interface MemberIqubDetails {
  iqub: {
    id: string;
    name: string;
    saving_amount: number;
    credit_amount: number;
    members_count: number;
    half_contributors: number;
    effective_members: number;
    current_members: number;
    status: "active" | "completed" | "pending";
    next_lottery_date: string | null;
  };
  member: {
    id: string;
    name: string;
    phone: string;
    avatar: string | null;
    contribution_type: "full" | "half";
    join_date: string;
    saving_rounds: number;
    has_won: boolean;
  };
  current_credit_round: {
    credit_round_number: number;
    saving_round_range: {
      start: number;
      end: number;
    };
    total_credit_rounds: number;
    saving_rounds_per_credit_round: number;
    member_progress: {
      completed_saving_rounds: number;
      required_saving_rounds: number;
      is_complete: boolean;
    };
  };
  stats: {
    total_saved: number;
    current_round: number;
    total_rounds: number;
    completion_percentage: number;
    lottery_position: number;
  };
  payment_history: RoundPaymentDetails[];
}

export interface RoundPaymentDetails {
  round_number: number;
  amount: number;
  payment_method: "chapa" | "manual" | null;
  status:
    | "success"
    | "pending"
    | "failed"
    | "pending_verification"
    | "due"
    | "upcoming";
  paid_at: string | null;
  chapa_tx_ref: string | null;
  receipt_urls?: string[];
  due_date?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  data: {
    checkout_url: string;
    tx_ref: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    status: "success" | "failed" | "not_found";
    amount?: number;
    currency?: string;
    reference?: string;
  };
}

// ** Collector Dashboard Types **
export interface CollectorDashboardOverview {
  total_collected: number;
  total_members: number;
  total_iqubs: number;
  hosted_lotteries: number;
}

export interface DashboardActivity {
  id: number;
  type: "lottery" | "payment" | "member" | "iqub_created";
  title: string;
  description: string;
  timestamp: string; // ISO 8601 format
}

export interface MonthlyCollectionData {
  month: string; // e.g., "Jan", "Feb", "Mar"
  amount: number;
  target?: number; // Optional target for that month
}

export interface MonthlyCollections {
  period: "1month" | "3months" | "6months";
  data: MonthlyCollectionData[];
}

export interface CollectorDashboardData {
  overview: CollectorDashboardOverview;
  recent_activities: DashboardActivity[];
  monthly_collections: MonthlyCollections;
}

// Export Credit Round types (excluding LotteryWinnerInfo to avoid conflict with lottery.ts)
export {
  CreditRoundStatus,
  CreditRoundMember,
  SavingRoundStatus,
  LotteryCreditRound,
  LotteryCreditRoundsResponse,
} from "./creditRound";

// Export Lottery types
export * from "./lottery";
