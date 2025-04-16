# Wujo Agent Development Tasks

This file lists atomic, actionable tasks for AI agents to develop the Wujo platform frontend. Tasks should generally be performed sequentially within a feature, but some modules can be developed in parallel.

## Phase 1: Project Setup & Core Auth

1.  ✅ **Task:** Initialize Vue 3 project with TypeScript, Vuex, Router (`01_architecture.md`).
2.  ✅ **Task:** Install Ionic, Capacitor, Axios (`01_architecture.md`).
3.  ✅ **Task:** Initialize Capacitor, add platforms (`01_architecture.md`).
4.  ✅ **Task:** Set up Vuex store structure with `auth` module (`04_state_management.md`).
5.  ✅ **Task:** Define `User` TypeScript interface (`02_data_models.md`).
6.  ✅ **Task:** Implement `auth` module state, mutations, basic getters (`04_state_management.md`).
7.  ✅ **Task:** Create Axios instance and basic API service structure (`01_architecture.md`, `06_api_contracts.md`).
8.  ✅ **Task:** Implement Login API call (`POST /login`) in `auth` action (`06_api_contracts.md`, `04_state_management.md`). Include basic error handling.
9.  ✅ **Task:** Implement token persistence (localStorage) and Axios header update on login (`04_state_management.md`).
10. ✅ **Task:** Create `LoginPage.vue` component with form fields (`07_user_journeys.md`).
11. ✅ **Task:** Connect `LoginPage.vue` to `auth/login` action, handle loading/error states, navigate on success (`07_user_journeys.md`).
12. ✅ **Task:** Implement Signup API call (`POST /signup`) in `auth` action (`06_api_contracts.md`, `04_state_management.md`).
13. ✅ **Task:** Create `SignupPage.vue` component with form fields and validation (`07_user_journeys.md`, `05_business_logic.md`).
14. ✅ **Task:** Connect `SignupPage.vue` to `auth/signup` action, handle states, navigate on success (`07_user_journeys.md`).
15. ✅ **Task:** Implement Logout API call (`GET /logout` or `/signout`) in `auth` action, clear state/token (`06_api_contracts.md`, `04_state_management.md`).
16. ✅ **Task:** Add Logout button to relevant UI sections, connect to `auth/logout` action.
17. ✅ **Task:** Implement `initializeAuth` action to check stored token on app start (`04_state_management.md`).
18. ✅ **Task:** Implement basic routing and route guards to protect authenticated routes (`05_business_logic.md`, `07_user_journeys.md`).

## Phase 2: Onboarding & Shared Components

19. **Task:** Create `OnboardingPage.vue` component with Swiper (`07_user_journeys.md`).
20. **Task:** Implement onboarding slide content and navigation logic (Skip, Next, Get Started) (`07_user_journeys.md`).
21. **Task:** Create reusable `AppHeader.vue` component (potentially using the logo) (`07_user_journeys.md`).
22. **Task:** Create reusable `AppTabBar.vue` or navigation component based on role (`05_business_logic.md`, `07_user_journeys.md`).

## Phase 3: Collector Features & Lottery Logic

