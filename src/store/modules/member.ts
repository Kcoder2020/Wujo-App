import apiService from "../../services/apiService";
import { Commit } from "vuex";
import router from "../../router";
import type {
  MemberIqubDetails,
  RoundPaymentDetails,
  PaymentInitiationResponse,
  PaymentStatusResponse,
} from "@/types";
import type { MemberLotteryResult, NotificationCount } from "@/types/lottery";

type FetchStatus = "idle" | "loading" | "success" | "error";

export interface MemberProfile {
  id?: number | string;
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string | null;
  iqub_joined_count?: number | string;
  lotteries_won_count?: number | string;
  total_saved?: number | string;
  active_iqubs?: number | string;
  join_date?: string;
  // Add other fields that might come from the API
  [key: string]: any;
}

export interface Activity {
  id: string;
  type: "payment" | "lottery_win" | "iqub_join";
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  iqubName?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  earnedDate?: string;
}

export interface Payment {
  id: string;
  iqubName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  receiptUrl?: string;
}

export interface MemberDashboard {
  member: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    joinDate: string;
  };
  summary: {
    totalSavings: number;
    savingsPercentage: number;
    activeIqubs: number;
    completedIqubs: number;
    lotteryPosition: number;
    nextLotteryDate: string;
  };
  recentActivities: Activity[];
  quickStats: {
    paymentsThisMonth: number;
    lotteriesWon: number;
    savingsGoal: number;
  };
}

export interface JoinedIqub {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
  currentAmount: number;
  targetAmount: number;
  completionPercentage: number;
  savingAmount: number;
  nextLotteryDate: string;
  membersCount: number;
  currentRound: number;
  totalRounds: number;
  collectorName: string;
}

export interface AvailableIqub {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  savingAmount: number;
  duration: number;
  membersCount: number;
  spotsAvailable: number;
  startDate: string;
  collectorName: string;
  collectorRating: number;
  category: string;
}

