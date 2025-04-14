# Wujo Security Considerations (Frontend)

This document outlines security measures to be implemented within the Wujo frontend application. The primary security boundary is the backend API.

## 1. Authentication Token Handling

*   **Storage:** Store the JWT Bearer token received upon login securely.
    *   **Recommended:** `localStorage` or `sessionStorage` for web/PWA. While not perfectly secure against XSS (less critical in Capacitor context), it's standard practice.
    *   **Native Enhancement:** For native builds via Capacitor, consider using the Capacitor Secure Storage plugin (`@capacitor/preferences` with secure options or `@capacitor-community/sqlite` with encryption) for enhanced security, storing the token in native secure storage.
*   **Transmission:** Send the token in the `Authorization: Bearer <TOKEN>` header for all authenticated API requests. Do *not* send the token in URL parameters.
*   **Expiration:** The backend is responsible for token expiration. The frontend must handle `401 Unauthorized` responses by clearing the stored token and redirecting the user to the login screen. Implement this globally using an Axios response interceptor.
*   **Leakage:** Avoid logging the token to the console or storing it in insecure ways.

## 2. Input Validation

*   **Client-Side:** Implement thorough client-side validation for *all* user inputs (forms, parameters) as specified in `02_data_models.md` and `05_business_logic.md`. This prevents malformed data from being sent to the backend and improves user experience. Validate types, formats (email, phone), required fields, length limits, and numeric ranges.
*   **Server-Side Trust:** **Never trust client-side validation alone.** The backend API *must* perform its own authoritative validation. Client-side validation is primarily for UX.

## 3. Cross-Site Scripting (XSS) Prevention

*   **Framework Protection:** Vue 3 automatically escapes dynamic content bound using `{{ }}` syntax or `v-bind`, providing significant protection against XSS.
*   **`v-html`:** Avoid using the `v-html` directive unless absolutely necessary and only with sanitized content. If used, employ a robust HTML sanitization library (e.g., `DOMPurify`).
*   **URL Handling:** Be cautious when rendering user-provided URLs. Validate them to prevent `javascript:` pseudo-protocol attacks.

## 4. Secure Data Display

*   Avoid displaying sensitive user information unnecessarily (e.g., full phone numbers of other members unless required by functionality). Rely on the backend to provide appropriately masked or limited data where necessary.

## 5. Capacitor Security

*   **Permissions:** Request only the necessary device permissions via Capacitor plugins. Clearly explain to the user why permissions are needed.
*   **Plugin Security:** Use official or well-vetted Capacitor community plugins. Be aware of the security implications of the plugins you integrate.
*   **Web View Security:** Keep Capacitor and its underlying web view dependencies updated to patch potential security vulnerabilities.

## 6. HTTPS Enforcement

*   Ensure all communication with the backend API occurs over HTTPS. The Axios instance should be configured with the `https://` base URL.
*   If deploying as a PWA or web app, ensure the hosting environment enforces HTTPS.

## 7. Session Management

*   **Logout:** Implement a clear logout mechanism that clears the authentication token from storage and resets the application state (`auth/logout` action).
*   **Inactivity Timeout (Optional):** Consider implementing an inactivity timeout that automatically logs the user out after a certain period of inactivity for enhanced security, especially if handling sensitive data.

## 8. Agent Instructions

*   **Implement Secure Token Storage:** Choose a storage method (localStorage or Capacitor Secure Storage) and implement the logic in the `auth` Vuex module to save, retrieve, and clear the token.
*   **Implement Global 401 Handling:** Create an Axios response interceptor that checks for 401 status codes, dispatches the `auth/logout` action, and redirects to login.
*   **Implement Input Validation:** Add validation rules to all forms using VeeValidate or similar libraries.
*   **Avoid `v-html`:** Do not use `v-html` unless reviewed and approved, ensuring content sanitization is used.
*   **Configure Capacitor Permissions:** Declare necessary permissions in `AndroidManifest.xml` and `Info.plist`.
*   **Verify HTTPS:** Confirm the API base URL uses HTTPS.