23. **Task:** Set up `iqubs` Vuex module structure (`04_state_management.md`).
24. **Task:** Define `Iqub` and `Member` TypeScript interfaces (`02_data_models.md`).
25. **Task:** Implement `fetchMyIqubs` action and state (`04_state_management.md`, `06_api_contracts.md`).
26. **Task:** Create `CollectorDashboard.vue` component (`07_user_journeys.md`).
27. **Task:** Create `MyIqubsPage.vue` component, fetch and display list using `iqubs/fetchMyIqubs` (`07_user_journeys.md`).
28. **Task:** Implement `createIqub` action (`04_state_management.md`, `06_api_contracts.md`).
29. **Task:** Create `CreateIqubPage.vue` component with form and validation (`07_user_journeys.md`, `05_business_logic.md`).
30. **Task:** Connect `CreateIqubPage.vue` to `iqubs/createIqub` action (`07_user_journeys.md`).
31. **Task:** Implement `addMemberToIqub` action (`04_state_management.md`, `06_api_contracts.md`).
32. **Task:** Create `IqubDetailPage.vue` (basic structure) (`07_user_journeys.md`).
33. **Task:** Implement logic to fetch Iqub details (including members) for `IqubDetailPage.vue` (e.g., `fetchIqubDetails` action) (*Assume member list comes with Iqub detail endpoint or specify separate fetch*).
34. **Task:** Display member list in `IqubDetailPage.vue`.
35. **Task:** Create `AddMemberComponent.vue` (modal or section) with form (`07_user_journeys.md`).
36. **Task:** Connect "Add Member" UI in `IqubDetailPage.vue` to `iqubs/addMemberToIqub` action.
37. **Task:** Define `initiateLottery` action in `iqubs` Vuex module (API call to `GET /initiatelottery`) (`06_api_contracts.md`, `04_state_management.md`).
38. **Task:** Add "Initiate Lottery" button to `IqubDetailPage.vue`. Conditionally display/enable this button based on business logic rules defined in `05_business_logic.md` (requires fetching appropriate Iqub status/round info).
39. **Task:** Connect the "Initiate Lottery" button to the `iqubs/initiateLottery` action. Handle loading state and display success/error feedback based on the API response (`07_user_journeys.md`).
40. **Task:** Define `fetchLotteryWinner` action in `iqubs` Vuex module (API call to `GET /fetchlottery`) (`06_api_contracts.md`, `04_state_management.md`).
41. **Task:** Update `IqubDetailPage.vue` to call the `iqubs/fetchLotteryWinner` action when the component loads (or at another appropriate time).
42. **Task:** Implement UI on `IqubDetailPage.vue` to display the fetched lottery winner information (name) or a "no winner" message, based on the `iqubs/getCurrentIqubWinner` getter. Handle loading/error states for this specific fetch (`07_user_journeys.md`).
43. **Task:** Define `setNextLotteryDate` action in `iqubs` Vuex module (API call to `PATCH /iqubs/{id}`) (`06_api_contracts.md`, `04_state_management.md`). Add necessary state/mutations for status/error.
44. **Task:** Add UI elements (display area for date, button/icon to trigger update) to `IqubDetailPage.vue` for viewing and setting the `next_lottery_date`. (`07_user_journeys.md`).
45. **Task:** Implement `IonDatetime` component (likely in a modal/popover) for date selection, constraining selection to future dates (`05_business_logic.md`, `07_user_journeys.md`).
46. **Task:** Connect the date selection confirmation to the `iqubs/setNextLotteryDate` action. Handle loading state and success/error feedback (`07_user_journeys.md`).
47. **Task:** Ensure the displayed `next_lottery_date` on `IqubDetailPage.vue` updates reactively when the Vuex state changes.

## Phase 4: Member Features

48. **Task:** Implement `fetchJoinedIqubs` action and state (`04_state_management.md`, `06_api_contracts.md`).
49. **Task:** Create `MemberDashboard.vue` component (`07_user_journeys.md`).
50. **Task:** Create `JoinedIqubsPage.vue` component, fetch and display list using `iqubs/fetchJoinedIqubs` (`07_user_journeys.md`).
51. **Task:** Implement fetch logic for Member Profile (`GET /profile`) in `auth` module (`06_api_contracts.md`).
52. **Task:** Create `MemberProfilePage.vue` to display profile details.
53. **Task:** Update `IqubDetailPage.vue` (if accessed by member) to display details relevant to members (e.g., their contribution status - *Requires API endpoint for contribution history/status*).
54. **Task:** Implement `fetchJoinedIqubs` action and state (`04_state_management.md`, `06_api_contracts.md`).
55. **Task:** Create `MemberDashboard.vue` component (`07_user_journeys.md`).
56. **Task:** Create `JoinedIqubsPage.vue` component, fetch and display list using `iqubs/fetchJoinedIqubs` (`07_user_journeys.md`).
57. **Task:** Implement fetch logic for Member Profile (`GET /profile`) in `auth` module (`06_api_contracts.md`).
58. **Task:** Create `MemberProfilePage.vue` to display profile details.
59. **Task:** Update `IqubDetailPage.vue` (if accessed by member) to display details relevant to members (e.g., their contribution status - *Requires API endpoint for contribution history/status*). Also display the `next_lottery_date` if set (read-only for members).

