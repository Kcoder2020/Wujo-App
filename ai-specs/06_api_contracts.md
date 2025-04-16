# Wujo API Contracts

This document details the contracts for interacting with the Wujo backend REST API.

**Base URL:** `https://app.wujo.app/api/`

**Authentication:** Required for most endpoints (except Signup/Login). Send `Authorization: Bearer <TOKEN>` header.

## 1. Authentication Endpoints

### 1.1. Signup

*   **Method:** `POST`
*   **Path:** `/signup`
*   **Headers:** `Content-Type: application/json`, `Accept: application/json`
*   **Request Body:**
    ```json
    {
      "name": "string (required)",
      "phone": "string (required, E.164 format, e.g., +251911110000)",
      "gender": "string (required, 'male' or 'female')",
      "role": "string (required, 'collector' or 'member')",
      "password": "string (required, min length)",
      "password_confirmation": "string (required, must match password)"
      // "email": "string (optional, valid email format)" - If applicable
    }
    ```
*   **Success Response (2xx):**
    ```json
    {
      "message": "Signup successful.", // Or similar
      "user": { /* User Object - See 02_data_models.md */ },
      "token": "string (Bearer Token)"
    }
    ```
*   **Error Response (4xx):**
    ```json
    {
      "message": "Validation errors or signup failed.",
      "errors": { /* Optional: Field-specific errors */ }
    }
    ```

### 1.2. Login

*   **Method:** `POST`
*   **Path:** `/login`
*   **Headers:** `Content-Type: application/json`, `Accept: application/json`
*   **Request Body:**
    ```json
    {
      "phone": "string (required, E.164 format)",
      "password": "string (required)"
    }
    ```
*   **Success Response (2xx):**
    ```json
    {
      "message": "Login successful.",
      "user": { /* User Object */ },
      "token": "string (Bearer Token)"
    }
    ```
*   **Error Response (4xx/401):**
    ```json
    {
      "message": "Invalid credentials or other error."
    }
    ```

### 1.3. Logout (Collector/Member)

*   **Method:** `GET` (Verify if POST is more appropriate for logout)
*   **Path:** `/logout` (Collector) OR `/signout` (Member) - *Confirm if paths are role-specific or if `/logout` works for both.*
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Success Response (2xx):**
    ```json
    {
      "message": "Successfully logged out."
    }
    ```
*   **Error Response (401/5xx):** Standard error format.

## 2. User Profile Endpoints

### 2.1. Get User Profile (Collector)

*   **Method:** `GET`
*   **Path:** `/user`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Success Response (2xx):**
    ```json
    { /* User Object */ }
    ```
*   **Error Response (401/404/5xx):** Standard error format.

### 2.2. Get User Profile (Member)

*   **Method:** `GET`
*   **Path:** `/profile`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Success Response (2xx):**
    ```json
    { /* User Object - Potentially different fields than Collector's /user? Confirm. */ }
    ```
*   **Error Response (401/404/5xx):** Standard error format.

## 3. Collector Endpoints

### 3.1. Create Iqub

*   **Method:** `POST`
*   **Path:** `/createIqub`
*   **Headers:** `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Request Body:**
    ```json
    {
      "name": "string (required)",
      "saving_pattern": "number|string (required)", // Confirm type expected by backend
      "saving_amount": "string|number (required)", // Confirm type
      "credit_pattern": "number|string (required)", // Confirm type
      "credit_amount": "string|number (required)", // Confirm type
      "members_count": "number (required, integer)"
    }
    ```
*   **Success Response (2xx):**
    ```json
    {
        "message": "Iqub created successfully.", // Or similar
        "iqub": { /* Iqub Object - See 02_data_models.md */ }
    }
    ```
*   **Error Response (4xx/401/5xx):** Standard error format, potentially with validation errors.

### 3.2. Get My Iqubs

*   **Method:** `GET`
*   **Path:** `/myIqubs`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Success Response (2xx):**
    ```json
    [
      { /* Iqub Object (Summary) */ }
      // ... more Iqub objects
    ]
    ```
*   **Error Response (401/5xx):** Standard error format.

### 3.3. Add Member

*   **Method:** `POST`
*   **Path:** `/addMember`
*   **Headers:** `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Request Body:**
    ```json
    {
      "phone": "string (required, E.164 format)",
      "iqub": "number (required, ID of the Iqub)"
    }
    ```
*   **Success Response (2xx):**
    ```json
    {
      "message": "Member added successfully." // Or includes updated member list/count? Confirm.
    }
    ```
*   **Error Response (4xx/401/404/5xx):** Standard error format (e.g., "Iqub not found", "Member already exists", "Iqub full").
### 3.4. Initiate Lottery

