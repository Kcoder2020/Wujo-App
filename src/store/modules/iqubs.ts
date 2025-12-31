import apiService from "../../services/apiService"; // Adjust the path as needed
import {
  Iqub,
  Member,
  PaymentRound,
  CreditRoundStatus,
  CollectorDashboardData,
  LotteryRecord,
  LotteryResult,
  LotteryFetchStatus,
  LotteryCreditRoundsResponse,
} from "../../types"; // Adjust the path as needed
import router from "../../router"; // Needed for navigation on unauthorized access
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
  paymentRoundsStatus: FetchStatus;
  paymentRoundsError: string | null;
  // **ADD state for Single Payment Round Details**
  selectedPaymentRoundDetails: PaymentRound | null; // Details for a specific round
  paymentRoundDetailsStatus: FetchStatus; // Status for fetching single round details
  paymentRoundDetailsError: string | null;
  // Dashboard data
  dashboardData: CollectorDashboardData | null;
  dashboardStatus: FetchStatus;
  dashboardError: string | null;
  // Credit Round Status
  creditRoundStatus: CreditRoundStatus | null;
  creditRoundStatusLoading: boolean;
  creditRoundStatusError: string | null;
  // Lottery State
  lotteryHistory: LotteryRecord[];
  lotteryHistoryStatus: LotteryFetchStatus;
  lotteryHistoryError: string | null;
  currentLotteryResult: LotteryResult | null;
  isInitiatingLottery: boolean;
  // Lottery Credit Rounds (all credit rounds for lottery view)
  lotteryCreditRounds: LotteryCreditRoundsResponse | null;
  lotteryCreditRoundsStatus: FetchStatus;
  lotteryCreditRoundsError: string | null;
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
  dashboardData: null,
  dashboardStatus: "idle",
  dashboardError: null,
  creditRoundStatus: null,
  creditRoundStatusLoading: false,
  creditRoundStatusError: null,
  // Lottery State
  lotteryHistory: [],
  lotteryHistoryStatus: "idle",
  lotteryHistoryError: null,
  currentLotteryResult: null,
  isInitiatingLottery: false,
  // Lottery Credit Rounds (all credit rounds for lottery view)
  lotteryCreditRounds: null,
  lotteryCreditRoundsStatus: "idle",
  lotteryCreditRoundsError: null,
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
  // updatePaymentRoundCheck(state: IqubState, { iqubId, roundNumber, isChecked }: { iqubId, number, roundNumber: number, isChecked: boolean }) {
  //    const round = state.iqubPaymentRounds.find(r => r.round_number === roundNumber);
  //    if (round) round.is_checked = isChecked;
  // }
  // Dashboard mutations
  setDashboardData(state: IqubState, data: CollectorDashboardData) {
    state.dashboardData = data;
  },
  setDashboardStatus(state: IqubState, status: FetchStatus) {
    state.dashboardStatus = status;
  },
  setDashboardError(state: IqubState, error: string | null) {
    state.dashboardError = error;
  },
  updateMonthlyCollections(state: IqubState, monthlyCollections: any) {
    if (state.dashboardData) {
      state.dashboardData.monthly_collections = monthlyCollections;
    }
  },
  // Credit Round Status mutations
  setCreditRoundStatus(state: IqubState, status: CreditRoundStatus | null) {
    state.creditRoundStatus = status;
  },
  setCreditRoundStatusLoading(state: IqubState, loading: boolean) {
    state.creditRoundStatusLoading = loading;
  },
  setCreditRoundStatusError(state: IqubState, error: string | null) {
    state.creditRoundStatusError = error;
  },
  clearCreditRoundStatus(state: IqubState) {
    state.creditRoundStatus = null;
    state.creditRoundStatusLoading = false;
    state.creditRoundStatusError = null;
  },
  // Lottery Mutations
  setLotteryHistory(state: IqubState, history: LotteryRecord[]) {
    state.lotteryHistory = history;
  },
  setLotteryHistoryStatus(state: IqubState, status: LotteryFetchStatus) {
    state.lotteryHistoryStatus = status;
  },
  setLotteryHistoryError(state: IqubState, error: string | null) {
    state.lotteryHistoryError = error;
  },
  setCurrentLotteryResult(state: IqubState, result: LotteryResult | null) {
    state.currentLotteryResult = result;
  },
  setIsInitiatingLottery(state: IqubState, isInitiating: boolean) {
    state.isInitiatingLottery = isInitiating;
  },
  clearLotteryState(state: IqubState) {
    state.lotteryHistory = [];
    state.lotteryHistoryStatus = "idle";
    state.lotteryHistoryError = null;
    state.currentLotteryResult = null;
    state.isInitiatingLottery = false;
  },
  // Lottery Credit Rounds Mutations
  setLotteryCreditRounds(
    state: IqubState,
    data: LotteryCreditRoundsResponse | null
  ) {
    state.lotteryCreditRounds = data;
  },
  setLotteryCreditRoundsStatus(state: IqubState, status: FetchStatus) {
    state.lotteryCreditRoundsStatus = status;
  },
  setLotteryCreditRoundsError(state: IqubState, error: string | null) {
    state.lotteryCreditRoundsError = error;
  },
  clearLotteryCreditRounds(state: IqubState) {
    state.lotteryCreditRounds = null;
    state.lotteryCreditRoundsStatus = "idle";
    state.lotteryCreditRoundsError = null;
  },
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
        console.log("Collector Iqubs ", response.data.data);
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
    { commit, state }: { commit: Commit; state: IqubState },
    iqubId: string | number
  ) {
    // This action fetches the latest version and updates both selectedIqub and the iqubs array
    commit("setSelectedIqub", null); // Clear previous selection
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      const response = await apiService.get(`/iqubs/${iqubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Iqub ${iqubId} details fetched:`, response.data);
      if (response.data && response.data.data) {
        const fetchedIqub = response.data.data;

        // Update selectedIqub
        commit("setSelectedIqub", fetchedIqub);

        // Also update the iqub in the iqubs array if it exists
        const iqubIndex = state.iqubs.findIndex((iqub) => iqub.id == iqubId);
        if (iqubIndex !== -1) {
          // Update existing iqub in the array
          const updatedIqubs = [...state.iqubs];
          updatedIqubs[iqubIndex] = fetchedIqub;
          commit("setIqubs", updatedIqubs);
          console.log(`Updated Iqub ${iqubId} in iqubs array`);
        } else {
          // Iqub not in array, add it
          commit("setIqubs", [...state.iqubs, fetchedIqub]);
          console.log(`Added Iqub ${iqubId} to iqubs array`);
        }

        commit("setStatus", "success");
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
      commit("setStatus", "error");
      throw error;
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
    {
      iqubId,
      phone,
      contributionType = "full",
    }: { iqubId: number; phone: string; contributionType?: "full" | "half" }
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
        { phone, contributionType },
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
    { commit }: { commit: Commit },
    {
      iqubId,
      creditRoundNumber,
    }: { iqubId: string | number; creditRoundNumber: number }
  ) {
    // Note: We intentionally do NOT dispatch fetchIqubDetails or fetchLotteryCreditRounds here
    // to avoid causing parent component re-renders during the lottery animation.
    // The parent should refresh data when the lottery modal closes.

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      // API endpoint is POST /iqubs/{id}/lottery/initiate with credit_round_number in body
      const response = await apiService.post(
        `/iqubs/${iqubId}/lottery/initiate`,
        { credit_round_number: creditRoundNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        `Lottery initiated for Iqub ${iqubId}, Credit Round ${creditRoundNumber}:`,
        response.data
      );

      return response.data;
    } catch (error: any) {
      console.error(`Failed to initiate lottery for Iqub ${iqubId}:`, error);
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

  async fetchMemberIqubs({ commit }: { commit: Commit }) {
    commit("setStatus", "loading");
    commit("setError", null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await apiService.get("/joinedIqubs", {
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
      const serverErrorMessage = error.response?.data?.message;
      if (serverErrorMessage === "unauthorized access!") {
        console.log("Unauthorized access detected. Navigating to login.");
        // 2. Clear token to force a full re-auth flow
        localStorage.removeItem("token");
        // 3. Use the imported router to navigate
        // Replace 'Login' with the actual name or path of your login route
        router.push("/login");
        // Stop further error processing since we are redirecting
        return;
      }
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch iqubs.";
      commit("setError", errorMessage);
      commit("setStatus", "error");
    }
  },

  // **ADD action to fetch Credit Round Status**
  async fetchCreditRoundStatus(
    { commit }: { commit: Commit },
    iqubId: string | number
  ) {
    commit("setCreditRoundStatusLoading", true);
    commit("setCreditRoundStatusError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await apiService.get(
        `/iqubs/${iqubId}/credit-round-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        `Credit round status for Iqub ${iqubId} fetched:`,
        response.data
      );

      if (response.data && response.data.success) {
        commit("setCreditRoundStatus", response.data.data);
        commit("setCreditRoundStatusLoading", false);
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch credit round status for Iqub ${iqubId}:`,
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch credit round status";
      commit("setCreditRoundStatusError", errorMessage);
      commit("setCreditRoundStatusLoading", false);
      throw error;
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

  // **Dashboard Actions**
  async fetchCollectorDashboard({ commit }: { commit: Commit }) {
    commit("setDashboardStatus", "loading");
    commit("setDashboardError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await apiService.get("/collector/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Collector dashboard data fetched:", response.data);

      // Backend wraps response in "data" property
      if (response.data && response.data.data && response.data.data.overview) {
        commit("setDashboardData", response.data.data);
        commit("setDashboardStatus", "success");
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error("Failed to fetch collector dashboard:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data";
      commit("setDashboardError", errorMessage);
      commit("setDashboardStatus", "error");
      throw error;
    }
  },

  async fetchMonthlyCollections(
    { commit, state }: { commit: Commit; state: IqubState },
    period: "1month" | "3months" | "6months"
  ) {
    commit("setDashboardStatus", "loading");
    commit("setDashboardError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      // Backend supports period query parameter
      const response = await apiService.get(
        `/collector/dashboard?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Dashboard data for ${period} fetched:`, response.data);

      // Backend wraps response in "data" property
      if (response.data && response.data.data && response.data.data.overview) {
        commit("setDashboardData", response.data.data);
        commit("setDashboardStatus", "success");
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error(`Failed to fetch dashboard for ${period}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data";
      commit("setDashboardError", errorMessage);
      commit("setDashboardStatus", "error");
      throw error;
    }
  },

  // Lottery Actions
  async fetchLotteryHistory(
    { commit }: { commit: Commit },
    iqubId: string | number
  ) {
    commit("setLotteryHistoryStatus", "loading");
    commit("setLotteryHistoryError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await apiService.get(
        `/iqubs/${iqubId}/lottery/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Lottery history for Iqub ${iqubId} fetched:`, response.data);

      if (response.data && response.data.success) {
        commit("setLotteryHistory", response.data.data || []);
        commit("setLotteryHistoryStatus", "success");
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch lottery history for Iqub ${iqubId}:`,
        error
      );

      // Handle 404 gracefully - endpoint may not exist yet
      if (error.response?.status === 404) {
        console.warn(
          "Lottery history endpoint not implemented yet, using empty array"
        );
        commit("setLotteryHistory", []);
        commit("setLotteryHistoryStatus", "success");
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lottery history";
      commit("setLotteryHistoryError", errorMessage);
      commit("setLotteryHistoryStatus", "error");
      throw error;
    }
  },

  async initiateLotteryWithSpin(
    { commit, dispatch }: { commit: Commit; dispatch: any },
    {
      iqubId,
      creditRoundNumber,
    }: { iqubId: string | number; creditRoundNumber: number }
  ) {
    commit("setIsInitiatingLottery", true);
    commit("setCurrentLotteryResult", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await apiService.post(
        `/iqubs/${iqubId}/lottery/initiate`,
        { credit_round_number: creditRoundNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`Lottery initiated for Iqub ${iqubId}:`, response.data);

      if (response.data && response.data.success) {
        const result = {
          success: true,
          winner: response.data.data.winner || response.data.data.winners?.[0],
          lottery_id: response.data.data.lottery_id,
        };
        commit("setCurrentLotteryResult", result);
        commit("setIsInitiatingLottery", false);

        // Refresh credit round status after lottery
        dispatch("fetchCreditRoundStatus", iqubId);
        // Refresh lottery history
        dispatch("fetchLotteryHistory", iqubId);
        // Refresh lottery credit rounds
        dispatch("fetchLotteryCreditRounds", iqubId);

        return response.data;
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error(`Failed to initiate lottery for Iqub ${iqubId}:`, error);
      commit("setIsInitiatingLottery", false);
      throw error;
    }
  },

  // Fetch all credit rounds for lottery view
  async fetchLotteryCreditRounds(
    { commit }: { commit: Commit },
    iqubId: string | number
  ) {
    commit("setLotteryCreditRoundsStatus", "loading");
    commit("setLotteryCreditRoundsError", null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await apiService.get(
        `/iqubs/${iqubId}/lottery/credit-rounds`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        `Lottery credit rounds for Iqub ${iqubId} fetched:`,
        response.data
      );

      if (response.data && response.data.success) {
        commit("setLotteryCreditRounds", response.data.data);
        commit("setLotteryCreditRoundsStatus", "success");
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error: any) {
      console.error(
        `Failed to fetch lottery credit rounds for Iqub ${iqubId}:`,
        error
      );

      // Handle 404 gracefully - endpoint may not exist yet
      if (error.response?.status === 404) {
        console.warn("Lottery credit rounds endpoint not implemented yet");
        commit("setLotteryCreditRounds", null);
        commit("setLotteryCreditRoundsStatus", "success");
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lottery credit rounds";
      commit("setLotteryCreditRoundsError", errorMessage);
      commit("setLotteryCreditRoundsStatus", "error");
      throw error;
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
    (id: number | string): Iqub | undefined => {
      // Finds the iqub in the state.iqubs array by its ID
      // Handle both string and number IDs for MongoDB ObjectId compatibility
      return state.iqubs.find((iqub) => iqub.id == id); // Use == for loose equality
    },
  // Optional: Getters for specific action status/errors if you add them to state
  // addMemberStatus: (state: IqubState) => state.addMemberStatus,
  // addMemberError: (state: IqubState) => state.addMemberError,
  // initiateLotteryStatus: (state: IqubState) => state.initiateLotteryStatus,
  // initiateLotteryError: (state: IqubState) => state.initiateLotteryError,

  // **ADD getters for Credit Round Status**
  creditRoundStatus: (state: IqubState) => state.creditRoundStatus,
  creditRoundStatusLoading: (state: IqubState) =>
    state.creditRoundStatusLoading,
  creditRoundStatusError: (state: IqubState) => state.creditRoundStatusError,

  // **Dashboard getters**
  dashboardData: (state: IqubState) => state.dashboardData,
  dashboardStatus: (state: IqubState) => state.dashboardStatus,
  dashboardError: (state: IqubState) => state.dashboardError,
  dashboardOverview: (state: IqubState) => state.dashboardData?.overview,
  dashboardActivities: (state: IqubState) =>
    state.dashboardData?.recent_activities || [],
  dashboardMonthlyCollections: (state: IqubState) =>
    state.dashboardData?.monthly_collections?.data || [],

  // **Lottery getters**
  lotteryHistory: (state: IqubState) => state.lotteryHistory,
  lotteryHistoryStatus: (state: IqubState) => state.lotteryHistoryStatus,
  lotteryHistoryError: (state: IqubState) => state.lotteryHistoryError,
  currentLotteryResult: (state: IqubState) => state.currentLotteryResult,
  isInitiatingLottery: (state: IqubState) => state.isInitiatingLottery,
  // Lottery Credit Rounds getters
  lotteryCreditRounds: (state: IqubState) => state.lotteryCreditRounds,
  lotteryCreditRoundsStatus: (state: IqubState) =>
    state.lotteryCreditRoundsStatus,
  lotteryCreditRoundsError: (state: IqubState) =>
    state.lotteryCreditRoundsError,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
