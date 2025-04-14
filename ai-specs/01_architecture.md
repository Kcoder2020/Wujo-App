# Wujo Platform Architecture

## 1. Overview

The Wujo platform follows a client-server architecture. The frontend is a mobile application built using modern web technologies and packaged for native deployment. The backend provides a RESTful API for data persistence and business logic execution.

## 2. Frontend Architecture

*   **Framework:** Vue 3 (Composition API)
*   **UI Library:** Ionic Framework (Vue Components) - Provides mobile-optimized UI elements and native-like experiences.
*   **Mobile Runtime:** Capacitor - Enables deployment as native iOS and Android applications, providing access to native device features.
*   **Language:** TypeScript - For type safety and improved developer experience.
*   **State Management:** Vuex - Centralized state management for user authentication, profile data, Iqub lists, etc.
*   **Routing:** Vue Router (integrated with `@ionic/vue-router`) - For navigation between different views/pages within the app.
*   **API Client:** Axios - For making HTTP requests to the backend API.

## 3. Backend Architecture

*   **Status:** Pre-built and operational.
*   **API Type:** RESTful API.
*   **Base URL:** `https://app.wujo.app/api/`
*   **Authentication:** Token-based (Bearer Tokens) - See `06_api_contracts.md` and `11_security.md`.
*   **Responsibility:** Handles user authentication, data persistence (users, Iqubs, members, contributions), core business logic execution (ROSCA rules, member management), and serves data to the frontend.

## 4. Database

*   **Managed By:** Backend.
*   **Frontend Interaction:** The frontend does *not* interact directly with the database. All data access occurs via the backend API.
*   **Assumed Type (for context):** Likely a relational (e.g., PostgreSQL, MySQL) or NoSQL (e.g., MongoDB) database, managed by the backend infrastructure.

## 5. Real-time Communication (Assumption)

*   **Requirement:** Real-time updates might be necessary for features like notifications (e.g., payment reminders, lottery results) or live updates in Iqub views.
*   **Mechanism:** To be determined based on backend capabilities. Potential options include:
    *   **WebSockets:** If the backend provides a WebSocket endpoint.
    *   **Server-Sent Events (SSE):** If the backend supports SSE for unidirectional updates.
    *   **Polling:** As a fallback, periodically fetching data (less efficient).
*   **Frontend Implementation:** If real-time capabilities are available, the frontend will need to establish and manage the connection (e.g., using `socket.io-client` or native browser APIs) and update the Vuex store accordingly. If not available, indicate this limitation.

## 6. Agent Instructions

*   **Project Setup:** Initialize a new project using Vue CLI with Vue 3, TypeScript, Vuex, and Vue Router.
*   **Install Dependencies:** Add `@ionic/vue`, `@ionic/vue-router`, `@capacitor/core`, `@capacitor/cli`, `axios`, and `vuex@next`.
*   **Capacitor Integration:** Initialize Capacitor (`npx cap init`), add native platforms (`npx cap add android ios`), and configure for mobile deployment.
*   **Axios Setup:** Create an Axios instance configured with the `baseURL` (`https://app.wujo.app/api/`) and necessary headers (e.g., `Accept: application/json`). Implement interceptors to automatically add the Bearer token to authorized requests (see `04_state_management.md` and `11_security.md`).
*   **Real-time:** Investigate if the backend offers real-time capabilities. If so, implement the client-side connection and data handling logic. If not, proceed without real-time features initially.