*   **Method:** `GET`
*   **Path:** `/initiatelottery`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Query Parameters:**
    *   `iqub_id` (Number, required): The ID of the Iqub for which to initiate the lottery.
    *   `agent_id` (Number, required): The ID of the Collector initiating the lottery. (*Note: Confirm with backend team if this is strictly necessary, as the Collector's ID should be derivable from the Bearer Token.*)
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Lottery initiated successfully. Winner will be notified."
      // Optional: Might include round number or other context, but not the winner details.
    }
    ```
*   **Error Response (4xx/401/403/404/5xx):**
    *   Standard error format.
    *   Possible specific errors: "Lottery cannot be initiated for this Iqub status", "Round already has a lottery winner", "Iqub not found", "Permission denied".

### 3.5. Set/Update Next Lottery Date (New Endpoint Assumption)

*   **Method:** `PATCH` (Suitable for partial updates)
*   **Path:** `/iqubs/{id}` (*Assuming update via the main Iqub resource*)
    *   *Alternative Path:* `/iqubs/{id}/lottery-date` (If backend prefers a dedicated sub-resource endpoint)
*   **Headers:** `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Path Parameters:**
    *   `id` (Number, required): The ID of the Iqub to update.
*   **Request Body:**
    ```json
    {
      "next_lottery_date": "string (required, ISO 8601 Date or DateTime format, e.g., YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Next lottery date updated successfully.",
      "iqub": { /* Updated Iqub Object, including the new next_lottery_date */ }
    }
    ```
*   **Error Response (4xx/401/403/404/422/5xx):**
    *   Standard error format.
    *   Possible specific errors: "Invalid date format", "Date must be in the future", "Iqub not found", "Permission denied".

## 4. Member Endpoints

### 4.1. Get Joined Iqubs

*   **Method:** `GET`
*   **Path:** `/joinedIqubs`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Success Response (2xx):**
    ```json
    [
      { /* Iqub Object (Summary) */ }
      // ... more Iqub objects
    ]
    ```
*   **Error Response (401/5xx):** Standard error format.

### 5.1. Fetch Lottery Winner

*   **Method:** `GET`
*   **Path:** `/fetchlottery`
*   **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN>`
*   **Query Parameters:**
    *   `iqub_id` (Number, required): The ID of the Iqub for which to fetch the lottery winner.
    *   *(Optional)* `round_number` (Number): Specify the round number. If omitted, assume it fetches the winner for the *latest* completed lottery round for that Iqub. (*Confirm parameter requirement with backend team*).
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Lottery winner retrieved successfully.",
      "winner": { /* User Object - See 02_data_models.md (ID, name, phone likely sufficient) */ },
      "round_number": 5 // Example: Indicates which round this winner applies to
      // Optional: Include lottery date/timestamp
    }
    ```
    *   If no winner exists for the specified round (or latest round):
    ```json
    {
        "message": "No lottery winner found for this round/Iqub.",
        "winner": null
    }
    ```
*   **Error Response (4xx/401/404/5xx):**
    *   Standard error format.
    *   Possible specific errors: "Iqub not found", "Invalid round number".


## 6. Agent Instructions

*   **Implement API Service:** Create a dedicated service (e.g., `src/services/apiService.ts`) or use Vuex actions to encapsulate all API calls defined here.
*   **Implement Initiate Lottery Call:** Add the function call for `GET /initiatelottery` with required query parameters to the API service/Vuex actions.
*   **Use Axios:** Utilize the configured Axios instance for making requests.
*   **Handle Auth:** Ensure the `Authorization: Bearer <TOKEN>` header is correctly added to all protected requests, retrieving the token from the Vuex store.
*   **Type Payloads:** Use TypeScript interfaces for request bodies and expected response structures based on `02_data_models.md` and the examples above.
*   **Error Handling:** Implement logic in the API service/actions to catch errors, parse error messages from responses, and communicate failures back to the calling component or Vuex module.
*   **Clarify Ambiguities:** Note any assumptions made about response structures or parameter types and seek clarification if possible. Confirm the correct logout path (`/logout` vs `/signout`). Confirm expected types for pattern/amount fields.
*   **Implement Fetch Lottery Call:** Add the function call for `GET /fetchlottery` with required query parameters to the API service/Vuex actions. Handle the response structure, including the case where `winner` is `null`.
*   **Implement Set Lottery Date Call:** Add the function call for `PATCH /iqubs/{id}` (or alternative path) to the API service/Vuex actions, sending the `next_lottery_date` in the request body. Handle the response.