<template>
  <ion-page>
    <!-- No ion-header needed based on design -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Logo at the top -->
      <div class="logo-container">
        <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
      </div>

      <!-- Error display -->
      <error-display :error-message="errorMessage" />

      <!-- Use a form element for semantic correctness -->
      <form @submit.prevent="login" class="login-form">
        <!-- Phone (Custom Input with flag/code) -->
        <div class="form-field">
          <ion-label class="field-label">Phone</ion-label>
          <div class="input-wrapper phone-wrapper">
            <!-- Ethiopia Flag & Code -->
            <div class="country-code">
              <!-- Replace with a proper flag component or SVG if available -->
              <!-- Assuming ethiopia-flag.png is in assets/img -->
              <img
                src="@/assets/img/ethiopia-flag.png"
                alt="Ethiopia Flag"
                class="flag-icon"
              />
              <ion-icon :icon="chevronDownOutline"></ion-icon>
              <!-- Down arrow icon -->
              <span>+251</span>
            </div>
            <!-- Phone Number Input -->
            <!-- Keeping 'username' ref as it's used in the login action payload -->
            <ion-input v-model="username" type="tel" placeholder=""></ion-input>
          </div>
        </div>

        <!-- Password -->
        <div class="form-field">
          <ion-label class="field-label">Password</ion-label>
          <div class="input-wrapper password-wrapper">
            <ion-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
            ></ion-input>
            <ion-icon
              :icon="showPassword ? eyeOffOutline : eyeOutline"
              @click="toggleShowPassword"
              class="password-toggle-icon"
            ></ion-icon>
          </div>
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
        <ion-button expand="block" type="submit" class="primary-signin-button">
          <ion-icon :icon="refreshOutline"></ion-icon>
          <!-- Refresh/Sign In icon -->
          Sign In
        </ion-button>
      </form>

      <!-- Don't have Account? Sign Up link -->
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
// Use <script setup> for a cleaner syntax in Vue 3
import { ref, computed } from "vue";
import {
  IonPage,
  // Removed IonHeader, IonToolbar, IonTitle, IonList, IonItem
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon, // Added for icons
  IonText, // Added for text
  IonCheckbox, // Added for checkbox
} from "@ionic/vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Import icons
import {
  eyeOutline,
  eyeOffOutline,
  chevronDownOutline,
  refreshOutline,
} from "ionicons/icons";

// Import logo and potentially flag (you'll need an Ethiopia flag image)
import wujoLogo from "@/assets/img/wujo-logo.png";
// You must add an Ethiopia flag image to your assets folder
// import ethiopiaFlag from "@/assets/img/ethiopia-flag.png"; // Make sure you have this file

const store = useStore();
const router = useRouter();

// Reactive form variables
const username = ref(""); // Used for the phone number input based on your signup implementation
const password = ref("");
const rememberMe = ref(false);

// State for password visibility
const showPassword = ref(false);

// Error message from store
const errorMessage = computed(() => store.state.auth.error); // Assuming the error is stored here

// Toggle password visibility
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const goToSignup = () => {
  console.log("Sign Up link clicked");
  router.push("/signup"); // Navigate to your signup page route
};

const forgotPassword = () => {
  console.log("Forgot Password link clicked");
  // Implement navigation or modal for password reset
  // router.push("/forgot-password"); // Example navigation
};