export interface DiscoverFilters {
  search?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  duration?: number;
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface MemberState {
  profile: MemberProfile | null;
  dashboard: MemberDashboard | null;
  joinedIqubs: JoinedIqub[];
  availableIqubs: AvailableIqub[];
  availableIqubsPagination: PaginationMeta | null;
  recentActivity: Activity[];
  achievements: Achievement[];
  paymentHistory: Payment[];
  memberIqubDetails: MemberIqubDetails | null;
  currentPaymentTxRef: string | null;
  error: string | null;
  status: FetchStatus;
  dashboardStatus: FetchStatus;
  joinedIqubsStatus: FetchStatus;
  availableIqubsStatus: FetchStatus;
  achievementsStatus: FetchStatus;
  paymentHistoryStatus: FetchStatus;
  memberIqubDetailsStatus: FetchStatus;
  paymentInitiationStatus: FetchStatus;
  // Lottery Notifications
  unviewedLotteryCount: number;
  unviewedLotteries: MemberLotteryResult[];
  selectedLotteryDetails: MemberLotteryResult | null;
  lotteryNotificationsStatus: FetchStatus;
  lotteryNotificationsError: string | null;
}

const state: MemberState = {
  profile: null,
  dashboard: null,
  joinedIqubs: [],
  availableIqubs: [],
  availableIqubsPagination: null,
  recentActivity: [],
  achievements: [],
  paymentHistory: [],
  memberIqubDetails: null,
  currentPaymentTxRef: null,
  error: null,
  status: "idle",
  dashboardStatus: "idle",
  joinedIqubsStatus: "idle",
  availableIqubsStatus: "idle",
  achievementsStatus: "idle",
  paymentHistoryStatus: "idle",
  memberIqubDetailsStatus: "idle",
  paymentInitiationStatus: "idle",
  // Lottery Notifications
  unviewedLotteryCount: 0,
  unviewedLotteries: [],
  selectedLotteryDetails: null,
  lotteryNotificationsStatus: "idle",
  lotteryNotificationsError: null,
};

const mutations = {
  setProfile(state: MemberState, profile: MemberProfile | null) {
    state.profile = profile;
  },
  setDashboard(state: MemberState, dashboard: MemberDashboard | null) {
    state.dashboard = dashboard;
  },
  setJoinedIqubs(state: MemberState, iqubs: JoinedIqub[]) {
    state.joinedIqubs = iqubs;
  },
  setAvailableIqubs(state: MemberState, iqubs: AvailableIqub[]) {
    state.availableIqubs = iqubs;
  },
  setAvailableIqubsPagination(
    state: MemberState,
    pagination: PaginationMeta | null
  ) {
    state.availableIqubsPagination = pagination;
  },
  setRecentActivity(state: MemberState, activities: Activity[]) {
    state.recentActivity = activities;
  },
  setAchievements(state: MemberState, achievements: Achievement[]) {
    state.achievements = achievements;
  },
  setPaymentHistory(state: MemberState, payments: Payment[]) {
    state.paymentHistory = payments;
  },
  setError(state: MemberState, error: string | null) {
    state.error = error;
  },
  setStatus(state: MemberState, status: FetchStatus) {
    state.status = status;
  },
  setDashboardStatus(state: MemberState, status: FetchStatus) {
    state.dashboardStatus = status;
  },
  setJoinedIqubsStatus(state: MemberState, status: FetchStatus) {
    state.joinedIqubsStatus = status;
  },
  setAvailableIqubsStatus(state: MemberState, status: FetchStatus) {
    state.availableIqubsStatus = status;
  },
  setAchievementsStatus(state: MemberState, status: FetchStatus) {
    state.achievementsStatus = status;
  },
  setPaymentHistoryStatus(state: MemberState, status: FetchStatus) {
    state.paymentHistoryStatus = status;
  },
  setMemberIqubDetails(state: MemberState, details: MemberIqubDetails | null) {
    state.memberIqubDetails = details;
  },
  setMemberIqubDetailsStatus(state: MemberState, status: FetchStatus) {
    state.memberIqubDetailsStatus = status;
  },
  setPaymentInitiationStatus(state: MemberState, status: FetchStatus) {
    state.paymentInitiationStatus = status;
  },
  setCurrentPaymentTxRef(state: MemberState, txRef: string | null) {
    state.currentPaymentTxRef = txRef;
  },
  updateRoundPaymentStatus(
    state: MemberState,
    payload: {
      roundNumber: number;
      status: RoundPaymentDetails["status"];
      paymentData?: Partial<RoundPaymentDetails>;
    }
  ) {
    if (state.memberIqubDetails?.payment_history) {
      const roundIndex = state.memberIqubDetails.payment_history.findIndex(
        (r) => r.round_number === payload.roundNumber
      );
      if (roundIndex !== -1) {
        state.memberIqubDetails.payment_history[roundIndex] = {
          ...state.memberIqubDetails.payment_history[roundIndex],
          status: payload.status,
          ...payload.paymentData,
        };
      }
    }
  },
  // Lottery Notification Mutations
  setUnviewedLotteryCount(state: MemberState, count: number) {
    state.unviewedLotteryCount = count;
  },
  setUnviewedLotteries(state: MemberState, lotteries: MemberLotteryResult[]) {
    state.unviewedLotteries = lotteries;
  },
  setSelectedLotteryDetails(
    state: MemberState,
    details: MemberLotteryResult | null
  ) {
    state.selectedLotteryDetails = details;
  },
  setLotteryNotificationsStatus(state: MemberState, status: FetchStatus) {
    state.lotteryNotificationsStatus = status;
  },
  setLotteryNotificationsError(state: MemberState, error: string | null) {
    state.lotteryNotificationsError = error;
  },
  decrementUnviewedCount(state: MemberState) {
    if (state.unviewedLotteryCount > 0) {
      state.unviewedLotteryCount--;
    }
  },
  removeLotteryFromUnviewed(state: MemberState, lotteryId: string) {
    state.unviewedLotteries = state.unviewedLotteries.filter(
      (lottery) => lottery.lottery_id !== lotteryId
    );
  },
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  return { Authorization: `Bearer ${token}` };
};

// Helper function to handle authentication errors
const handleAuthError = (error: any, commit: Commit) => {
  const serverErrorMessage = error.response?.data?.message;
  if (
    serverErrorMessage === "unauthorized access!" ||
    error.response?.status === 401
  ) {
    console.log("Unauthorized access detected. Navigating to login.");
    localStorage.removeItem("token");
    router.push("/login");
    return true;
  }
  return false;
};

// Helper function to retry API calls
const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 2,
  delay = 1000
): Promise<T> => {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      // Don't retry on authentication errors or client errors (4xx)
      if (
        error.response?.status === 401 ||
        (error.response?.status >= 400 && error.response?.status < 500)
      ) {
        throw error;
      }
      // Only retry on network errors or server errors (5xx)
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * (attempt + 1))
        );
      }
    }
  }
  throw lastError;
};

