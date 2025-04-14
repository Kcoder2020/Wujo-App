# Wujo Data Flows

This document outlines the key data flow processes within the Wujo frontend application, focusing on user interactions, API calls, and state updates.

## 1. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant VueApp as Wujo Frontend
    participant VuexStore as Vuex Store
    participant BackendAPI as Backend API

    User->>VueApp: Enters Phone/Password on Login Screen
    VueApp->>VueApp: Validate Input Fields
    alt Input Invalid
        VueApp->>User: Show Validation Error
    else Input Valid
        VueApp->>BackendAPI: POST /login (phone, password)
        BackendAPI-->>VueApp: Response (Success: {user, token} / Error: {message})
        alt Login Success
            VueApp->>VuexStore: dispatch('auth/loginSuccess', {user, token})
            VuexStore->>VuexStore: commit('auth/SET_USER', user)
            VuexStore->>VuexStore: commit('auth/SET_TOKEN', token)
            VuexStore->>VueApp: State Updated (isAuthenticated = true)
            VueApp->>User: Navigate to Dashboard (Collector/Member)
        else Login Error
            VueApp->>User: Show Login Error Message
        end
    end
Description: User enters credentials, frontend validates, sends login request, backend responds, frontend updates Vuex store on success, navigates user.

Key State Changes: auth/user, auth/token, auth/isAuthenticated.
### 2. Collector Creates Iqub Flow
sequenceDiagram
    participant User as Collector
    participant VueApp as Wujo Frontend
    participant VuexStore as Vuex Store
    participant BackendAPI as Backend API

    User->>VueApp: Fills 'Create Iqub' Form
    VueApp->>VueApp: Validate Input Fields (name, amounts, patterns, count)
    alt Input Invalid
        VueApp->>User: Show Validation Error
    else Input Valid
        VueApp->>VuexStore: get('auth/token')
        VuexStore-->>VueApp: Bearer Token
        VueApp->>BackendAPI: POST /createIqub (Form Data + Auth Header)
        BackendAPI-->>VueApp: Response (Success: {iqub} / Error: {message})
        alt Create Success
            VueApp->>VuexStore: dispatch('iqubs/addIqub', newIqub)
            VuexStore->>VuexStore: commit('iqubs/ADD_IQUB', newIqub)
            VuexStore->>VueApp: State Updated (iqubs list)
            VueApp->>User: Show Success Message, Navigate to 'My Iqubs'
        else Create Error
            VueApp->>User: Show Error Message
        end
    end
Description: Collector fills form, frontend validates, sends authenticated request, backend responds, frontend updates Iqub list in Vuex store on success.

Key State Changes: iqubs/list.
### 3. Fetching User-Specific Data (e.g., My Iqubs)
sequenceDiagram
    participant User
    participant VueApp as Wujo Frontend (e.g., MyIqubs Page)
    participant VuexStore as Vuex Store
    participant BackendAPI as Backend API

    VueApp->>VuexStore: dispatch('iqubs/fetchMyIqubs')
    VuexStore->>VuexStore: get('auth/token')
    VuexStore-->>VuexStore: Bearer Token
    VuexStore->>BackendAPI: GET /myIqubs (Auth Header)
    BackendAPI-->>VuexStore: Response (Success: [iqubs] / Error: {message})
    alt Fetch Success
        VuexStore->>VuexStore: commit('iqubs/SET_IQUBS', iqubs)
        VuexStore->>VueApp: State Updated (iqubs list)
        VueApp->>User: Display Fetched Iqubs
    else Fetch Error
        VuexStore->>VueApp: State Indicates Error
        VueApp->>User: Show Error Message
    end

Description: Component dispatches action, Vuex action gets token, makes authenticated API call, commits fetched data to state, component reacts to state change.

Key State Changes: iqubs/list. Similar flows apply to joinedIqubs, profile, etc.
### 4. Real-time Data Flow (Conceptual - If Implemented)
sequenceDiagram
    participant Backend as Backend (WebSocket/SSE)
    participant VueApp as Wujo Frontend
    participant VuexStore as Vuex Store

    VueApp->>Backend: Establish Connection (on login/app start)
    Backend-->>VueApp: Connection Established
    loop Real-time Updates
        Backend->>VueApp: Send Event (e.g., new_member_added, payment_received)
        VueApp->>VuexStore: dispatch('handleRealtimeEvent', eventPayload)
        VuexStore->>VuexStore: Commit relevant mutation (e.g., UPDATE_IQUB_MEMBER_COUNT)
        VuexStore->>VueApp: State Updated
        VueApp->>VueApp: UI Reacts to State Change
    end
Description: Frontend establishes a connection, listens for events, dispatches actions to update the Vuex store based on received events.

Key State Changes: Various, depending on the event (e.g., iqubs/list, notifications/list).
### 5. Agent Instructions
Implement API Calls: Create functions (e.g., in an apiService.ts file or within Vuex actions) to handle API requests as shown in the diagrams. Ensure proper authentication headers are included for protected endpoints.

Connect UI to Vuex: Components should dispatch Vuex actions to fetch or modify data. Use Vuex getters or mapState to display data reactively.

Handle Responses: Implement logic to handle both success and error responses from the API, updating the UI and Vuex state accordingly.

Real-time (If Applicable): If the backend provides real-time capabilities, implement the client-side connection logic and event handlers to update the Vuex store.

