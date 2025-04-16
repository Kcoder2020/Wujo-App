import apiService from "../../services/apiService"; // Adjust the path as needed
import { Iqub, Member } from "../../types"; // Adjust the path as needed
import { Commit } from "vuex";

interface IqubState {
  iqubs: Iqub[];
  selectedIqub: Iqub | null;
  loading: boolean;
  error: string | null;
  syncError: string | null;
}

const state: IqubState = {
  iqubs: [],
  selectedIqub: null,
  loading: false,
  error: null,
  syncError: null,
};

const mutations = {
  setIqubs(state: IqubState, iqubs: Iqub[]) {
    state.iqubs = iqubs;
  },
  setSelectedIqub(state: IqubState, iqub: Iqub) {
    state.selectedIqub = iqub;
  },
  setLoading(state: IqubState, loading: boolean) {
    state.loading = loading;
  },
  setError(state: IqubState, error: string | null) {
    state.error = error;
  },
  setSyncError(state: IqubState, syncError: string | null) {
    state.syncError = syncError;
  },
};

const actions = {
  async fetchIqubs({ commit }: { commit: Commit }) {
    commit("setLoading", true);
    try {
      // const response = await apiService.get('/iqubs'); // Replace with your actual API endpoint
      // commit('setIqubs', response.data);
      const mockIqubs: Iqub[] = [];
      commit("setIqubs", mockIqubs);
    } catch (error: any) {
      commit("setError", error.message || "Failed to fetch iqubs");
    } finally {
      commit("setLoading", false);
    }
  },
};

const getters = {
  iqubs: (state: IqubState) => state.iqubs,
  selectedIqub: (state: IqubState) => state.selectedIqub,
  loading: (state: IqubState) => state.loading,
  error: (state: IqubState) => state.error,
  syncError: (state: IqubState) => state.syncError,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
