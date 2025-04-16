import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import apiService from "./services/apiService";
import { IonicVue } from "@ionic/vue"; // Import IonicVue
import store from "./store";
import axios from "axios";
import { AppState } from "./types";

// Axios interceptor for 401 errors
apiService.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      store.commit("auth/logout");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps that use Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker Registered");
    } catch (error) {
      console.log("Service Worker registration failed with error:", error);
    }
  }
}

const app = createApp(App)
  .use(IonicVue) // Use IonicVue
  .use(router)
  .use(store);

router.isReady().then(() => {
  app.mount("#app");
  registerServiceWorker();
});

async function sendDeviceTokenToBackend(deviceToken: string) {
  const platform = Capacitor.getPlatform();
  const authToken = (store.state as any).auth.token; // Assuming the token is in the auth module
  try {
    const response = await apiService.post(
      "/register-device",
      { token: deviceToken, platform: platform },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log("Device token sent successfully:", response.data);
  } catch (error: any) {
    console.error("Error sending device token:", error.response?.data || error);
  }
}
PushNotifications.addListener("registration", (token) => {
  console.log("Push registration success, token: " + token.value);
  sendDeviceTokenToBackend(token.value);
});

PushNotifications.addListener("registrationError", (error) => {
  console.log("Error on registration: " + JSON.stringify(error));
});

PushNotifications.addListener("pushNotificationReceived", (notification) => {
  console.log("Push received: " + JSON.stringify(notification));
  alert(
    "Push received: " + notification.title + ", body: " + notification.body
  );
});

PushNotifications.addListener(
  "pushNotificationActionPerformed",
  (notification) => {
    console.log("Push action performed: " + JSON.stringify(notification));
  }
);

PushNotifications.requestPermissions().then((result) => {
  if (result.receive === "granted") {
    PushNotifications.register();
  } else {
    console.error("Permissions were not granted");
  }
});
