import { Module } from "vuex";
import api from "../../services/apiService"; // Adjust the path as needed

interface MemberPaymentData {
  member: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    avatar?: string;
    join_date: string;
  };
  iqub: {
    id: string;
    name: string;
    total_rounds: number;
  };
  payment_stats: {
    current_round: number;
    total_paid: number;
    total_expected: number;
    completion_percentage: number;
  };
  payment_history: PaymentRecord[];
  pending_verifications: VerificationRequest[];
}

interface PaymentRecord {
  id: string;
  round_number: number;
  amount: number;
  payment_date: string;
  due_date: string;
  payment_method: "mobile_money" | "bank_transfer" | "cash" | "manual";
  status: "paid" | "pending" | "overdue" | "verified";
  verification_status?: "pending" | "verified" | "rejected" | null;
  receipt_urls?: string[];
  verification_date?: string;
  collector_notes?: string;
}

interface VerificationRequest {
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

interface MemberPaymentsState {
  memberData: MemberPaymentData | null;
  isLoading: boolean;
  error: string | null;
}

const memberPaymentsModule: Module<MemberPaymentsState, any> = {
  namespaced: true,

  state: {
    memberData: null,
    isLoading: false,
    error: null,
  },

  getters: {
    memberData: (state) => state.memberData,
    paymentHistory: (state) => state.memberData?.payment_history || [],
    pendingVerifications: (state) =>
      state.memberData?.pending_verifications || [],
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,

    completionPercentage: (state) => {
      return state.memberData?.payment_stats.completion_percentage || 0;
    },

    currentRound: (state) => {
      return state.memberData?.payment_stats.current_round || 0;
    },

    totalPaid: (state) => {
      return state.memberData?.payment_stats.total_paid || 0;
    },
  },

  mutations: {
    SET_LOADING(state, isLoading: boolean) {
      state.isLoading = isLoading;
    },

    SET_ERROR(state, error: string | null) {
      state.error = error;
    },

    SET_MEMBER_DATA(state, data: MemberPaymentData) {
      state.memberData = data;
    },

    UPDATE_VERIFICATION_STATUS(state, { verificationId, status }) {
      if (!state.memberData) return;

      const verification = state.memberData.pending_verifications.find(
        (v) => v.id === verificationId
      );

      if (verification) {
        verification.status = status;
      }
    },

    REMOVE_VERIFICATION(state, verificationId: string) {
      if (!state.memberData) return;

      state.memberData.pending_verifications =
        state.memberData.pending_verifications.filter(
          (v) => v.id !== verificationId
        );
    },

    UPDATE_PAYMENT_RECORD(state, { roundNumber, updates }) {
      if (!state.memberData) return;

      const payment = state.memberData.payment_history.find(
        (p) => p.round_number === roundNumber
      );

      if (payment) {
        Object.assign(payment, updates);
      }
    },
  },

  actions: {
    async fetchMemberPaymentDetails({ commit }, { memberId, iqubId }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await api.get(`/members/${memberId}/iqub/${iqubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        commit("SET_MEMBER_DATA", response.data.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch member payment details";
        commit("SET_ERROR", errorMessage);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async approveVerification(
      { commit },
      payload: { verification_id: string; notes?: string }
    ) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        // Optimistic update
        commit("UPDATE_VERIFICATION_STATUS", {
          verificationId: payload.verification_id,
          status: "approved",
        });

        const response = await api.post(
          `/payment-verifications/${payload.verification_id}/approve`,
          { notes: payload.notes },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Remove from pending list
        commit("REMOVE_VERIFICATION", payload.verification_id);

        return response.data;
      } catch (error: any) {
        // Revert optimistic update
        commit("UPDATE_VERIFICATION_STATUS", {
          verificationId: payload.verification_id,
          status: "pending",
        });

        const errorMessage =
          error.response?.data?.message ||
          "Failed to approve payment verification";
        commit("SET_ERROR", errorMessage);

        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async rejectVerification(
      { commit },
      payload: { verification_id: string; reason: string; notes?: string }
    ) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        // Optimistic update
        commit("UPDATE_VERIFICATION_STATUS", {
          verificationId: payload.verification_id,
          status: "rejected",
        });

        const response = await api.post(
          `/payment-verifications/${payload.verification_id}/reject`,
          {
            reason: payload.reason,
            notes: payload.notes,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Remove from pending list
        commit("REMOVE_VERIFICATION", payload.verification_id);

        return response.data;
      } catch (error: any) {
        // Revert optimistic update
        commit("UPDATE_VERIFICATION_STATUS", {
          verificationId: payload.verification_id,
          status: "pending",
        });

        const errorMessage =
          error.response?.data?.message ||
          "Failed to reject payment verification";
        commit("SET_ERROR", errorMessage);

        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};

export default memberPaymentsModule;
