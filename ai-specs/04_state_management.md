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
    *   `myIqubs: Iqub[] = []` - List of Iqubs created by the Collector.
    *   `joinedIqubs: Iqub[] = []` - List of Iqubs joined by the Member.
    *   `currentIqub: Iqub | null = null` - Currently viewed Iqub details (optional).
    *   `currentIqubMembers: Member[] = []` - Members of the currently viewed Iqub (optional).
    *   `status: string = 'idle'` - Loading status.
    *   `error: string | null = null` - Error messages related to Iqub operations.
*   **Mutations:**
    *   `SET_MY_IQUBS(state, iqubs: Iqub[])`.
    *   `SET_JOINED_IQUBS(state, iqubs: Iqub[])`.
    *   `ADD_IQUB(state, iqub: Iqub)`: Adds a newly created Iqub to the appropriate list based on user role.
    *   `SET_IQUB_STATUS(state, status: string)`.
    *   `SET_IQUB_ERROR(state, error: string | null)`.
    *   `UPDATE_IQUB(state, updatedIqub: Iqub)`: Updates an existing Iqub in the list.
*   **Actions:**
    *   `fetchMyIqubs({ commit, rootState })`: Fetches Iqubs created by the Collector. Uses `rootState.auth.token`.
    *   `fetchJoinedIqubs({ commit, rootState })`: Fetches Iqubs joined by the Member. Uses `rootState.auth.token`.
    *   `createIqub({ commit, rootState }, iqubData: CreateIqubPayload)`: Handles the create Iqub API call. Commits `ADD_IQUB` on success.
    *   `addMemberToIqub({ commit, rootState }, payload: { iqubId: number, phone: string })`: Handles adding a member. May need to refetch Iqub details or update member count locally.
*   **Getters:**
    *   `getMyIqubsList(state): Iqub[]`.
    *   `getJoinedIqubsList(state): Iqub[]`.

## 4. Agent Instructions

*   **Create Store Files:** Set up the Vuex store with the specified module structure (`src/store/index.ts`, `src/store/modules/auth.ts`, `src/store/modules/iqubs.ts`, etc.).
*   **Implement State, Mutations, Actions, Getters:** Populate each module with the defined state properties, mutations, actions (including API calls), and getters.
*   **Type Safety:** Use the TypeScript interfaces defined in `02_data_models.md` throughout the store.
*   **Token Persistence:** Implement token storage (e.g., `localStorage`) and retrieval logic in the `auth` module's actions (`login`, `logout`, `initializeAuth`). Ensure the Axios instance's default headers are updated upon login/logout.
*   **Error Handling:** Implement robust error handling within actions, committing error messages to the state.
*   **Root State Access:** Use `rootState` within module actions to access state from other modules (e.g., getting the auth token).
