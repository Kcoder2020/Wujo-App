import apiService from "../../services/apiService";
import { Commit } from "vuex";
import router from "../../router";

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
  error: string | null;
  status: FetchStatus;
  dashboardStatus: FetchStatus;
  joinedIqubsStatus: FetchStatus;
  availableIqubsStatus: FetchStatus;
  achievementsStatus: FetchStatus;
  paymentHistoryStatus: FetchStatus;
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
  error: null,
  status: "idle",
  dashboardStatus: "idle",
  joinedIqubsStatus: "idle",
  availableIqubsStatus: "idle",
  achievementsStatus: "idle",
  paymentHistoryStatus: "idle",
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
  async fetchMemberProfile({ commit }: { commit: Commit }) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/profile", { headers })
      );
      console.log("Member profile fetched:", response.data);

      if (response.data) {
        const profileData = response.data.data || response.data;
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

  async fetchMemberDashboard({ commit }: { commit: Commit }) {
    commit("setDashboardStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/dashboard", { headers })
      );
      console.log("Member dashboard fetched:", response.data);

      if (response.data) {
        const dashboardData = response.data.data || response.data;
        commit("setDashboard", dashboardData);

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

  async fetchJoinedIqubs({ commit }: { commit: Commit }) {
    commit("setJoinedIqubsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/joinedIqubs", { headers })
      );
      console.log("Joined Iqubs fetched:", response.data);

      if (response.data) {
        const iqubsData =
          response.data.data || response.data.iqubs || response.data;
        const iqubs = Array.isArray(iqubsData) ? iqubsData : [];
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
      console.log("Available Iqubs fetched:", response.data);

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
      console.log("Successfully joined Iqub:", response.data);

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
      console.log("Profile updated successfully:", response.data);

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

  async fetchAchievements({ commit }: { commit: Commit }) {
    commit("setAchievementsStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/achievements", { headers })
      );
      console.log("Achievements fetched:", response.data);

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

  async fetchPaymentHistory({ commit }: { commit: Commit }) {
    commit("setPaymentHistoryStatus", "loading");
    commit("setError", null);
    try {
      const headers = getAuthHeaders();
      const response = await retryApiCall(() =>
        apiService.get("/member/payment-history", { headers })
      );
      console.log("Payment history fetched:", response.data);

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
  isLoading: (state: MemberState) =>
    state.status === "loading" ||
    state.dashboardStatus === "loading" ||
    state.joinedIqubsStatus === "loading" ||
    state.availableIqubsStatus === "loading" ||
    state.achievementsStatus === "loading" ||
    state.paymentHistoryStatus === "loading",
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
