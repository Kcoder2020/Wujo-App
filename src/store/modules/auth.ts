import axios from "@/services/apiService"; // Use the configured axios instance
import { Commit } from "vuex";
import { User } from "@/types"; // Assuming User type is defined here

interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

// --- Helper: Generate a simple mock token ---
const generateMockToken = (userId: string): string => {
  return `mock_alpha_token_${userId}_${Date.now()}`;
};

// --- Helper: Construct User from Signup Data ---
// Ensures the created user object has a structure similar to the backend response
const createUserFromSignupData = (userData: any): User => {
  // Basic structure, adjust based on your actual User type definition in @/types
  return {
    id: `alpha_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Generate a unique-ish local ID
    name: userData.name,
    email: userData.email || null, // Include email if provided
    phone: userData.phone,
    role: userData.role,
    gender: userData.gender,
    // Add any other default fields expected in your User type
    // e.g., profile_picture_url: null, email_verified_at: null, etc.
  };
};

const state: AuthState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  status: "idle",
  error: null,
};

const getters = {
  isLoggedIn: (state: AuthState): boolean => !!state.token,
  getUser: (state: AuthState): User | null => state.user,
  getAuthStatus: (state: AuthState): string => state.status,
  getAuthError: (state: AuthState): string | null => state.error,
};

const actions = {
  async login({ commit }: { commit: Commit }, credentials: any) {
    commit("SET_STATUS", "loading");
    commit("SET_ERROR", null);
    try {
      // Use the configured axios instance from apiService.ts
      const response = await axios.post("/login", credentials);
      console.log("Login response:", response.data); // Debugging
      commit("SET_TOKEN", response.data.data.token);
      // commit("SET_USER", response.data.user);
      commit("SET_STATUS", "success"); // Changed from succeeded
      return response.data.user;
    } catch (error: any) {
      console.error("Login error:", error.response || error); // Debugging
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      commit("SET_ERROR", message);
      commit("SET_STATUS", "error");
      throw error; // Re-throw the error for the component to handle
    }
  },

  async signup({ commit }: { commit: Commit }, userData: any) {
    commit("SET_STATUS", "loading");
    commit("SET_ERROR", null);

    // --- Alpha Mode Bypass ---
    // Set VUE_APP_ALPHA_MODE=true in your .env file for alpha testing
    if (process.env.VUE_APP_ALPHA_MODE === "true") {
      console.warn("ALPHA MODE: Simulating signup locally.");
      try {
        // Simulate API delay (optional)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create a user object based on form data
        const simulatedUser = createUserFromSignupData(userData);

        // Generate a mock token
        const mockToken = generateMockToken(simulatedUser.id);

        // Commit mutations as if login was successful
        commit("SET_USER", simulatedUser);
        commit("SET_TOKEN", mockToken);
        commit("SET_STATUS", "success"); // Use 'success' status

        console.log("ALPHA MODE: Simulated user:", simulatedUser);
        return simulatedUser; // Return the simulated user data
      } catch (error) {
        console.error("ALPHA MODE: Error during simulated signup:", error);
        commit("SET_ERROR", "Failed to simulate signup.");
        commit("SET_STATUS", "error");
        throw error; // Re-throw error
      }
    } else {
      // --- Standard Production Signup ---
      try {
        console.log("Attempting real signup with data:", userData); // Debugging
        const response = await axios.post("/signup", userData);
        console.log("Signup API response:", response.data); // Debugging

        // Assuming the API returns user and token directly upon successful signup response.data.user &&
        if (response.data.data.token) {
          // commit("SET_USER", response.data.user);
          commit("SET_TOKEN", response.data.data.token);
          commit("SET_STATUS", "success"); // Use 'success' status
          return response.data.data; // Return the user data
        } else {
          // Handle cases where the API might return 2xx but not the expected data
          console.error(
            "Signup response missing user or token:",
            response.data
          );
          commit(
            "SET_ERROR",
            "Signup completed but received unexpected data from server."
          );
          commit("SET_STATUS", "error");
          throw new Error("Signup response missing user or token.");
        }
      } catch (error: any) {
        console.error("Signup error:", error.response || error); // Debugging
        const message =
          error.response?.data?.message ||
          "Signup failed. Please check your details and try again.";
        commit("SET_ERROR", message);
        commit("SET_STATUS", "error");
        throw error; // Re-throw the error for the component to handle
      }
    }
  },

  logout({ commit }: { commit: Commit }) {
    commit("SET_TOKEN", null);
    commit("SET_USER", null);
    commit("SET_STATUS", "idle");
    commit("SET_ERROR", null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // No API call needed for local logout, just clear state
  },

  // Action to potentially fetch user data if only token is present (e.g., on page refresh)
  // This might be needed depending on how session persistence is handled
  async fetchUser({ commit, state }: { commit: Commit; state: AuthState }) {
    if (state.token && !state.user) {
      commit("SET_STATUS", "loading");
      try {
        // Assuming you have an endpoint like /me or /user to get current user data
        const response = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${state.token}`, // Include the token in the Authorization header
          },
        }); // Adjust endpoint if needed
        console.log("user object from backend ", response.data);
        let replaceuser = null;
        if (response.data.data && response.data.data.id === 21) {
          replaceuser = response.data.data;
          const joined_iqubs = [
            {
              id: 1, // Assuming this Iqub also has ID 1, adjust if needed
              name: "Damay Single Member Iqub",
              total_collected: 520000.0,
              hosted_lottery: 5,
              iqub_id: "WJ5597201",
              saving_amount: 1000, // Updated from 100
              saving_pattern: 1,
              credit_amount: 100000.0, // Updated from 105000.00
              credit_pattern: 105, // Updated from 1
              members_count: 5, // Updated from 1
              joined_members: 5, // Updated from 1
              members_list: [
                {
                  id: 1, // Member ID
                  name: "Roman Dado",
                  phone: "+251911740430",
                  rounds_completed: 104,
                  saving_rounds: 104,
                },
                {
                  id: 2, // Member ID
                  name: "Yohans Betre",
                  phone: "+251923624840",
                  rounds_completed: 104,
                  saving_rounds: 105,
                },
                {
                  id: 3, // Member ID
                  name: "Amanuel Zewdu",
                  phone: "+251915581888",
                  rounds_completed: 104,
                  saving_rounds: 105,
                },
                {
                  id: 4, // Member ID
                  name: "Ruhama Sahilu",
                  phone: "+251912439493",
                  rounds_completed: 105,
                  saving_rounds: 104,
                },
                {
                  id: 5, // Member ID
                  name: "Alemseged Yimam",
                  phone: "+251969473359",
                  rounds_completed: 104,
                  saving_rounds: 104,
                },
              ],
            },
          ];
          replaceuser = {
            ...replaceuser,
            joined_iqubs: joined_iqubs,
          };
          commit("SET_USER", replaceuser);
        } else {
          commit("SET_USER", response.data.data);
        }
        commit("SET_STATUS", "success"); // Changed from succeeded
      } catch (error: any) {
        console.error("Error fetching user:", error.response || error);
        // If fetching user fails (e.g., invalid token), log them out
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
        commit("SET_STATUS", "error");
        commit("SET_ERROR", "Session expired or invalid. Please log in again.");
      }
    }
  },
};

const mutations = {
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token;
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  },
  SET_USER(state: AuthState, user: User | null) {
    state.user = user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
  SET_STATUS(
    state: AuthState,
    status: "idle" | "loading" | "success" | "error"
  ) {
    // Updated statuses
    state.status = status;
  },
  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
