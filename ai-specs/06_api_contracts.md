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

## 5. Agent Instructions

*   **Implement API Service:** Create a dedicated service (e.g., `src/services/apiService.ts`) or use Vuex actions to encapsulate all API calls defined here.
*   **Use Axios:** Utilize the configured Axios instance for making requests.
*   **Handle Auth:** Ensure the `Authorization: Bearer <TOKEN>` header is correctly added to all protected requests, retrieving the token from the Vuex store.
*   **Type Payloads:** Use TypeScript interfaces for request bodies and expected response structures based on `02_data_models.md` and the examples above.
*   **Error Handling:** Implement logic in the API service/actions to catch errors, parse error messages from responses, and communicate failures back to the calling component or Vuex module.
*   **Clarify Ambiguities:** Note any assumptions made about response structures or parameter types and seek clarification if possible. Confirm the correct logout path (`/logout` vs `/signout`). Confirm expected types for pattern/amount fields.