const actions = {
  /**
   * Fetches the current member's profile information.
   */
  async fetchMemberProfile({ commit }: { commit: Commit }) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      // Use /member/profile endpoint which returns profile with aggregated stats
      const response = await retryApiCall(() =>
        apiService.get("/member/profile", { headers })
      );

      if (response.data) {
        const profileData = response.data.data || response.data;
        console.log("Member profile data:", profileData);
        commit("setProfile", profileData);
        commit("setStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for member profile:",
          response.data
        );
        commit(
          "setError",
          "Received unexpected data format for member profile."
        );
        commit("setStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch member profile:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch member profile. Please try again.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
    }
  },

  /**
   * Fetches the member's dashboard data, including summary stats and recent activity.
   */
  async fetchMemberDashboard({ commit }: { commit: Commit }) {
    commit("setDashboardStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/dashboard", { headers })
      );

      if (response.data) {
        const dashboardData = response.data.data || response.data;
        commit("setDashboard", dashboardData);
        console.log("dashboard ", dashboardData);

        // Also update recent activity if included
        if (dashboardData.recentActivities) {
          commit("setRecentActivity", dashboardData.recentActivities);
        }

        commit("setDashboardStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for dashboard:",
          response.data
        );
        commit("setError", "Failed to load dashboard data.");
        commit("setDashboardStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch member dashboard:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard. Please try again.";
      commit("setError", errorMessage);
      commit("setDashboardStatus", "error");
    }
  },

  /**
   * Fetches the list of Iqubs the member has joined.
   */
  async fetchJoinedIqubs({ commit }: { commit: Commit }) {
    commit("setJoinedIqubsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/joinedIqubs", { headers })
      );

      if (response.data) {
        const iqubsData =
          response.data.data || response.data.iqubs || response.data;
        const iqubs = Array.isArray(iqubsData) ? iqubsData : [];

        // Log the raw data to see what we're getting
        console.log("Raw joined Iqubs data:", iqubs);

        commit("setJoinedIqubs", iqubs);
        commit("setJoinedIqubsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for joined Iqubs:",
          response.data
        );
        commit("setError", "Failed to load your Iqubs.");
        commit("setJoinedIqubsStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch joined Iqubs:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load your Iqubs. Please try again.";
      commit("setError", errorMessage);
      commit("setJoinedIqubsStatus", "error");
    }
  },

  /**
   * Fetches available Iqubs for discovery with optional filtering.
   * @param {Object} context - Vuex context
   * @param {DiscoverFilters} filters - Filters for search, category, amount, etc.
   */
  async fetchAvailableIqubs(
    { commit }: { commit: Commit },
    filters: DiscoverFilters = {}
  ) {
    commit("setAvailableIqubsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const params = {
        search: filters.search,
        category: filters.category,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        duration: filters.duration,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await retryApiCall(() =>
        apiService.get("/iqubs/discover", { headers, params })
      );

      if (response.data) {
        const iqubsData =
          response.data.data || response.data.iqubs || response.data;
        const iqubs = Array.isArray(iqubsData) ? iqubsData : [];
        commit("setAvailableIqubs", iqubs);

        // Extract pagination metadata from response
        const pagination = response.data.pagination || response.data.meta;
        if (pagination) {
          commit("setAvailableIqubsPagination", {
            currentPage:
              pagination.currentPage || pagination.page || params.page,
            totalPages: pagination.totalPages || pagination.pages || 1,
            totalItems:
              pagination.totalItems || pagination.total || iqubs.length,
            itemsPerPage:
              pagination.itemsPerPage || pagination.limit || params.limit,
          });
        } else {
          // If no pagination metadata, assume single page
          commit("setAvailableIqubsPagination", {
            currentPage: 1,
            totalPages: 1,
            totalItems: iqubs.length,
            itemsPerPage: iqubs.length,
          });
        }

        commit("setAvailableIqubsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for available Iqubs:",
          response.data
        );
        commit("setError", "Failed to load available Iqubs.");
        commit("setAvailableIqubsStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch available Iqubs:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load available Iqubs. Please try again.";
      commit("setError", errorMessage);
      commit("setAvailableIqubsStatus", "error");
    }
  },

  /**
   * Joins a specific Iqub.
   * @param {Object} context - Vuex context
   * @param {string} iqubId - The ID of the Iqub to join
   */
  async joinIqub(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    iqubId: string
  ) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await apiService.post(
        "/member/join-iqub",
        { iqubId },
        { headers }
      );

      commit("setStatus", "success");

      // Refresh joined Iqubs list after successful join
      await dispatch("fetchJoinedIqubs");

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Failed to join Iqub:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to join Iqub. Please try again.";
      commit("setError", errorMessage);
      commit("setStatus", "error");

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Updates the member's profile information.
   * @param {Object} context - Vuex context
   * @param {Partial<MemberProfile>} profileData - The profile data to update
   */
  async updateMemberProfile(
    { commit }: { commit: Commit },
    profileData: Partial<MemberProfile>
  ) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await apiService.put("/member/profile", profileData, {
        headers,
      });

      if (response.data) {
        const updatedProfile = response.data.data || response.data;
        commit("setProfile", updatedProfile);
        commit("setStatus", "success");
        return { success: true, data: updatedProfile };
      } else {
        console.error(
          "Unexpected API response structure for profile update:",
          response.data
        );
        commit("setError", "Failed to update profile.");
        commit("setStatus", "error");
        return { success: false, error: "Failed to update profile." };
      }
    } catch (error: any) {
      console.error("Failed to update member profile:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile. Please try again.";
      commit("setError", errorMessage);
      commit("setStatus", "error");

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetches the member's achievements.
   */
  async fetchAchievements({ commit }: { commit: Commit }) {
    commit("setAchievementsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/achievements", { headers })
      );

      if (response.data) {
        const achievementsData =
          response.data.data || response.data.achievements || response.data;
        const achievements = Array.isArray(achievementsData)
          ? achievementsData
          : [];
        commit("setAchievements", achievements);
        commit("setAchievementsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for achievements:",
          response.data
        );
        commit("setError", "Failed to load achievements.");
        commit("setAchievementsStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch achievements:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load achievements. Please try again.";
      commit("setError", errorMessage);
      commit("setAchievementsStatus", "error");
    }
  },

  /**
   * Fetches the member's payment history.
   */
  async fetchPaymentHistory({ commit }: { commit: Commit }) {
    commit("setPaymentHistoryStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/payment-history", { headers })
      );

      if (response.data) {
        const paymentsData =
          response.data.data || response.data.payments || response.data;
        const payments = Array.isArray(paymentsData) ? paymentsData : [];
        commit("setPaymentHistory", payments);
        commit("setPaymentHistoryStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for payment history:",
          response.data
        );
        commit("setError", "Failed to load payment history.");
        commit("setPaymentHistoryStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch payment history:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load payment history. Please try again.";
      commit("setError", errorMessage);
      commit("setPaymentHistoryStatus", "error");
    }
  },

  /**
   * Fetches detailed information about a specific Iqub for the member.
   * @param {Object} context - Vuex context
   * @param {Object} payload - Payload containing iqubId
   */
  async fetchMemberIqubDetails(
    { commit }: { commit: Commit },
    { iqubId }: { iqubId: string }
  ) {
    commit("setMemberIqubDetailsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get(`/member/iqub/${iqubId}`, { headers })
      );

      if (response.data) {
        const iqubDetails = response.data.data || response.data;
        commit("setMemberIqubDetails", iqubDetails);
        commit("setMemberIqubDetailsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for Iqub details:",
          response.data
        );
        commit("setError", "Failed to load Iqub details.");
        commit("setMemberIqubDetailsStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch Member Iqub details:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load Iqub details. Please try again.";
      commit("setError", errorMessage);
      commit("setMemberIqubDetailsStatus", "error");
    }
  },

  /**
   * Initiates a payment for a specific round via Chapa.
   * @param {Object} context - Vuex context
   * @param {Object} payload - Payment details (iqubId, roundNumber, amount)
   */
  async initiatePayment(
    { commit }: { commit: Commit },
    {
      iqubId,
      roundNumber,
      amount,
    }: { iqubId: string; roundNumber: number; amount: number }
  ) {
    commit("setPaymentInitiationStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();

      // Construct return URL with iqubId for redirect after payment
      const returnUrl = `${window.location.origin}/member/iqub/${iqubId}`;
      const callbackUrl = `${
        process.env.VUE_APP_API_BASE_URL || "http://localhost:3000"
      }/payment/payment-webhook`;

      const response = await apiService.post<PaymentInitiationResponse>(
        "/payment/initiate-payment",
        {
          iqubId,
          roundNumber,
          amount,
          callback_url: callbackUrl,
          return_url: returnUrl,
        },
        { headers }
      );
      if (response.data?.success && response.data.data) {
        const { checkout_url, tx_ref } = response.data.data;
        commit("setCurrentPaymentTxRef", tx_ref);
        commit("setPaymentInitiationStatus", "success");
        return { success: true, checkout_url, tx_ref };
      } else {
        console.error(
          "Unexpected API response structure for payment initiation:",
          response.data
        );
        commit("setError", "Failed to initiate payment.");
        commit("setPaymentInitiationStatus", "error");
        return { success: false, error: "Failed to initiate payment." };
      }
    } catch (error: any) {
      console.error("Failed to initiate payment:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment. Please try again.";
      commit("setError", errorMessage);
      commit("setPaymentInitiationStatus", "error");
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Checks the status of a Chapa payment.
   * @param {Object} context - Vuex context
   * @param {Object} payload - Transaction reference
   */
  async checkPaymentStatus(
    { commit }: { commit: Commit },
    { tx_ref }: { tx_ref: string }
  ) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await apiService.post<PaymentStatusResponse>(
        "/payment/check-chapa-status",
        { tx_ref },
        { headers }
      );

      if (response.data?.success && response.data.data) {
        const { status } = response.data.data;
        commit("setStatus", "success");

        // Map Chapa status to our round status
        let roundStatus: RoundPaymentDetails["status"] = "pending";
        if (status === "success") {
          roundStatus = "success";
        } else if (status === "failed") {
          roundStatus = "failed";
        }

        return { success: true, status: roundStatus, data: response.data.data };
      } else {
        console.error(
          "Unexpected API response structure for payment status:",
          response.data
        );
        commit("setError", "Failed to check payment status.");
        commit("setStatus", "error");
        return { success: false, error: "Failed to check payment status." };
      }
    } catch (error: any) {
      console.error("Failed to check payment status:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to check payment status. Please try again.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Submits a manual payment verification request.
   * @param {Object} context - Vuex context
   * @param {Object} payload - Payment details and receipt URL
   */
  async submitManualPayment(
    { commit }: { commit: Commit },
    {
      iqubId,
      roundNumber,
      amount,
      receipt_url,
    }: {
      iqubId: string;
      roundNumber: number;
      amount: number;
      receipt_url: string;
    }
  ) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await apiService.post(
        "/member/payment-verification/submit",
        {
          iqubId,
          roundNumber,
          amount,
          receipt_urls: [receipt_url],
        },
        { headers }
      );

      if (response.data) {
        commit("setStatus", "success");

        // Update the round status to pending_verification
        commit("updateRoundPaymentStatus", {
          roundNumber,
          status: "pending_verification",
          paymentData: {
            payment_method: "manual",
            receipt_urls: [receipt_url],
          },
        });

        return { success: true, data: response.data };
      } else {
        console.error(
          "Unexpected API response structure for manual payment:",
          response.data
        );
        commit("setError", "Failed to submit payment verification.");
        commit("setStatus", "error");
        return {
          success: false,
          error: "Failed to submit payment verification.",
        };
      }
    } catch (error: any) {
      console.error("Failed to submit manual payment:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit payment verification. Please try again.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetches the notification count for unviewed lottery results.
   */
  async fetchNotificationCount({ commit }: { commit: Commit }) {
    try {
      const headers = getAuthHeaders();
      const response = await apiService.get("/member/notifications/count", {
        headers,
      });

      if (response.data) {
        const countData = response.data.data || response.data;
        commit(
          "setUnviewedLotteryCount",
          countData.unviewed_lottery_results || 0
        );
      }
    } catch (error: any) {
      // Gracefully handle error without blocking UI
      console.error("Failed to fetch notification count:", error);
      // Don't set error state - just log it
    }
  },

  /**
   * Fetches all unviewed lottery results for the member.
   */
  async fetchUnviewedLotteries({ commit }: { commit: Commit }) {
    commit("setLotteryNotificationsStatus", "loading");
    commit("setLotteryNotificationsError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/lottery/unviewed", { headers })
      );

      if (response.data) {
        const lotteriesData = response.data.data || response.data;
        const lotteries = Array.isArray(lotteriesData) ? lotteriesData : [];
        commit("setUnviewedLotteries", lotteries);
        commit("setLotteryNotificationsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for unviewed lotteries:",
          response.data
        );
        commit(
          "setLotteryNotificationsError",
          "Failed to load lottery notifications."
        );
        commit("setLotteryNotificationsStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch unviewed lotteries:", error);
      if (handleAuthError(error, commit)) return;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load lottery notifications. Please try again.";
      commit("setLotteryNotificationsError", errorMessage);
      commit("setLotteryNotificationsStatus", "error");
    }
  },

  /**
   * Fetches detailed information about a specific lottery.
   * @param {Object} context - Vuex context
   * @param {string} lotteryId - The ID of the lottery to fetch
   */
  async fetchLotteryDetails(
    { commit }: { commit: Commit },
    { lotteryId }: { lotteryId: string }
  ) {
    commit("setLotteryNotificationsStatus", "loading");
    commit("setLotteryNotificationsError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get(`/member/lottery/${lotteryId}`, { headers })
      );

      if (response.data) {
        const lotteryDetails = response.data.data || response.data;
        commit("setSelectedLotteryDetails", lotteryDetails);
        commit("setLotteryNotificationsStatus", "success");
        return { success: true, data: lotteryDetails };
      } else {
        console.error(
          "Unexpected API response structure for lottery details:",
          response.data
        );
        commit(
          "setLotteryNotificationsError",
          "Failed to load lottery details."
        );
        commit("setLotteryNotificationsStatus", "error");
        return { success: false, error: "Failed to load lottery details." };
      }
    } catch (error: any) {
      console.error("Failed to fetch lottery details:", error);
      if (handleAuthError(error, commit)) return { success: false };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load lottery details. Please try again.";
      commit("setLotteryNotificationsError", errorMessage);
      commit("setLotteryNotificationsStatus", "error");
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Marks a lottery as viewed after the member has seen the animation.
   * Retries silently up to 3 times on failure.
   * @param {Object} context - Vuex context
   * @param {string} lotteryId - The ID of the lottery to mark as viewed
   */
  async markLotteryAsViewed(
    { commit }: { commit: Commit },
    { lotteryId }: { lotteryId: string }
  ) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const headers = getAuthHeaders();
        await apiService.post(
          `/member/lottery/${lotteryId}/viewed`,
          {},
          { headers }
        );

        // Update state on success
        commit("decrementUnviewedCount");
        commit("removeLotteryFromUnviewed", lotteryId);
        return { success: true };
      } catch (error: any) {
        attempt++;
        console.error(
          `Failed to mark lottery as viewed (attempt ${attempt}):`,
          error
        );

        if (attempt >= maxRetries) {
          // Don't block user, just log the error
          console.error("Max retries reached for marking lottery as viewed");
          return { success: false };
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return { success: false };
  },
};

const getters = {
  profile: (state: MemberState) => state.profile,
  dashboard: (state: MemberState) => state.dashboard,
  joinedIqubs: (state: MemberState) => state.joinedIqubs,
  availableIqubs: (state: MemberState) => state.availableIqubs,
  availableIqubsPagination: (state: MemberState) =>
    state.availableIqubsPagination,
  recentActivity: (state: MemberState) => state.recentActivity,
  achievements: (state: MemberState) => state.achievements,
  paymentHistory: (state: MemberState) => state.paymentHistory,
  error: (state: MemberState) => state.error,
  status: (state: MemberState) => state.status,
  dashboardStatus: (state: MemberState) => state.dashboardStatus,
  joinedIqubsStatus: (state: MemberState) => state.joinedIqubsStatus,
  availableIqubsStatus: (state: MemberState) => state.availableIqubsStatus,
  achievementsStatus: (state: MemberState) => state.achievementsStatus,
  paymentHistoryStatus: (state: MemberState) => state.paymentHistoryStatus,
  memberIqubDetails: (state: MemberState) => state.memberIqubDetails,
  memberIqubDetailsStatus: (state: MemberState) =>
    state.memberIqubDetailsStatus,
  paymentInitiationStatus: (state: MemberState) =>
    state.paymentInitiationStatus,
  currentPaymentTxRef: (state: MemberState) => state.currentPaymentTxRef,
  // Lottery Notification Getters
  unviewedLotteryCount: (state: MemberState) => state.unviewedLotteryCount,
  unviewedLotteries: (state: MemberState) => state.unviewedLotteries,
  selectedLotteryDetails: (state: MemberState) => state.selectedLotteryDetails,
  lotteryNotificationsStatus: (state: MemberState) =>
    state.lotteryNotificationsStatus,
  lotteryNotificationsError: (state: MemberState) =>
    state.lotteryNotificationsError,
  isLoading: (state: MemberState) =>
    state.status === "loading" ||
    state.dashboardStatus === "loading" ||
    state.joinedIqubsStatus === "loading" ||
    state.availableIqubsStatus === "loading" ||
    state.achievementsStatus === "loading" ||
    state.paymentHistoryStatus === "loading" ||
    state.memberIqubDetailsStatus === "loading" ||
    state.paymentInitiationStatus === "loading" ||
    state.lotteryNotificationsStatus === "loading",
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
