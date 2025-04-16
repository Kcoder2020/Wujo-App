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

## 7. Initiate Lottery Journey (Collector)

1.  **User Action:** Collector navigates to the `IqubDetailPage.vue` for an active Iqub they manage.
2.  **System Response:** Displays Iqub details (members, status, current round info, etc.). If preconditions are met (Iqub status allows lottery, current round needs a winner - see `05_business_logic.md`), an "Initiate Lottery" button is visible and enabled.
3.  **User Action:** Taps the "Initiate Lottery" button.
4.  **System Response:** (Optional) Shows a confirmation modal ("Are you sure you want to start the lottery for this round?").
5.  **User Action:** Confirms the action.
6.  **System Response:**
    *   Dispatches `iqubs/initiateLottery` Vuex action, passing the `iqubId` and the Collector's user ID (`agent_id`).
    *   Shows a loading indicator.
7.  **System Response (on API Success):**
    *   Hides loading indicator.
    *   Shows a success message (e.g., "Lottery started! Winner will be notified via push notification.").
    *   (Optional) Updates the UI on the `IqubDetailPage.vue` to reflect that the lottery is in progress or completed for the round (e.g., disable the "Initiate Lottery" button, show a status update). The primary notification of the *winner* comes via push notification.
8.  **System Response (on API Failure):**
    *   Hides loading indicator.
    *   Displays an informative error message (e.g., "Lottery could not be started: Round already complete.").

## 8. Receiving Lottery Result Journey (Member/Collector via Push Notification)

1.  **System Action:** Backend successfully processes the lottery and sends push notifications via FCM/APNS.
2.  **System Response (App in Background/Closed):** User's device displays a standard push notification (e.g., "Congratulations! You won the lottery for Iqub '[Iqub Name]'!" or "Lottery results for Iqub '[Iqub Name]' are in.").
3.  **User Action:** Taps the notification.
4.  **System Response:** Opens the Wujo app, potentially navigating to the relevant `IqubDetailPage.vue` or a dedicated notifications screen.
5.  **System Response (App in Foreground):**
    *   The app's push notification listener receives the notification payload.
    *   Displays an in-app notification (e.g., `IonToast` or a custom banner) with the lottery result information.
    *   (Optional) Updates relevant state in Vuex (e.g., marking a notification as read, potentially updating Iqub status if payload contains sufficient info, though relying on fetching fresh data upon navigation is often safer).


## 9. View Lottery Winner Journey (Collector/Member)

1.  **Prerequisite:** A lottery has been successfully initiated and completed for a specific Iqub round. A user (Collector or Member of that Iqub) navigates to the `IqubDetailPage.vue`.
2.  **System Response:**
    *   Component mounts and dispatches `iqubs/fetchIqubDetails` (which includes fetching members).
    *   Component also dispatches `iqubs/fetchLotteryWinner`, passing the `iqubId`.
    *   Displays loading indicators for details and potentially a separate one for the winner info.
3.  **System Response (on API Success for `/fetchlottery`):**
    *   `iqubs/fetchLotteryWinner` action completes, updating `iqubs/currentIqubLotteryWinner` state.
    *   Hides the winner loading indicator.
    *   If a winner exists (`getCurrentIqubWinner` is not null), displays the winner's information (e.g., Name: "John Doe") in a designated section on the `IqubDetailPage.vue`. Example locations:
        *   A dedicated "Lottery Winner" card/section.
        *   Near the round progress indicator.
    *   If no winner exists (`getCurrentIqubWinner` is null), displays a message like "Lottery for this round has not been drawn yet." or "No winner for this round.".
4.  **System Response (on API Failure for `/fetchlottery`):**
    *   Displays an error message related to fetching the winner (e.g., "Could not load lottery winner.").

*(Note: Real-time updates via Push Notifications, as described in Journey 9, are the primary way users are *alerted* to the result. This journey describes how the result is *displayed* when viewing the Iqub details page.)*

## 10. View Lottery Winner Journey (Collector/Member)

1.  **Prerequisite:** A lottery has been successfully initiated and completed for a specific Iqub round. A user (Collector or Member of that Iqub) navigates to the `IqubDetailPage.vue`.
2.  **System Response:**
    *   Component mounts and dispatches `iqubs/fetchIqubDetails` (which includes fetching members).
    *   Component also dispatches `iqubs/fetchLotteryWinner`, passing the `iqubId`.
    *   Displays loading indicators for details and potentially a separate one for the winner info.
