# Wujo State Management (Vuex)

This document defines the structure and logic for the Vuex store, which serves as the central state management solution for the Wujo frontend application.

## 1. Store Structure (Modules)

The store will be modularized for better organization and scalability.

*   **`auth` Module:** Handles authentication state, user profile, and token management.
*   **`iqubs` Module:** Manages the list of Iqubs (both created by Collectors and joined by Members).
*   **`ui` Module:** (Optional) Manages global UI state like loading indicators, notifications, or modal visibility.

## 2. `auth` Module

*   **State:**
    *   `user: User | null = null` - Stores the logged-in user's profile data.
    *   `token: string | null = null` - Stores the authentication Bearer token.
    *   `isAuthenticated: boolean = false` - Flag indicating if a user is logged in.
    *   `status: string = 'idle'` - Loading status ('idle', 'loading', 'success', 'error').
    *   `error: string | null = null` - Stores login/signup error messages.
*   **Mutations:**
    *   `SET_USER(state, user: User | null)`: Sets the user state.
    *   `SET_TOKEN(state, token: string | null)`: Sets the token state and updates `isAuthenticated`.
    *   `SET_AUTH_STATUS(state, status: string)`: Updates the loading status.
    *   `SET_AUTH_ERROR(state, error: string | null)`: Sets the error message.
    *   `LOGOUT(state)`: Resets auth state to initial values.
*   **Actions:**
    *   `login({ commit, dispatch }, credentials: { phone, password })`: Handles the login API call. Commits status, token, user on success; commits error on failure. Persists token (e.g., localStorage).
    *   `signup({ commit, dispatch }, userData: SignupPayload)`: Handles the signup API call. Similar logic to `login`.
    *   `fetchUserProfile({ commit, state })`: Fetches the user profile using the stored token. Updates `user` state.
    *   `logout({ commit, state })`: Calls the logout API endpoint (if required), commits `LOGOUT`, removes token from storage.
    *   `initializeAuth({ commit })`: Action called on app startup to check for a stored token and potentially fetch the user profile.
*   **Getters:**
    *   `currentUser(state): User | null`: Returns the current user.
    *   `authToken(state): string | null`: Returns the auth token.
    *   `isLoggedIn(state): boolean`: Returns `isAuthenticated`.

*   **Example Action (Login):**
    ```typescript
    // src/store/modules/auth.ts (illustrative)
    import api from '@/services/api'; // Your Axios instance

    const actions = {
      async login({ commit }, credentials) {
        commit('SET_AUTH_STATUS', 'loading');
        commit('SET_AUTH_ERROR', null);
        try {
          const response = await api.post('/login', credentials);
          const { user, token } = response.data;
          commit('SET_USER', user);
          commit('SET_TOKEN', token);
          commit('SET_AUTH_STATUS', 'success');
          // Persist token (e.g., localStorage)
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return true; // Indicate success
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed.';
          commit('SET_AUTH_ERROR', message);
          commit('SET_AUTH_STATUS', 'error');
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
          return false; // Indicate failure
        }
      },
      // ... other actions
    };
    ```

## 3. `iqubs` Module

*   **State:**
    *   `myIqubs: Iqub[] = []`
    *   `joinedIqubs: Iqub[] = []`
    *   `currentIqub: Iqub | null = null` // Includes next_lottery_date now
    *   `currentIqubMembers: Member[] = []`
    *   `currentIqubLotteryWinner: User | null = null`
    *   `status: string = 'idle'`
    *   `lotteryStatus: string = 'idle'`
    *   `setDateStatus: string = 'idle'` // New status for setting the date
    *   `error: string | null = null`
    *   `lotteryError: string | null = null`
    *   `setDateError: string | null = null` // New error state for setting date
*   **Mutations:**
    *   `SET_MY_IQUBS(state, iqubs: Iqub[])`.
    *   `SET_JOINED_IQUBS(state, iqubs: Iqub[])`.
    *   `SET_CURRENT_IQUB(state, iqub: Iqub | null)` // Add mutation if not present
    *   `SET_CURRENT_IQUB_MEMBERS(state, members: Member[])` // Add mutation if not present
    *   `SET_CURRENT_IQUB_LOTTERY_WINNER(state, winner: User | null)` // New mutation
    *   `SET_IQUB_STATUS(state, status: string)`.
    *   `SET_IQUB_ERROR(state, error: string | null)`.
    *   `SET_LOTTERY_STATUS(state, status: string)` // New mutation
    *   `SET_LOTTERY_ERROR(state, error: string | null)` // New mutation
    *   `UPDATE_IQUB(state, updatedIqub: Iqub)`.
    *   `ADD_IQUB(state, iqub: Iqub)`.
    *   `SET_CURRENT_IQUB_LOTTERY_DATE(state, payload: { iqubId: number, date: string | null })` // New: Updates date within currentIqub or list
    *   `SET_SET_DATE_STATUS(state, status: string)` // New mutation
    *   `SET_SET_DATE_ERROR(state, error: string | null)` // New 
