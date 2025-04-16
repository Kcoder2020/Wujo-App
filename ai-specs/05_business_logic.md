# Wujo Business Logic (Frontend Perspective)

This document outlines key business rules and logic that need to be implemented or enforced within the Wujo frontend application. The core ROSCA mechanics (pot distribution, cycle management) are handled by the backend API.

## 1. User Roles and Permissions

*   **Collector:**
    *   Can access "Create Iqub" functionality.
    *   Can view "My Iqubs" list.
    *   Can view member lists for their Iqubs.
    *   Can "Add Member" to their Iqubs.
    *   Can view dashboards/statistics related to their Iqubs.
    *   Cannot join Iqubs as a standard member (unless supported by the backend logic).
*   **Member (Iquber):**
    *   Can view "Joined Iqubs" list.
    *   Can view details of Iqubs they are part of.
    *   Can access functionality to *request* joining an Iqub (if implemented - current API suggests direct add by Collector).
    *   Can view their contribution status/history within an Iqub.
    *   Cannot create Iqubs or add other members.
*   **Frontend Enforcement:** The UI must conditionally render features and navigation options based on the `user.role` obtained after login (stored in `auth/user` state). Route guards in Vue Router should prevent unauthorized access to role-specific pages.

## 2. Iqub Creation Logic (Collector)

*   **Input Validation:** Enforce rules defined in `02_data_models.md` on the "Create Iqub" form:
    *   `name`: Required, non-empty.
    *   `saving_amount`, `credit_amount`: Required, positive numeric values. Format correctly before sending to API if needed.
    *   `saving_pattern`, `credit_pattern`: Required selection. Map frontend selection (e.g., "Weekly") to the numeric/string value expected by the API.
    *   `members_count`: Required, positive integer (likely > 1).
*   **API Call:** Trigger the `POST /createIqub` endpoint upon valid form submission.

## 3. Adding Members Logic (Collector)

*   **Input Validation:**
    *   `phone`: Required, must be a valid phone number format.
    *   `iqub`: Required, must be a valid ID of an Iqub managed by the Collector.
*   **Pre-checks (Optional but Recommended):**
    *   Check if the target Iqub is already full (`current_members >= members_count`). Prevent adding if full.
    *   Check if the phone number already belongs to a member in that specific Iqub. Prevent duplicates. (These checks might be handled by the backend, but client-side checks improve UX).
*   **API Call:** Trigger the `POST /addMember` endpoint.

## 4. Display Logic

*   **Iqub Progress:** Display `hosted_lottery` or `saving_rounds` information clearly (e.g., "Round 8 of 10").
*   **Amounts:** Format currency values consistently (e.g., using `Intl.NumberFormat` or a dedicated library).
*   **Patterns:** Map `saving_pattern` and `credit_pattern` values received from the API back to human-readable strings (e.g., "Weekly", "Daily"). Maintain this mapping consistently.
*   **Conditional UI:** Show relevant actions based on Iqub status (e.g., "Add Member" only available for 'active' Iqubs).

## 5. Lottery Initiation Logic (Collector)

*   **Trigger:** A collector initiates the lottery for a specific, active Iqub round.
*   **Preconditions (Frontend Check - supplement to Backend validation):**
    *   User role must be 'collector'.
    *   The specific Iqub must be in a state where initiating a lottery is permissible (e.g., 'active', round collection complete - *Exact status to be confirmed based on backend logic/Iqub data model*).
    *   A lottery for the current round/period should not have already been completed or be in progress (*Requires Iqub status/round data from API*).
    *   *(Optional - Confirm Requirement)*: The Iqub might need to have reached its target `members_count`.
*   **Action:** The frontend makes an authenticated API call to the `/initiatelottery` endpoint.
*   **Post-conditions (Handled by Backend):**
    *   Backend selects the lottery winner according to its internal rules.
    *   Backend updates the Iqub's status or round data.
    *   Backend triggers push notifications to relevant users (Collector, winner, potentially all members of that Iqub).
