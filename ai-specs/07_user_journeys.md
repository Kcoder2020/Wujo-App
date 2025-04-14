# Wujo User Journeys

This document outlines key user interaction flows within the Wujo application.

## 1. Onboarding Journey (First-Time User)

1.  **User Action:** Opens the app for the first time.
2.  **System Response:** Displays the multi-page onboarding carousel (`OnboardingPage.vue`).
    *   Each page shows an image and descriptive text (Welcome, Save Money, RoSCA Products, Discover).
    *   Pagination dots indicate progress.
    *   "Skip" and "Next" buttons are visible at the bottom.
3.  **User Action:** Swipes through pages or taps "Next".
4.  **System Response:** Advances to the next onboarding slide. The "Next" button triggers `swiperRef.value.slideNext()`.
5.  **User Action:** Taps "Skip" at any point.
6.  **System Response:** Navigates directly to the Signup page (`router.push('/signup')`).
7.  **User Action:** Reaches the last onboarding slide.
8.  **System Response:** "Skip" and "Next" buttons disappear. A "Get Started" button appears in the center.
9.  **User Action:** Taps "Get Started".
10. **System Response:** Navigates to the Signup page (`router.push('/signup')`).

## 2. Signup Journey (New Collector/Member)

1.  **User Action:** Accesses the Signup page (from Onboarding or Login page link).
2.  **System Response:** Displays the Signup form (`SignupPage.vue`) with fields: Full Name, Email (Optional), Gender (Radio Male/Female), Select Role (Dropdown Collector/Member), Phone (with country code prefix), Referral Code (Optional), Password, Confirm Password.
3.  **User Action:** Fills the form fields.
4.  **System Response:** Provides real-time client-side validation feedback (e.g., required fields, password match, phone format).
5.  **User Action:** Taps the "Sign Up" button.
6.  **System Response:**
    *   Performs final client-side validation.
    *   If valid, dispatches `auth/signup` Vuex action with form data.
    *   Shows a loading indicator.
7.  **System Response (on API Success):**
    *   `auth/signup` action completes, updates state (user, token).
    *   Navigates the user to the appropriate dashboard based on their selected role (`/collector/dashboard` or `/member/dashboard`).
8.  **System Response (on API Failure):**
    *   Displays an error message (e.g., "Phone number already taken", "Validation failed").
    *   Hides loading indicator.
9.  **User Action:** Taps "Already a member? Sign In" link.
10. **System Response:** Navigates to the Login page (`router.push('/login')`).

## 3. Login Journey (Existing User)

1.  **User Action:** Accesses the Login page (`LoginPage.vue`).
2.  **System Response:** Displays the Login form with fields: Phone, Password, "Remember Me" checkbox (optional), "Forgot Password" link.
3.  **User Action:** Enters Phone and Password.
4.  **System Response:** Client-side validation (required fields).
5.  **User Action:** Taps the "Sign In" button.
6.  **System Response:**
    *   Dispatches `auth/login` Vuex action with credentials.
    *   Shows a loading indicator.
7.  **System Response (on API Success):**
    *   `auth/login` action completes, updates state (user, token).
    *   Navigates the user to their role-specific dashboard.
8.  **System Response (on API Failure):**
    *   Displays an error message (e.g., "Invalid credentials").
    *   Hides loading indicator.
9.  **User Action:** Taps "Don't have Account? Sign Up" link.
10. **System Response:** Navigates to the Signup page.
11. **User Action:** Taps "Are you Collector? Sign in" link (if applicable, might be a separate login screen).
12. **System Response:** Navigates to the Collector-specific login (if different) or adjusts UI elements.

## 4. Create Iqub Journey (Collector)

1.  **User Action:** Navigates to the "Create Iqub" page (e.g., via a button on the Collector Dashboard).
2.  **System Response:** Displays the "Create Iqub" form (`CreateIqubPage.vue`) with relevant fields (Name, Saving Pattern, Saving Amount, etc.).
3.  **User Action:** Fills the form.
4.  **System Response:** Provides real-time client-side validation.
5.  **User Action:** Taps the "Confirm" or "Create" button.
6.  **System Response:**
    *   Performs final client-side validation.
    *   If valid, dispatches `iqubs/createIqub` Vuex action with form data.
    *   Shows a loading indicator.
7.  **System Response (on API Success):**
    *   `iqubs/createIqub` action completes, updates `iqubs/myIqubs` state.
    *   Shows a success message (e.g., Toast).
    *   Navigates to the "My Iqubs" list page.
8.  **System Response (on API Failure):**
    *   Displays an error message.
    *   Hides loading indicator.

## 5. View My Iqubs Journey (Collector)

1.  **User Action:** Navigates to the "My Iqubs" page.
2.  **System Response:**
    *   Component mounts, checks if `iqubs/myIqubs` state is populated.
    *   If not, dispatches `iqubs/fetchMyIqubs` action.
    *   Displays a loading indicator while fetching.
    *   Once data is in the store, renders the list of Iqubs (`MyIqubsPage.vue`), showing key details (Name, Total Collected, Hosted Lottery progress) for each.
3.  **User Action:** Taps on a specific Iqub in the list.
4.  **System Response:** Navigates to the Iqub Detail page (`IqubDetailPage.vue`), passing the Iqub ID as a route parameter. (Requires fetching detailed Iqub data, including member list).

## 6. Add Member Journey (Collector)

1.  **User Action:** Navigates to an Iqub Detail page and taps an "Add Member" button/icon.
2.  **System Response:** Displays a modal or input field (`AddMemberComponent.vue`) prompting for the member's phone number.
3.  **User Action:** Enters the phone number and confirms.
4.  **System Response:**
    *   Validates the phone number format.
    *   Dispatches `iqubs/addMemberToIqub` action with the phone number and current Iqub ID.
    *   Shows a loading indicator.
5.  **System Response (on API Success):**
    *   Shows a success message.
    *   Closes the modal/input.
    *   Refreshes the member list for the current Iqub (or updates the member count).
6.  **System Response (on API Failure):**
    *   Displays an error message (e.g., "User not found", "Member already added", "Iqub is full").
    *   Hides loading indicator.

## 7. Agent Instructions

*   **Implement Views:** Create Vue components for each major screen/page described in these journeys (e.g., `OnboardingPage.vue`, `LoginPage.vue`, `SignupPage.vue`, `CollectorDashboard.vue`, `MyIqubsPage.vue`, `CreateIqubPage.vue`, `MemberDashboard.vue`, `JoinedIqubsPage.vue`).
*   **Implement Routing:** Configure Vue Router to handle navigation between these views, including passing parameters (e.g., Iqub ID).
*   **Connect to State:** Components should interact with the Vuex store to fetch data (using getters or dispatching fetch actions) and trigger updates (dispatching actions like login, signup, createIqub).
*   **Implement Forms:** Build the required forms with appropriate input fields and validation logic.
*   **Handle Loading/Error States:** Display loading indicators during API calls and provide clear user feedback for success and error scenarios.
