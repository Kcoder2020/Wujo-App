import { Module } from "vuex";
import api from "../../services/apiService"; // Adjust the path as needed
import { transformMemberPaymentData } from "../../utils/dataTransform";

interface MemberPaymentData {
  member: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    avatar?: string;
    join_date: string;
    contribution_type: "full" | "half";
    saving_rounds: number;
    has_won: boolean;
  };
  iqub: {
    id: string;
    name: string;
    total_rounds: number;
    credit_round: number;
    saving_rounds_per_credit_round: number;
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
  payment_method:
    | "mobile_money"
    | "bank_transfer"
    | "cash"
    | "manual"
    | "chapa";
  status: "success" | "pending" | "failed";
  chapa_tx_ref: string | null;
  verification_id: string | null;
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

    currentCreditRound: (state) => {
      return state.memberData?.current_credit_round || null;
    },

    contributionType: (state) => {
      return state.memberData?.member.contribution_type || "full";
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

        // Collector endpoint: requires memberId to view specific member's data
        const response = await api.get(`/members/${memberId}/iqub/${iqubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        // Transform backend data (snake_case → camelCase)
        const transformedData = transformMemberPaymentData(response.data.data);
        commit("SET_MEMBER_DATA", transformedData);
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