3.  **System Response (on API Success for `/fetchlottery`):**
    *   `iqubs/fetchLotteryWinner` action completes, updating `iqubs/currentIqubLotteryWinner` state.
    *   Hides the winner loading indicator.
    *   If a winner exists (`getCurrentIqubWinner` is not null), displays the winner's information (e.g., Name: "John Doe") in a designated section on the `IqubDetailPage.vue`. Example locations:
        *   A dedicated "Lottery Winner" card/section.
        *   Near the round progress indicator.
    *   If no winner exists (`getCurrentIqubWinner` is null), displays a message like "Lottery for this round has not been drawn yet." or "No winner for this round.".
4.  **System Response (on API Failure for `/fetchlottery`):**
    *   Displays an error message related to fetching the winner (e.g., "Could not load lottery winner.").

*(Note: Real-time updates via Push Notifications, as described in Journey 9, are the primary way users are *alerted* to the result. This journey describes how the result is *displayed* when viewing the Iqub details page.)*

## 11. Set Next Lottery Date Journey (Collector)

1.  **User Action:** Collector navigates to the `IqubDetailPage.vue` for an active Iqub they manage.
2.  **System Response:** Displays Iqub details. Shows the currently scheduled `next_lottery_date` if set (fetched via `fetchIqubDetails`), otherwise displays "Not Set" or similar. An "Edit Date" or "Set Date" button/icon is visible next to the date display.
3.  **User Action:** Taps the "Edit Date" / "Set Date" button.
4.  **System Response:** Opens a modal or inline date picker (`IonDatetime`), potentially pre-filled with the current `next_lottery_date`. Configure the picker to only allow selection of future dates.
5.  **User Action:** Selects a new date using the date picker and confirms.
6.  **System Response:**
    *   Dispatches `iqubs/setNextLotteryDate` Vuex action, passing the `iqubId` and the selected date (formatted as ISO string).
    *   Shows a loading indicator.
7.  **System Response (on API Success):**
    *   Hides loading indicator.
    *   Shows a success message (e.g., `IonToast`: "Next lottery date updated.").
    *   Closes the modal/picker.
    *   The `next_lottery_date` displayed on the page updates reactively based on the change in the Vuex store.
8.  **System Response (on API Failure):**
    *   Hides loading indicator.
    *   Displays an informative error message (e.g., "Invalid date selected", "Failed to update date.").

## Agent Instructions
*   **Implement Views:** Create Vue components for each major screen/page described in these journeys (e.g., `OnboardingPage.vue`, `LoginPage.vue`, `SignupPage.vue`, `CollectorDashboard.vue`, `MyIqubsPage.vue`, `CreateIqubPage.vue`, `MemberDashboard.vue`, `JoinedIqubsPage.vue`).
*   **Implement Routing:** Configure Vue Router to handle navigation between these views, including passing parameters (e.g., Iqub ID).
*   **Connect to State:** Components should interact with the Vuex store to fetch data (using getters or dispatching fetch actions) and trigger updates (dispatching actions like login, signup, createIqub).
*   **Implement Forms:** Build the required forms with appropriate input fields and validation logic.
*   **Handle Loading/Error States:** Display loading indicators during API calls and provide clear user feedback for success and error scenarios.
*   **Implement Lottery Journey:** Build the UI elements and logic for the "Initiate Lottery" journey as described, including conditional rendering of the trigger button and handling API responses.
*   **Implement Notification Handling:** Integrate push notification receiving logic to handle lottery results (and potentially other future notifications) when the app is in the foreground or opened via a notification tap.
*   **Implement Winner Display:** On `IqubDetailPage.vue`, fetch the lottery winner data using the `iqubs/fetchLotteryWinner` action. Display the winner's name (or a "no winner" message) based on the `iqubs/getCurrentIqubWinner` getter. Handle loading and error states specifically for fetching the winner.
*   **Implement Winner Display:** On `IqubDetailPage.vue`, fetch the lottery winner data using the `iqubs/fetchLotteryWinner` action. Display the winner's name (or a "no winner" message) based on the `iqubs/getCurrentIqubWinner` getter. Handle loading and error states specifically for fetching the winner.
*   **Implement Set Date Journey:** Build the UI elements (`IonDatetime` within a modal or popover triggered by a button) and logic for the "Set Next Lottery Date" journey on `IqubDetailPage.vue`. Ensure date constraints (future dates) are applied to the picker. Connect to the Vuex action and handle API responses/state updates.