*   **Frontend Responsibility:**
    *   Provide a UI element (e.g., a button on the `IqubDetailPage.vue`) to trigger the action, only visible/enabled when preconditions are met.
    *   Make the API call upon user confirmation.
    *   Provide immediate feedback to the Collector (e.g., "Lottery initiated successfully. Notifications sent.") upon successful API response.
    *   Handle API errors gracefully (e.g., "Lottery could not be started at this time.").
    *   Register for and handle incoming push notifications (see `12_integrations.md`).

## 6. Set Next Lottery Date Logic (Collector)

*   **Context:** Allows a collector to schedule the date for the *next* lottery draw for an active Iqub they manage. This is distinct from *initiating* the current lottery.
*   **Trigger:** A UI element (e.g., a button or an editable date display) on the `IqubDetailPage.vue`.
*   **Preconditions:**
    *   User role must be 'collector'.
    *   The Iqub must be in a status that allows scheduling (e.g., 'active').
*   **Input:** A date selected by the user, typically via a date picker component (`IonDatetime`).
*   **Constraints (Client-Side Guidance & Backend Enforcement):**
    *   The selected date **must** be in the future.
    *   The selected date should ideally be within a reasonable timeframe after the current round's expected collection/completion (e.g., the user guidance mentions within 7 days, but the frontend might just enforce "future date"). The backend *should* perform more precise validation if it knows the round collection date.
*   **Action:** The frontend makes an authenticated API call (`PATCH /iqubs/{id}`) sending the selected date.
*   **Frontend Responsibility:**
    *   Provide a clear UI for displaying the currently set `next_lottery_date` (if any) and for triggering the date selection/update process.
    *   Use `IonDatetime` or a similar component for date selection, potentially restricting selection to future dates.
    *   Call the `setNextLotteryDate` Vuex action upon user confirmation.
    *   Provide feedback on success (e.g., "Next lottery date updated.") or failure.
    *   Update the displayed `next_lottery_date` reactively based on the Vuex state.

## 7. Agent Instructions

*   **Implement Role-Based UI:** Use `v-if` or conditional rendering based on `store.getters['auth/currentUser'].role` to show/hide UI elements and navigation links appropriate for Collectors and Members.
*   **Implement Route Guards:** Create Vue Router navigation guards (`beforeEnter`, `beforeEach`) to prevent users from accessing routes they are not authorized for based on their role and authentication status.
*   **Form Validation:** Implement client-side validation for all input forms (`Create Iqub`, `Add Member`, `Signup`, `Login`) as specified.
*   **Data Formatting:** Implement utility functions or use libraries to format currency and display pattern names correctly.
*   **Map Data:** Ensure data fetched from the API (e.g., pattern codes) is correctly mapped to user-friendly representations in the UI.
*   **Implement Lottery Trigger:** Add a UI element (e.g., button) on the Iqub detail view for collectors to initiate the lottery. Conditionally display/enable this based on Iqub status fetched from the backend and defined preconditions.
*   **Connect Lottery Action:** Wire the UI trigger to a new Vuex action (`iqubs/initiateLottery`) that calls the `GET /initiatelottery` endpoint.
*   **Handle Lottery Feedback:** Provide immediate UI feedback upon successful/failed initiation via the API response. The actual lottery *result* will be communicated via push notification.
*   **Implement Push Notifications:** Set up push notification registration and handling as specified in Task 39 & 40 (`10_agent_tasks.md`) and `12_integrations.md`.
*   **Implement Set Date UI:** Add UI elements on the `IqubDetailPage.vue` for collectors to view and set the `next_lottery_date`. Use `IonDatetime` for selection, applying future date constraints.
*   **Connect Set Date Action:** Wire the UI confirmation to the `iqubs/setNextLotteryDate` Vuex action.
*   **Display Date:** Ensure the currently set `next_lottery_date` from the Vuex store is displayed appropriately.
