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

## 5. Agent Instructions

*   **Implement Role-Based UI:** Use `v-if` or conditional rendering based on `store.getters['auth/currentUser'].role` to show/hide UI elements and navigation links appropriate for Collectors and Members.
*   **Implement Route Guards:** Create Vue Router navigation guards (`beforeEnter`, `beforeEach`) to prevent users from accessing routes they are not authorized for based on their role and authentication status.
*   **Form Validation:** Implement client-side validation for all input forms (`Create Iqub`, `Add Member`, `Signup`, `Login`) as specified.
*   **Data Formatting:** Implement utility functions or use libraries to format currency and display pattern names correctly.
*   **Map Data:** Ensure data fetched from the API (e.g., pattern codes) is correctly mapped to user-friendly representations in the UI.