const login = async () => {
  // Basic validation
  if (username.value === "" || password.value === "") {
    errorMessage.value = "Please enter phone and password.";
    return;
  }

  try {
    // Dispatch login action (your existing logic)
    await store.dispatch("auth/login", {
      phone: username.value, // Sending phone as username to the backend
      password: password.value,
      // You might pass rememberMe.value if your backend supports it
      // rememberMe: rememberMe.value,
    });

    // Fetch user and redirect based on role (your existing logic)
    await store.dispatch("auth/fetchUser");
    let user = store.getters["auth/getUser"];

    console.log("User logged here --> ", user);

    if (store.getters["auth/getUser"].id === 21) {
      let joined_iqubs = store.getters["auth/getUser"].joined_iqubs;
      store.dispatch("iqubs/setIqubs", joined_iqubs);
    }

    if (user && user.role) {
      if (user.role === "collector") {
        router.push("/collector-dashboard");
      } else if (user.role === "member") {
        router.push("/member-dashboard");
      } else {
        router.push("/home"); // Fallback
      }
    } else {
      console.warn(
        "User data or role not available after login, redirecting to default."
      );
      router.push("/home"); // Or handle this state appropriately
    }
  } catch (error: any) {
    // Update error message state
    console.error("Login failed:", error);
    // Check if error.response exists before accessing data
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please check your credentials.";
    // Clear the error message after a few seconds (optional)
    // setTimeout(() => { errorMessage.value = ''; }, 5000);
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

/* Wrapper for the input fields (adds border, padding, etc.) (reused) */
.input-wrapper {
  border: 1px solid var(--ion-color-wujo-grey); /* Grey border */
  border-radius: 8px; /* Rounded corners */
  padding: 0 12px; /* Internal padding */
  background: white; /* White background for input area */
  display: flex; /* Use flex for aligning input and icons */
  align-items: center; /* Vertically center items */
}

/* Reset default styles for Ionic inputs inside our wrapper (reused) */
.input-wrapper ion-input {
  --padding-start: 0; /* Remove default ionic input padding */
  --padding-end: 0;
  --padding-top: 10px; /* Add some vertical padding */
  --padding-bottom: 10px; /* Add some vertical padding */
  --background: transparent; /* Use wrapper background */
  --highlight-color-focused: transparent; /* Remove focus highlight */
  --highlight-color-valid: transparent;
  --highlight-color-invalid: transparent;
  width: 100%; /* Make input take available space */
  flex-grow: 1; /* Allow input to grow */
}

/* Styling for Phone input (reused) */
.phone-wrapper {
  display: flex;
  align-items: center;
}

.country-code {
  display: flex;
  align-items: center;
  margin-right: 10px; /* Space between country code and input */
  color: #333;
  font-size: 16px;
}

.country-code .flag-icon {
  width: 24px; /* Size of the flag */
  height: auto;
  margin-right: 5px; /* Space between flag and arrow */
}

.country-code ion-icon {
  font-size: 18px;
  margin-right: 5px; /* Space between arrow and code */
  color: var(--ion-color-wujo-text-grey); /* Grey icon */
}

/* Styling for Password input with toggle icon (reused) */
.password-wrapper {
  display: flex;
  align-items: center;
}

.password-wrapper ion-input {
  flex-grow: 1; /* Allow input to take available space */
  /* Keep padding from .input-wrapper */
}

.password-toggle-icon {
  font-size: 22px;
  color: var(--ion-color-wujo-text-grey); /* Grey icon */
  cursor: pointer;
  margin-left: 10px; /* Space between input and icon */
}

/* Styling for Remember Me and Forgot Password row */
.remember-forgot-row {
  display: flex;
  justify-content: space-between; /* Push items to the ends */
  align-items: center;
  margin-top: -10px; /* Adjust spacing from password field */
  margin-bottom: 20px; /* Space below this row */
}

.remember-me-checkbox {
  --size: 18px; /* Adjust checkbox size */
  --checkbox-background-checked: var(
    --ion-color-wujo-primary
  ); /* Green when checked */
  --checkmark-color: white;
  /* Adjust padding/margin to align with design */
  --padding-start: 0; /* Remove default padding */
  --padding-end: 0;
  margin-right: 10px; /* Space between checkbox and forgot link if needed */
}

.remember-me-label {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey); /* Grey text */
}

.forgot-password-link {
  font-size: 14px;
  color: var(--ion-color-wujo-primary); /* Green color for link */
  font-weight: normal; /* Standard weight */
  cursor: pointer;
}

/* Styling for the Sign In button */
.primary-signin-button {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(
    --ion-color-wujo-primary
  ); /* Keep green on active */
  --border-radius: 12px; /* Rounded corners */
  font-weight: bold;
  color: white;
  text-transform: capitalize; /* Capitalize text */
  height: 50px; /* Consistent button height */
  margin-top: 10px; /* Space above the button */
  /* Adjust horizontal padding for icon and text */
  --padding-start: 20px;
  --padding-end: 20px;
  /* Center button */
  display: block;
  margin-left: auto;
  margin-right: auto;
  /* Limit button width if expand="block" is too wide for large screens */
  max-width: 400px; /* Example max-width */
}

.primary-signin-button ion-icon {
  font-size: 24px;
  margin-right: 8px; /* Space between icon and text */
}

/* Styling for the "Don't have Account? Sign Up" link */
.signup-link-container {
  text-align: center; /* Center the text */
  margin-top: 20px; /* Space above the link */
  margin-bottom: 20px; /* Space below */
}

.signup-link-container ion-text {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey); /* Grey base text color */
}

.sign-up-link {
  color: var(--ion-color-wujo-primary); /* Green color for "Sign Up" */
  font-weight: bold; /* Make it bold */
  cursor: pointer; /* Indicate it's clickable */
  margin-left: 4px; /* Space between "Account?" and "Sign Up" */
}
</style>
