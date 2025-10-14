import apiService from "../../services/apiService"; // Adjust the path as needed
import { Iqub, Member, PaymentRound } from "../../types"; // Adjust the path as needed
import { Commit } from "vuex";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface IqubState {
  iqubs: Iqub[];
  selectedIqub: Iqub | null; // Keep this for flexibility, might be used for specific fetches
  error: string | null;
  syncError: string | null; // Keep if needed
  status: FetchStatus;
  // You might add separate status/error for specific actions like addMember, initiateLottery
  // addMemberStatus: FetchStatus;
  // addMemberError: string | null;
  // initiateLotteryStatus: FetchStatus;
  // initiateLotteryError: string | null;
  iqubPaymentRounds: PaymentRound[];
  paymentRoundsStatus: string | null;
  paymentRoundsError: string | null;
  // **ADD state for Single Payment Round Details**
  selectedPaymentRoundDetails: PaymentRound | null; // Details for a specific round
  paymentRoundDetailsStatus: FetchStatus; // Status for fetching single round details
  paymentRoundDetailsError: string | null;
}

const state: IqubState = {
  iqubs: [],
  selectedIqub: null,
  error: null,
  syncError: null,
  status: "idle",
  iqubPaymentRounds: [],
  paymentRoundsStatus: "idle",
  paymentRoundsError: null,
  selectedPaymentRoundDetails: null,
  paymentRoundDetailsStatus: "idle",
  paymentRoundDetailsError: null,
};

const mutations = {
  setIqubs(state: IqubState, iqubs: Iqub[]) {
    state.iqubs = iqubs;
  },
  setSelectedIqub(state: IqubState, iqub: Iqub | null) {
    // Allow setting null
    state.selectedIqub = iqub;
  },
  setError(state: IqubState, error: string | null) {
    state.error = error;
  },
  setSyncError(state: IqubState, syncError: string | null) {
    state.syncError = syncError;
  },
  setStatus(state: IqubState, status: FetchStatus) {
    state.status = status;
  },
  // Add mutations for adding/updating members locally if API returns just success
  // This is optional and depends on how your API responses are structured
  addMemberToIqubList(
    state: IqubState,
    { iqubId, member }: { iqubId: number; member: Member }
  ) {
    const iqub = state.iqubs.find((i) => i.id === iqubId);
    if (iqub && iqub.members_list) {
      // Check if member already exists to avoid duplicates
      if (!iqub.members_list.find((m) => m.id === member.id)) {
        iqub.members_list.push(member);
        // Also increment joined_members count if you have it
        if (iqub.joined_members !== undefined && iqub.joined_members) {
          iqub.joined_members += 1;
        }
      }
    }
    // If the current selectedIqub is this one, update it too
    if (
      state.selectedIqub &&
      state.selectedIqub.id === iqubId &&
      state.selectedIqub.members_list
    ) {
      if (!state.selectedIqub.members_list.find((m) => m.id === member.id)) {
        state.selectedIqub.members_list.push(member);
        if (state.selectedIqub.joined_members !== undefined) {
          state.selectedIqub.joined_members += 1;
        }
      }
    }
  },
  // **ADD mutations for Payment Rounds**
  setIqubPaymentRounds(state: IqubState, rounds: PaymentRound[]) {
    state.iqubPaymentRounds = rounds;
  },
  setPaymentRoundsStatus(state: IqubState, status: FetchStatus) {
    state.paymentRoundsStatus = status;
  },
  setPaymentRoundsError(state: IqubState, error: string | null) {
    state.paymentRoundsError = error;
  },
  // Example mutations for lottery/date updates if API returns just success
  updateIqubLotteryWinner(
    state: IqubState,
    { iqubId, winnerName }: { iqubId: number; winnerName: string }
  ) {
    const iqub = state.iqubs.find((i) => i.id === iqubId);
    if (iqub) iqub.lottery_winner = winnerName;
    if (state.selectedIqub && state.selectedIqub.id === iqubId)
      state.selectedIqub.lottery_winner = winnerName;
  },
  updateIqubNextLotteryDate(
    state: IqubState,
    { iqubId, date }: { iqubId: number; date: string | null }
  ) {
    const iqub = state.iqubs.find((i) => i.id === iqubId);
    if (iqub) iqub.next_lottery_date = date;
    if (state.selectedIqub && state.selectedIqub.id === iqubId)
      state.selectedIqub.next_lottery_date = date;
  },
  // **ADD mutations for Single Payment Round Details**
  setSelectedPaymentRoundDetails(
    state: IqubState,
    roundDetails: PaymentRound | null
  ) {
    state.selectedPaymentRoundDetails = roundDetails;
  },
  setPaymentRoundDetailsStatus(state: IqubState, status: FetchStatus) {
    state.paymentRoundDetailsStatus = status;
  },
  setPaymentRoundDetailsError(state: IqubState, error: string | null) {
    state.paymentRoundDetailsError = error;
  },
  // Optional: Mutation to update a single round in the *list* after verification if needed for Page 12 view
  updatePaymentRoundInList(state: IqubState, updatedRound: PaymentRound) {
    const index = state.iqubPaymentRounds.findIndex(
      (r) => r.round_number === updatedRound.round_number
    ); // Assuming round_number is identifier in list
    if (index !== -1) {
      // Merge or replace the round object
      // This assumes the updatedRound object contains the necessary fields for the list view
      state.iqubPaymentRounds.splice(index, 1, updatedRound);
    }
  },
  // You might add mutations to update the check status of a specific payment round locally
  // updatePaymentRoundCheck(state: IqubState, { iqubId, roundNumber, isChecked }: { iqubId: number, roundNumber: number, isChecked: boolean }) {
  //    const round = state.iqubPaymentRounds.find(r => r.round_number === roundNumber);
  //    if (round) round.is_checked = isChecked;
  // }
};