*   **Actions:**
    *   `fetchMyIqubs({ commit, rootState })`
    *   `fetchJoinedIqubs({ commit, rootState })`
    *   `createIqub({ commit, rootState }, iqubData: CreateIqubPayload)`
    *   `addMemberToIqub({ commit, rootState }, payload: { iqubId: number, phone: string })`
    *   `fetchIqubDetails({ commit, rootState }, iqubId: number)` // Action to fetch details including members (assuming API)
        *   *Responsibility: Fetch Iqub details, commit `SET_CURRENT_IQUB`, potentially fetch members separately if needed.*
    *   `initiateLottery({ commit, rootState }, payload: { iqubId: number, agentId: number })` // Action previously defined
    *   `fetchLotteryWinner({ commit, rootState }, iqubId: number)` // New action
        *   *Responsibility: Calls `GET /fetchlottery`, commits `SET_CURRENT_IQUB_LOTTERY_WINNER`, `SET_LOTTERY_STATUS`, `SET_LOTTERY_ERROR`.*
    *   `fetchLotteryWinner({ commit, rootState }, iqubId: number)`
    *   `setNextLotteryDate({ commit, rootState }, payload: { iqubId: number, date: string })` // New action
        *   *Responsibility: Calls `PATCH /api/iqubs/{iqubId}`, sending `{ next_lottery_date: date }`. Updates `currentIqub.next_lottery_date` (and potentially the list item) on success using `SET_CURRENT_IQUB_LOTTERY_DATE`. Handles status and errors using `SET_SET_DATE_STATUS` / `SET_SET_DATE_ERROR`.*
*   **Getters:**
    *   `getMyIqubsList(state): Iqub[]`.
    *   `getJoinedIqubsList(state): Iqub[]`.
    *   `getCurrentIqub(state): Iqub | null`. // Add getter
    *   `getCurrentIqubMembers(state): Member[]`. // Add getter
    *   `getCurrentIqubWinner(state): User | null`. // New getter
    *   `getCurrentIqubNextLotteryDate(state): string | null` // New getter (or access via getCurrentIqub)

## 4. Agent Instructions

*   **Create Store Files:** Set up the Vuex store with the specified module structure (`src/store/index.ts`, `src/store/modules/auth.ts`, `src/store/modules/iqubs.ts`, etc.).
*   **Implement State, Mutations, Actions, Getters:** Populate each module with the defined state properties, mutations, actions (including API calls), and getters.
*   **Type Safety:** Use the TypeScript interfaces defined in `02_data_models.md` throughout the store.
*   **Token Persistence:** Implement token storage (e.g., `localStorage`) and retrieval logic in the `auth` module's actions (`login`, `logout`, `initializeAuth`). Ensure the Axios instance's default headers are updated upon login/logout.
*   **Error Handling:** Implement robust error handling within actions, committing error messages to the state.
*   **Root State Access:** Use `rootState` within module actions to access state from other modules (e.g., getting the auth token).
*   **Implement Lottery Winner Fetch:** Add the `fetchLotteryWinner` action to the `iqubs` module. This action should call the `GET /fetchlottery` endpoint and update the `currentIqubLotteryWinner` state.
*   **Fetch Winner Data:** Determine the appropriate place to call `fetchLotteryWinner`. Options include:
    *   Calling it within `fetchIqubDetails` if the winner is relatively static per round.
    *   Calling it separately when the user explicitly requests to see the winner or upon entering the `IqubDetailPage.vue`.
    *   Triggering it after receiving a push notification indicating the lottery is complete.
*   **Implement Set Lottery Date:** Add the `setNextLotteryDate` action to the `iqubs` module. This action should call the `PATCH /iqubs/{id}` endpoint (defined in `06_api_contracts.md`) and update the `currentIqub.next_lottery_date` state on success. Add relevant status/error state and mutations.
