# Wujo Deployment Strategy

This document outlines the deployment process for the Wujo frontend application (Web, PWA, Native Mobile).

## 1. Web Build Process

*   **Command:** `npm run build` (or `yarn build`)
*   **Output:** Generates a production-optimized static build in the `/dist` directory.
*   **Environment Variables:** Use `.env` files (`.env`, `.env.production`) to manage environment-specific configurations like the API base URL. Vue CLI automatically handles loading these.
    *   `VUE_APP_API_BASE_URL=https://app.wujo.app/api/`

## 2. Web/PWA Deployment

*   **Hosting:** Deploy the contents of the `/dist` directory to a static web hosting provider.
    *   **Recommended:** Firebase Hosting (integrates well with other Firebase services if used).
    *   **Alternatives:** Netlify, Vercel, AWS S3 + CloudFront, traditional web servers.
*   **Configuration:**
    *   **History Mode:** Configure the hosting provider/server to handle SPA routing (history mode). All requests should be rewritten to serve `index.html` to allow Vue Router to handle the routing.
        *   **Firebase Hosting (`firebase.json`):**
            ```json
            {
              "hosting": {
                "public": "dist",
                "ignore": [
                  "firebase.json",
                  "**/.*",
                  "**/node_modules/**"
                ],
                "rewrites": [
                  {
                    "source": "**",
                    "destination": "/index.html"
                  }
                ]
              }
            }
            ```
    *   **HTTPS:** Ensure HTTPS is enforced for security. Most modern hosting providers handle this automatically.
*   **PWA (Progressive Web App):**
    *   If PWA support was added during `vue create`, Vue CLI handles generating the `manifest.json` and service worker (`service-worker.js`).
    *   Ensure the service worker is correctly registered and configured for caching strategies (e.g., cache-first for assets, network-first for API calls). Test offline capabilities.

## 3. Native Mobile Deployment (iOS / Android via Capacitor)

*   **Step 1: Sync Web Build:** Ensure the latest web build is available.
    ```bash
    npm run build
    ```
*   **Step 2: Sync with Capacitor:** Copy web assets to native platforms and update native dependencies.
    ```bash
    npx cap sync
    ```
*   **Step 3: Open Native IDE:**
    *   **Android:** `npx cap open android` (Opens in Android Studio)
    *   **iOS:** `npx cap open ios` (Opens in Xcode)
*   **Step 4: Configure Native Projects:**
    *   **App Icons & Splash Screens:** Use tools like `cordova-res` or configure manually in Android Studio / Xcode.
    *   **Permissions:** Declare necessary device permissions (e.g., Camera, Location, Push Notifications) in `AndroidManifest.xml` (Android) and `Info.plist` (iOS).
    *   **Signing:** Configure app signing certificates for release builds in Android Studio and Xcode.
*   **Step 5: Build Native Apps:**
    *   **Android:** Use Android Studio to build a signed APK or App Bundle (`.aab`) for release on the Google Play Store.
    *   **iOS:** Use Xcode to archive and build the app (`.ipa`) for release on the Apple App Store. Requires an Apple Developer account.
*   **Step 6: App Store Submission:** Follow the submission guidelines for Google Play Store and Apple App Store.

## 4. Service Worker Updates (PWA)

*   When deploying updates to the PWA, ensure the service worker file is updated. The build process usually handles cache-busting.
*   Implement a mechanism within the app to notify users when a new version is available and prompt them to refresh or update (e.g., using events from the registered service worker).

## 5. Agent Instructions

*   **Configure Build:** Ensure the `npm run build` script is correctly configured. Set up `.env.production` with the production API URL.
*   **Firebase Hosting Setup:** If using Firebase Hosting, initialize Firebase (`firebase init hosting`), configure `firebase.json` as shown, and use `firebase deploy` to deploy the `/dist` directory.
*   **Capacitor Workflow:** Follow the Capacitor sync and build steps (`sync`, `open`, build in IDE) for generating native mobile builds.
*   **Native Configuration:** Add required app icons, splash screens, and permissions in the respective native project files (`AndroidManifest.xml`, `Info.plist`).
*   **PWA Updates:** If PWA is enabled, configure and test the service worker update notification mechanism.
