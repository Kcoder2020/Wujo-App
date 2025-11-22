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
  // Add other fields that might come from the API
  [key: string]: any;
}

interface MemberState {
  profile: MemberProfile | null;
  error: string | null;
  status: FetchStatus;
}

const state: MemberState = {
  profile: null,
  error: null,
  status: "idle",
};

const mutations = {
  setProfile(state: MemberState, profile: MemberProfile | null) {
    state.profile = profile;
  },
  setError(state: MemberState, error: string | null) {
    state.error = error;
  },
  setStatus(state: MemberState, status: FetchStatus) {
    state.status = status;
  },
};

const actions = {
  async fetchMemberProfile({ commit }: { commit: Commit }) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await apiService.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Member profile fetched:", response.data);

      if (response.data) {
        // Handle different possible response structures
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
      const serverErrorMessage = error.response?.data?.message;
      if (serverErrorMessage === "unauthorized access!") {
        console.log("Unauthorized access detected. Navigating to login.");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch member profile.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
    }
  },
};

const getters = {
  profile: (state: MemberState) => state.profile,
  error: (state: MemberState) => state.error,
  status: (state: MemberState) => state.status,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