## Phase 5: Error Handling, Polish & Notifications

60. **Task:** Implement global Axios interceptor for 401 errors (`09_recovery_and_errors.md`).
61. **Task:** Enhance error handling in all Vuex actions with user-friendly messages (`09_recovery_and_errors.md`).
62. **Task:** Implement UI components to display errors consistently (`09_recovery_and_errors.md`).
63. **Task:** Integrate Capacitor Network plugin for online/offline detection and feedback (`09_recovery_and_errors.md`).
64. **Task:** Add loading indicators (`IonLoading`, `IonSpinner`) for all asynchronous operations.
65. **Task:** Refine UI styling based on Figma designs/mockups.

    ---
    **Note for Agent:** Tasks 60 and 61 related to Push Notification setup are currently **DEFERRED** pending backend coordination. Specifically, clarification is needed on:
    1.  The backend API endpoint for receiving and storing user device tokens.
    2.  The exact structure of the push notification payload sent by the backend (especially for lottery results, including how to identify the notification type and any associated data like `iqubId`).
    **Proceed to the next task (Task 62) for now.**
    ---

66. **Task:** **[DEFERRED]** Implement client-side push notification registration using Capacitor Push Notifications plugin (`@capacitor/push-notifications`) (`12_integrations.md`). Handle device token retrieval and potentially send it to the backend (requires a dedicated backend endpoint for storing tokens - *Specify need*).
67. **Task:** **[DEFERRED]** Implement listeners for receiving push notifications (foreground and background/tap actions) (`07_user_journeys.md`, `12_integrations.md`). Display received notifications appropriately (e.g., in-app toast, system notification handling for lottery results).
68. **Task:** Implement PWA service worker update notifications (if PWA enabled) (`08_deployment.md`).
69. **Task:** Add necessary native permissions (Android/iOS) (`08_deployment.md`).
70. **Task:** Add App Icons and Splash Screens (`08_deployment.md`).
71. **Task:** Implement global Axios interceptor for 401 errors (`09_recovery_and_errors.md`).
72. **Task:** Enhance error handling in all Vuex actions with user-friendly messages (`09_recovery_and_errors.md`).
73. **Task:** Implement UI components to display errors consistently (`09_recovery_and_errors.md`).
74. **Task:** Integrate Capacitor Network plugin for online/offline detection and feedback (`09_recovery_and_errors.md`).
75. **Task:** Add loading indicators (`IonLoading`, `IonSpinner`) for all asynchronous operations.
76. **Task:** Refine UI styling based on Figma designs/mockups.
77. **Task:** Implement client-side push notification registration using Capacitor Push Notifications plugin (`@capacitor/push-notifications`) (`12_integrations.md`). Handle device token retrieval and potentially send it to the backend (requires a dedicated backend endpoint for storing tokens - *Specify need*).
79. **Task:** Implement listeners for receiving push notifications (foreground and background/tap actions) (`07_user_journeys.md`, `12_integrations.md`). Display received notifications appropriately (e.g., in-app toast, system notification handling for lottery results).
80. **Task:** Implement PWA service worker update notifications (if PWA enabled) (`08_deployment.md`).
81. **Task:** Add necessary native permissions (Android/iOS) (`08_deployment.md`).
82. **Task:** Add App Icons and Splash Screens (`08_deployment.md`).


## Agent Instructions

*   Execute tasks sequentially based on phase dependencies.
*   Refer to the corresponding `.md` files for detailed specifications for each task.
*   Commit changes frequently with clear messages referencing the task number (e.g., "feat: Implement Task 10 - LoginPage component").
*   If an API endpoint or specific detail is missing or unclear, note it and proceed with assumptions if necessary, flagging it for review.
*   Focus on writing clean, typed, and testable code.
*   Implement the "Set Next Lottery Date" feature by following the newly added tasks.
*   **Deferred Tasks:** Skip Tasks 66 and 67 for now. Proceed with Task 68 (or the next applicable task if PWA is not enabled) and continue sequentially. Revisit deferred tasks when backend details are provided.