const actions = {
  async setIqubs({ commit }: { commit: Commit }, joined_iqubs: any) {
    commit("setIqubs", joined_iqubs);
    commit("setStatus", "success");
  },
  async fetchMyIqubs({ commit }: { commit: Commit }) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await apiService.get("/myIqubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User iqubs fetched:", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        commit("setIqubs", response.data.data);
        commit("setStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for iqubs list:",
          response.data
        );
        commit("setError", "Received unexpected data format for iqubs list.");
        commit("setStatus", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch iqubs:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch iqubs.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
    }
  },

  // Keep this action. It might be needed if you need the *absolute latest* details
  // or if the list fetch doesn't provide everything the detail page needs eventually.
  // However, the primary way IqubDetailPage will get data is via the getter finding it in the list.
  async fetchIqubDetails(
    { commit }: { commit: Commit },
    iqubId: string | number
  ) {
    // This action *could* also find in the state first and only fetch if not found or stale
    // For now, let's assume it always fetches the single latest version
    commit("setSelectedIqub", null); // Clear previous selection
    commit("setStatus", "loading"); // This might conflict if list is also loading
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      const response = await apiService.get(`/iqubs/${iqubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Iqub ${iqubId} details fetched:`, response.data);
      if (response.data) {
        commit("setSelectedIqub", response.data);
        commit("setStatus", "success"); // Update status
      } else {
        console.error(
          "Unexpected API response structure for single iqub:",
          response.data
        );
        commit("setError", "Received unexpected data format for iqub details.");
        commit("setStatus", "error");
      }
    } catch (error: any) {
      console.error(`Failed to fetch iqub ${iqubId} details:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch iqub ${iqubId} details.`;
      commit("setError", errorMessage);
      commit("setStatus", "error"); // Update status on error
      throw error; // Re-throw so component can catch
    }
  },

  async createIqub(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    iqubData: any
  ) {
    commit("setStatus", "loading"); // Use main status or dedicated
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      console.log("Iqub to create -- ", iqubData);
      const response = await apiService.post("/createIqub", iqubData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Iqub created:", response.data);
      commit("setStatus", "success"); // Update status on success
      // Optionally refetch the list to include the new iqub
      dispatch("fetchMyIqubs"); // Update the list in the background
      return response.data;
    } catch (error: any) {
      console.error("Failed to create iqub:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create iqub.";
      commit("setError", errorMessage);
      commit("setStatus", "error"); // Update status on error
      throw error;
    }
  },

  async addMemberToIqub(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    { iqubId, phone }: { iqubId: number; phone: string }
  ) {
    // You might set a dedicated status for this operation
    // commit('setAddMemberStatus', 'loading');
    // commit('setAddMemberError', null);
    // Or use main status, being mindful of conflicts
    commit("setStatus", "loading");
    commit("setError", null); // Clear main error

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // Assuming API endpoint is POST /iqubs/{id}/members
      const response = await apiService.post(
        `/iqubs/${iqubId}/members`,
        { phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Member added to Iqub ${iqubId}:`, response.data);

      // Assuming API response includes the updated member list or confirmation
      // If API returns the added member, you can use a mutation to add it locally
      // commit('addMemberToIqubList', { iqubId, member: response.data.member }); // Example
      // Or, if the API response is simple, you might refetch the iqub details
      dispatch("fetchIqubDetails", iqubId); // Fetch latest details after adding member
      // commit('setAddMemberStatus', 'success');
      // If using main status:
      commit("setStatus", "success"); // Set main status to success if no fetch error

      return response.data; // Return response if component needs it
    } catch (error: any) {
      console.error(`Failed to add member to Iqub ${iqubId}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add member.";
      // commit('setAddMemberError', errorMessage);
      // commit('setAddMemberStatus', 'error');
      // If using main status:
      commit("setError", errorMessage);
      commit("setStatus", "error"); // Update main status on error
      throw error; // Re-throw so component can catch and show toast/modal error
    }
  },

  async initiateLottery(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    iqubId: number
  ) {
    // Dedicated status/error or main status
    commit("setStatus", "loading");
    commit("setError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // Assuming API endpoint is POST /iqubs/{id}/lottery/initiate
      const response = await apiService.post(
        `/iqubs/${iqubId}/lottery/initiate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Lottery initiated for Iqub ${iqubId}:`, response.data);

      // Assuming API response includes the winner or confirmation
      // If API returns winner, you can update locally
      // commit('updateIqubLotteryWinner', { iqubId, winnerName: response.data.winner });
      // Refetch iqub details to get the latest state including winner/status
      dispatch("fetchIqubDetails", iqubId);
      commit("setStatus", "success"); // Update status on success

      return response.data;
    } catch (error: any) {
      console.error(`Failed to initiate lottery for Iqub ${iqubId}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate lottery.";
      commit("setError", errorMessage);
      commit("setStatus", "error"); // Update status on error
      throw error;
    }
  },

  async setNextLotteryDate(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    { iqubId, nextLotteryDate }: { iqubId: number; nextLotteryDate: string }
  ) {
    // Dedicated status/error or main status
    commit("setStatus", "loading");
    commit("setError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // Assuming API endpoint is PUT or POST /iqubs/{id}/next-lottery-date
      const response = await apiService.put(
        `/iqubs/${iqubId}/next-lottery-date`,
        { date: nextLotteryDate },
        {
          // Use 'date' as payload key? Adjust based on API
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Next lottery date set for Iqub ${iqubId}:`, response.data);

      // Assuming API returns confirmation or updated date
      // commit('updateIqubNextLotteryDate', { iqubId, date: nextLotteryDate }); // Update locally
      // Refetch iqub details to get the latest state
      dispatch("fetchIqubDetails", iqubId);
      commit("setStatus", "success"); // Update status on success

      return response.data;
    } catch (error: any) {
      console.error(
        `Failed to set next lottery date for Iqub ${iqubId}:`,
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to set next lottery date.";
      commit("setError", errorMessage);
      commit("setStatus", "error"); // Update status on error
      throw error;
    }
  },
  // **ADD action to fetch Payment Rounds for a specific Iqub**
  async fetchIqubPaymentRounds({ commit }: { commit: Commit }, iqubId: number) {
    commit("setIqubPaymentRounds", []); // Clear previous rounds
    commit("setPaymentRoundsStatus", "loading");
    commit("setPaymentRoundsError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // **ASSUMING API ENDPOINT for rounds is GET /iqubs/{id}/rounds**
      const response = await apiService.get(`/iqubs/${iqubId}/rounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Iqub ${iqubId} payment rounds fetched:`, response.data);

      // **ASSUMING API response.data is an array of PaymentRound objects**
      if (response.data && Array.isArray(response.data)) {
        commit("setIqubPaymentRounds", response.data);
        commit("setPaymentRoundsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for payment rounds:",
          response.data
        );
        commit(
          "setPaymentRoundsError",
          "Received unexpected data format for payment rounds."
        );
        commit("setPaymentRoundsStatus", "error");
      }
    } catch (error: any) {
      console.error(`Failed to fetch iqub ${iqubId} payment rounds:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch iqub ${iqubId} payment rounds.`;
      commit("setPaymentRoundsError", errorMessage);
      commit("setPaymentRoundsStatus", "error");
    }
  },
  // **ADD action to fetch Details for a specific Payment Round (Page 13 data)**
  async fetchPaymentRoundDetails(
    { commit }: { commit: Commit },
    { iqubId, roundNumber }: { iqubId: number; roundNumber: number }
  ) {
    commit("setSelectedPaymentRoundDetails", null); // Clear previous details
    commit("setPaymentRoundDetailsStatus", "loading");
    commit("setPaymentRoundDetailsError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // **ASSUMING API ENDPOINT for round details is GET /iqubs/{iqubId}/rounds/{roundNumber}**
      const response = await apiService.get(
        `/iqubs/${iqubId}/rounds/${roundNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        `Payment round ${roundNumber} details for Iqub ${iqubId} fetched:`,
        response.data
      );

      // **ASSUMING API response.data contains the single PaymentRound object with details**
      if (response.data) {
        // Assuming response.data is the PaymentRound object with details
        commit("setSelectedPaymentRoundDetails", response.data);
        commit("setPaymentRoundDetailsStatus", "success");
      } else {
        console.error(
          "Unexpected API response structure for single payment round details:",
          response.data
        );
        commit(
          "setPaymentRoundDetailsError",
          "Received unexpected data format for single payment round details."
        );
        commit("setPaymentRoundDetailsStatus", "error");
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch payment round ${roundNumber} details for Iqub ${iqubId}:`,
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch payment round ${roundNumber} details.`;
      commit("setPaymentRoundDetailsError", errorMessage);
      commit("setPaymentRoundDetailsStatus", "error");
      throw error; // Re-throw to allow component to catch
    }
  },

  // **ADD action to Verify a payment round (corresponds to Page 13)**
  // This action might take the round ID or payment ID and the verification decision (approve/deny)
  async verifyPaymentRound(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    {
      iqubId,
      roundId,
      verificationStatus,
    }: {
      iqubId: number;
      roundId: number;
      verificationStatus: "verified" | "rejected";
    }
  ) {
    // You might use dedicated status/error for verification action
    // commit('setVerificationStatus', 'loading');
    // commit('setVerificationError', null);
    commit("setPaymentRoundsStatus", "loading"); // Or use paymentRounds status as verification updates the list

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // **ASSUMING API ENDPOINT is PUT or POST /iqubs/{iqubId}/rounds/{roundId}/verify**
      const response = await apiService.put(
        `/iqubs/${iqubId}/rounds/${roundId}/verify`,
        { status: verificationStatus },
        {
          // Adjust payload based on API
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        `Payment round ${roundId} for Iqub ${iqubId} verified as ${verificationStatus}:`,
        response.data
      );

      // Assuming API returns the updated round or confirmation
      // Option 1: Update the specific round in the store locally
      // commit('updatePaymentRoundCheck', { iqubId, roundNumber: response.data.round_number, isChecked: verificationStatus === 'verified' }); // Needs mutation
      // Option 2 (Simpler): Refetch the entire list of payment rounds for this iqub
      dispatch("fetchIqubPaymentRounds", iqubId); // Fetch latest rounds
      // commit('setVerificationStatus', 'success');
      commit("setPaymentRoundsStatus", "success"); // Set status on success

      return response.data;
    } catch (error: any) {
      console.error(
        `Failed to verify payment round ${roundId} for Iqub ${iqubId}:`,
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to verify payment round ${roundId}.`;
      // commit('setVerificationError', errorMessage);
      // commit('setVerificationStatus', 'error');
      commit("setPaymentRoundsError", errorMessage); // Set payment rounds error
      commit("setPaymentRoundsStatus", "error"); // Set payment rounds status
      throw error; // Re-throw to allow component to catch
    }
  },
};

const getters = {
  iqubs: (state: IqubState) => state.iqubs,
  selectedIqub: (state: IqubState) => state.selectedIqub,
  error: (state: IqubState) => state.error,
  syncError: (state: IqubState) => state.syncError,
  status: (state: IqubState) => state.status,
  iqubPaymentRounds: (state: IqubState) => state.iqubPaymentRounds,
  paymentRoundsStatus: (state: IqubState) => state.paymentRoundsStatus,
  paymentRoundsError: (state: IqubState) => state.paymentRoundsError,
  // **ADD getters for Single Payment Round Details**
  selectedPaymentRoundDetails: (state: IqubState) =>
    state.selectedPaymentRoundDetails,
  paymentRoundDetailsStatus: (state: IqubState) =>
    state.paymentRoundDetailsStatus,
  paymentRoundDetailsError: (state: IqubState) =>
    state.paymentRoundDetailsError,

  // --- ADD THIS GETTER FACTORY ---
  getIqubById:
    (state: IqubState) =>
    (id: number): Iqub | undefined => {
      // Finds the iqub in the state.iqubs array by its ID
      return state.iqubs.find((iqub) => iqub.id === id);
    },
  // Optional: Getters for specific action status/errors if you add them to state
  // addMemberStatus: (state: IqubState) => state.addMemberStatus,
  // addMemberError: (state: IqubState) => state.addMemberError,
  // initiateLotteryStatus: (state: IqubState) => state.initiateLotteryStatus,
  // initiateLotteryError: (state: IqubState) => state.initiateLotteryError,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
