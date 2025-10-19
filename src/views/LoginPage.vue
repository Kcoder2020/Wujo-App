<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="logo-container">
        <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
      </div>

      <error-display :error-message="errorMessage" />

      <form @submit.prevent="login" class="login-form">
        <!-- Phone Input -->
        <div class="form-field">
          <ion-label class="field-label">Phone</ion-label>
          <!-- Replaced div with ion-item for better focus detection -->
          <ion-item class="input-wrapper phone-wrapper" lines="none">
            <div class="country-code">
              <img
                src="@/assets/img/ethiopia-flag.png"
                alt="Ethiopia Flag"
                class="flag-icon"
              />
              <ion-icon :icon="chevronDownOutline"></ion-icon>
              <span>+251</span>
            </div>
            <ion-input
              v-model="username"
              type="tel"
              placeholder="912 345 678"
            ></ion-input>
          </ion-item>
        </div>

        <!-- Password Input -->
        <div class="form-field">
          <ion-label class="field-label">Password</ion-label>
          <ion-item class="input-wrapper password-wrapper" lines="none">
            <ion-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
            ></ion-input>
            <ion-icon
              :icon="showPassword ? eyeOffOutline : eyeOutline"
              @click="toggleShowPassword"
              class="password-toggle-icon"
            ></ion-icon>
          </ion-item>
        </div>

        <!-- Remember Me and Forgot Password -->
        <div class="remember-forgot-row">
          <ion-checkbox
            v-model="rememberMe"
            label-placement="end"
            class="remember-me-checkbox"
          >
            <span class="remember-me-label">Remember Me</span>
          </ion-checkbox>
          <ion-text class="forgot-password-link" @click="forgotPassword">
            Forgot Password
          </ion-text>
        </div>

        <!-- Sign In Button -->
        <ion-button
          expand="block"
          type="submit"
          class="primary-signin-button"
          :disabled="isLoggingIn"
        >
          <ion-spinner v-if="isLoggingIn" name="crescent"></ion-spinner>
          <span v-else>Sign In</span>
        </ion-button>
      </form>

      <!-- Sign Up link -->
      <div class="signup-link-container">
        <ion-text>
          Don't have Account?
          <span class="sign-up-link" @click="goToSignup">Sign Up</span>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonCheckbox,
  useIonRouter,
  loadingController,
  IonSpinner,
  IonItem,
} from "@ionic/vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { eyeOutline, eyeOffOutline, chevronDownOutline } from "ionicons/icons";
import wujoLogo from "@/assets/img/wujo-logo.png";

const store = useStore();
const ionRouter = useIonRouter();

// Reactive form variables
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoggingIn = ref(false); // State for the loader

const errorMessage = computed(() => store.state.auth.error);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const goToSignup = () => {
  ionRouter.push("/signup", "forward"); // No need for 'none' unless specified
};

const forgotPassword = () => {
  console.log("Forgot Password link clicked");
};

const login = async () => {
  if (username.value === "" || password.value === "") {
    store.commit("auth/setAuthError", "Please enter phone and password.");
    return;
  }

  isLoggingIn.value = true;
  const loading = await loadingController.create({
    message: "Signing In...",
    spinner: "crescent",
    translucent: true,
    cssClass: "wujo-loader",
  });
  await loading.present();

  try {
    await store.dispatch("auth/login", {
      phone: username.value,
      password: password.value,
    });

    await store.dispatch("auth/fetchUser");
    const user = store.getters["auth/getUser"];

    if (user && user.role) {
      const path =
        user.role === "collector"
          ? "/collector/dashboard"
          : "/member/dashboard";
      ionRouter.push(path, "root");
    } else {
      ionRouter.push("/home", "root");
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    // Error is already set by the Vuex action, no need to set it here
  } finally {
    isLoggingIn.value = false;
    await loading.dismiss();
  }
};
</script>

<style scoped>
/* Use the custom CSS variables for consistent colors */
/* Ensure these are defined globally in variables.css or locally here */
:root {
  --ion-color-wujo-primary: #006a52; /* A dark green */
  --ion-color-wujo-primary-rgb: 0, 106, 82;
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  /* Add horizontal padding to the content */
  --padding-start: 20px;
  --padding-end: 20px;
  display: block; /* Allow content to flow */
}

/* Styling for the logo container (reused from signup) */
.logo-container {
  display: flex;
  justify-content: center;
  padding-top: 40px; /* Space above logo */
  margin-bottom: 40px; /* Space below logo before form */
}

.wujo-logo {
  width: 100px; /* Adjust size as needed */
  height: auto;
}

.login-form {
  margin-bottom: 30px; /* Space between form and signup link */
}

/* Styling for each form field block (label + input/options) (reused) */
.form-field {
  margin-bottom: 20px; /* Space between form fields */
}

.field-label {
  display: block; /* Make label take its own line */
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey); /* Grey label text */
  margin-bottom: 8px; /* Space between label and input */
  font-weight: normal; /* Standard weight for label */
}

/* Use ion-item as the wrapper */
.input-wrapper {
  --border-color: var(--ion-color-wujo-grey); /* Default border color */
  --border-radius: 8px;
  --border-width: 1px;
  --padding-start: 12px;
  --inner-padding-end: 12px;
  --background: white;
  --highlight-height: 0; /* Remove default bottom highlight */
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* THIS IS THE KEY FOR THE BLINKER AND FOCUS HIGHLIGHT */
.input-wrapper.item-focused {
  --border-color: var(--ion-color-wujo-primary);
  box-shadow: 0 0 0 2px rgba(0, 106, 82, 0.2);
}

.input-wrapper ion-input {
  /* The caret color will now be inherited correctly */
  --color: #333;
}

.country-code {
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: #333;
  font-size: 16px;
}
.country-code .flag-icon {
  width: 24px;
  margin-right: 5px;
}
.country-code ion-icon {
  font-size: 18px;
  margin-right: 5px;
  color: var(--ion-color-wujo-text-grey);
}

.password-toggle-icon {
  font-size: 22px;
  color: var(--ion-color-wujo-text-grey);
  cursor: pointer;
}

.remember-forgot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.remember-me-checkbox {
  --size: 18px;
  --checkbox-background-checked: var(--ion-color-wujo-primary);
}
.remember-me-label {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
}
.forgot-password-link {
  font-size: 14px;
  color: var(--ion-color-wujo-primary);
  cursor: pointer;
}

.primary-signin-button {
  --background: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  text-transform: none;
  height: 50px;
}

.signup-link-container {
  text-align: center;
  margin-top: 20px;
}
.signup-link-container ion-text {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
}
.sign-up-link {
  color: var(--ion-color-wujo-primary);
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
}

/* Custom loader style */
:global(.wujo-loader) {
  --background: rgba(255, 255, 255, 0.8);
  --spinner-color: var(--ion-color-wujo-primary);
}
</style>
