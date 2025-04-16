# Wujo Integrations

This document lists external services and libraries integrated into the Wujo frontend.

## 1. Backend API

*   **Service:** Wujo Custom Backend API
*   **Integration Point:** `src/services/apiService.ts` (using Axios)
*   **Purpose:** Primary source for data, business logic execution, and authentication.
*   **Details:** See `01_architecture.md` and `06_api_contracts.md`.
*   **Agent Instruction:** Implement all backend communication through the configured Axios instance and API service layer.

## 2. Authentication

*   **Service:** Handled by the Wujo Backend API.
*   **Frontend Role:** Collects credentials, sends them to the backend `/login` or `/signup` endpoints, receives and stores the Bearer token, and sends the token with subsequent requests.
*   **Details:** See `04_state_management.md` (auth module), `06_api_contracts.md`, `11_security.md`.
*   **Agent Instruction:** Implement the client-side authentication flow as described, interacting with the backend's auth endpoints and managing the token.

## 3. UI Framework

*   **Service/Library:** Ionic Framework (Vue Components)
*   **Integration Point:** Used throughout `.vue` components for UI elements. `main.ts` registers the `IonicVue` plugin.
*   **Purpose:** Provides mobile-optimized UI components, navigation, and platform styling.
*   **Details:** See `01_architecture.md`. Import necessary CSS in `main.ts`.
*   **Agent Instruction:** Utilize Ionic components (`ion-page`, `ion-button`, `ion-list`, `ion-input`, etc.) for building the user interface according to designs/mockups.

## 4. Mobile Runtime

*   **Service/Library:** Capacitor
*   **Integration Point:** Project root configuration (`capacitor.config.ts`), native projects (`android/`, `ios/`), CLI commands (`npx cap ...`). Plugins imported as needed.
*   **Purpose:** Packages the web app into native mobile containers, provides access to native device features via plugins.
*   **Details:** See `01_architecture.md`, `08_deployment.md`.
*   **Agent Instruction:** Use Capacitor CLI for syncing web builds and managing native projects. Integrate Capacitor plugins (e.g., Network, Storage, Push Notifications) as required by features.

## 5. Slider/Carousel

*   **Service/Library:** Swiper.js (via `swiper/vue`)
*   **Integration Point:** `OnboardingPage.vue` (or other components needing carousels). Requires CSS imports.
*   **Purpose:** Provides the swipeable interface for the onboarding flow.
*   **Details:** See `07_user_journeys.md`.
*   **Agent Instruction:** Implement the onboarding carousel using the `Swiper` and `SwiperSlide` components from `swiper/vue`. Import required modules and CSS.

## 6. Potential Future Integrations (Optional)

*   **Push Notifications:** Firebase Cloud Messaging (FCM) via Capacitor Push Notifications plugin (`@capacitor/push-notifications`). Requires backend integration to send notifications.
*   **Service:** Firebase Cloud Messaging (FCM) for Android, Apple Push Notification Service (APNS) for iOS. (Backend responsibility to send notifications via these services).
*   **Integration Point (Frontend):** Capacitor Push Notifications plugin (`@capacitor/push-notifications`).
*   **Purpose:** Notify users (Collectors, Members) about key events, starting with lottery results.
*   **Details:**
    *   Frontend needs to request permission from the user to receive notifications.
    *   Frontend needs to register with FCM/APNS to receive a device token.
    *   Frontend *may* need to send this device token to the backend to associate it with the user (Requires a dedicated backend endpoint: `POST /api/device-token` - *Assumption, needs confirmation*).
    *   Frontend needs listeners to handle:
        *   Receiving the device token.
        *   Receiving notifications when the app is in the foreground.
        *   Handling notification tap actions when the app is opened from a notification.
*   **Agent Instruction:** Implement push notification setup using `@capacitor/push-notifications`. Request permissions, handle token registration (including sending to backend if required), and set up listeners for incoming notifications as described in `07_user_journeys.md` and `10_agent_tasks.md`.
*   **Analytics:** Google Analytics / Firebase Analytics via Capacitor plugins or web SDKs.
*   **Payment Gateway:** If direct payments are implemented (not indicated in current API), integration with a payment provider (e.g., Stripe, local Ethiopian gateways) would be needed via SDKs or backend coordination.
*   **Mapping/Location:** If location features are added, Capacitor Geolocation plugin (`@capacitor/geolocation`) and map libraries (e.g., Leaflet, Mapbox GL JS) might be integrated.

## 7. Agent Instructions

*   **Confirm Integrations:** Verify the list of required integrations.
*   **Install Dependencies:** Ensure all necessary libraries (Ionic, Capacitor, Axios, Swiper) are installed.
*   **Import Correctly:** Use correct import paths for integrated libraries (e.g., `@ionic/vue`, `swiper/vue`, `@capacitor/core`).
*   **Configure Plugins:** If using Capacitor plugins, follow their specific setup instructions (installation, native configuration).
*   **Add Future Integrations:** If features requiring new integrations (like Push Notifications) are added, update this document and implement the integration following best practices.
