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

## Phase 3: Collector Features

23. **Task:** Set up `iqubs` Vuex module structure (`04_state_management.md`).
24. **Task:** Define `Iqub` and `Member` TypeScript interfaces (`02_data_models.md`).
25. **Task:** Implement `fetchMyIqubs` action and state (`04_state_management.md`, `06_api_contracts.md`).
26. **Task:** Create `CollectorDashboard.vue` component (`07_user_journeys.md`).
27. **Task:** Create `MyIqubsPage.vue` component, fetch and display list using `iqubs/fetchMyIqubs` (`07_user_journeys.md`).
28. **Task:** Implement `createIqub` action (`04_state_management.md`, `06_api_contracts.md`).
29. **Task:** Create `CreateIqubPage.vue` component with form and validation (`07_user_journeys.md`, `05_business_logic.md`).
30. **Task:** Connect `CreateIqubPage.vue` to `iqubs/createIqub` action (`07_user_journeys.md`).
31. **Task:** Implement `addMemberToIqub` action (`04_state_management.md`, `06_api_contracts.md`).
32. **Task:** Create `IqubDetailPage.vue` (basic structure, needs member list fetch later) (`07_user_journeys.md`).
33. **Task:** Create `AddMemberComponent.vue` (modal or section) with form (`07_user_journeys.md`).
34. **Task:** Connect "Add Member" UI to `iqubs/addMemberToIqub` action.
35. **Task:** Implement fetch logic for Iqub member list (requires a dedicated API endpoint - *Assume endpoint exists or specify need*).
36. **Task:** Display member list in `IqubDetailPage.vue`.

## Phase 4: Member Features

37. **Task:** Implement `fetchJoinedIqubs` action and state (`04_state_management.md`, `06_api_contracts.md`).
38. **Task:** Create `MemberDashboard.vue` component (`07_user_journeys.md`).
39. **Task:** Create `JoinedIqubsPage.vue` component, fetch and display list using `iqubs/fetchJoinedIqubs` (`07_user_journeys.md`).
40. **Task:** Implement fetch logic for Member Profile (`GET /profile`) in `auth` module (`06_api_contracts.md`).
41. **Task:** Create `MemberProfilePage.vue` to display profile details.
42. **Task:** Display Iqub details relevant to members (contribution status - *Requires API endpoint*).

## Phase 5: Error Handling & Polish

43. **Task:** Implement global Axios interceptor for 401 errors (`09_recovery_and_errors.md`).
44. **Task:** Enhance error handling in all Vuex actions with user-friendly messages (`09_recovery_and_errors.md`).
45. **Task:** Implement UI components to display errors consistently (`09_recovery_and_errors.md`).
46. **Task:** Integrate Capacitor Network plugin for online/offline detection and feedback (`09_recovery_and_errors.md`).
47. **Task:** Add loading indicators (`IonLoading`, `IonSpinner`) for all asynchronous operations.
48. **Task:** Refine UI styling based on Figma designs/mockups.
49. **Task:** Implement PWA service worker update notifications (if PWA enabled) (`08_deployment.md`).
50. **Task:** Add necessary native permissions (Android/iOS) (`08_deployment.md`).
51. **Task:** Add App Icons and Splash Screens (`08_deployment.md`).

## Agent Instructions

*   Execute tasks sequentially based on phase dependencies.
*   Refer to the corresponding `.md` files for detailed specifications for each task.
*   Commit changes frequently with clear messages referencing the task number (e.g., "feat: Implement Task 10 - LoginPage component").
*   If an API endpoint or specific detail is missing or unclear, note it and proceed with assumptions if necessary, flagging it for review.
*   Focus on writing clean, typed, and testable code.
