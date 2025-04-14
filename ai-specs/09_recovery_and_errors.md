# Wujo Recovery and Error Handling

This document outlines strategies for handling errors, network issues, and potential data synchronization problems in the Wujo frontend.

## 1. API Error Handling

*   **Mechanism:** Use `try...catch` blocks in Vuex actions or API service functions that make Axios requests.
*   **Error Parsing:** Inspect the Axios error object (`error.response`). Extract meaningful error messages from the backend response body (e.g., `error.response.data.message`, `error.response.data.errors`). If no specific message is available, provide a generic error message (e.g., "An unexpected error occurred.").
*   **State Update:** Commit error messages to the relevant Vuex module's `error` state (e.g., `auth/SET_AUTH_ERROR`, `iqubs/SET_IQUB_ERROR`). Also, update the `status` state to 'error'.
*   **User Feedback:** Display user-friendly error messages in the UI. Use components like `IonToast`, `IonAlert`, or dedicated error display areas within forms. Avoid showing raw technical error details to the user.
*   **Specific Errors:** Handle specific HTTP status codes:
    *   **401 Unauthorized:** The user's token is invalid or expired. Automatically log the user out (`dispatch('auth/logout')`) and redirect to the Login page.
    *   **403 Forbidden:** The user is authenticated but lacks permission for the action. Display an appropriate "Access Denied" message.
    *   **404 Not Found:** The requested resource (e.g., Iqub, User) doesn't exist. Display a "Not Found" message.
    *   **422 Unprocessable Entity / 400 Bad Request:** Validation errors occurred. Display field-specific errors if provided by the backend; otherwise, show a general validation error message.
    *   **5xx Server Error:** Display a generic "Server error, please try again later" message.

*   **Example (Vuex Action):**
    ```typescript
    async fetchMyIqubs({ commit, rootState }) {
      commit('SET_IQUB_STATUS', 'loading');
      commit('SET_IQUB_ERROR', null);
      try {
        // Assuming apiService handles token automatically via interceptor
        const response = await apiService.get('/myIqubs');
        commit('SET_MY_IQUBS', response.data);
        commit('SET_IQUB_STATUS', 'success');
      } catch (error: any) {
        let message = 'Failed to fetch Iqubs.';
        if (error.response) {
          console.error('API Error:', error.response.data);
          message = error.response.data.message || message;
          if (error.response.status === 401) {
             // Dispatch logout action - handle globally via Axios interceptor preferable
          }
        } else {
          console.error('Network/Request Error:', error.message);
          message = 'Network error. Please check your connection.';
        }
        commit('SET_IQUB_ERROR', message);
        commit('SET_IQUB_STATUS', 'error');
      }
    }
    ```

## 2. Network Connectivity Issues

*   **Detection:** Use Capacitor's Network plugin (`@capacitor/network`) to detect changes in network status (online/offline).
    ```typescript
    import { Network } from '@capacitor/network';

    // Listen for status changes
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      // Update UI or state based on status.connected
    });

    // Get current status
    const status = await Network.getStatus();
    ```
*   **User Feedback:** Inform the user when the network connection is lost. Display a persistent banner or indicator. Disable UI elements that require network connectivity (e.g., submit buttons).
*   **Offline Mode (Basic):**
    *   Cache essential, non-sensitive data (e.g., user profile, fetched Iqub lists) in Vuex state. Data will persist until the app is fully closed.
    *   For more robust offline support, consider using `localStorage` or Capacitor's Storage plugin (`@capacitor/storage`) to persist fetched data.
    *   Clearly indicate when the user is viewing cached/offline data.
*   **Offline Actions (Advanced - Requires Backend Support):** Implementing functionality to perform actions offline (e.g., queueing an "Add Member" request) requires significant complexity, including background sync mechanisms and conflict resolution, likely needing backend support. *Scope this out unless explicitly required.*

## 3. Request Retries

*   **Strategy:** For transient network errors or specific server errors (e.g., 503 Service Unavailable), implement a retry mechanism.
*   **Implementation:** Use libraries like `axios-retry` or implement custom logic within the API service. Configure a limited number of retries with exponential backoff (increasing delays between retries).
*   **User Feedback:** Inform the user if retries are occurring (e.g., "Trying to reconnect...").

## 4. Data Synchronization and Conflicts

*   **Primary Source of Truth:** The backend API is the single source of truth.
*   **Frontend Strategy:** Fetch fresh data when necessary (e.g., on page load, after performing an update action). Avoid relying solely on cached data for critical operations.
*   **Real-time Updates (If Available):** Use real-time events to keep the frontend state synchronized with the backend, reducing the chances of stale data.
*   **Conflict Resolution:** Conflicts (e.g., two users trying to modify the same resource simultaneously) should ideally be handled by the backend. The frontend should display errors returned by the backend in case of conflicts.

## 5. Agent Instructions

*   **Implement Global Error Handling:** Use Axios interceptors to centrally handle common errors like 401 (trigger logout) and potentially log errors.
*   **Implement Action-Level Error Handling:** Ensure all Vuex actions making API calls have `try...catch` blocks to handle specific errors, update state (status, error message), and provide appropriate feedback.
*   **Display Errors:** Create reusable UI components (e.g., `ErrorMessage.vue`) or use Ionic components (`IonToast`, `IonAlert`) to display errors to the user based on the error state in Vuex modules.
*   **Integrate Network Plugin:** Add the Capacitor Network plugin to detect online/offline status and provide user feedback. Implement basic caching in Vuex for viewing data offline.
*   **Implement Retries (Optional):** If required, integrate `axios-retry` or build a custom retry mechanism for specific API calls prone to transient failures.
