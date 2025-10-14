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
      <form @submit.prevent="signup" class="signup-form">
        <!-- Full Name -->
        <div class="form-field">
          <ion-label class="field-label">Full Name</ion-label>
          <div class="input-wrapper">
            <ion-input
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
            ></ion-input>
          </div>
        </div>

        <!-- Email Address (Optional) -->
        <div class="form-field">
          <ion-label class="field-label">Email</ion-label>
          <div class="input-wrapper">
            <ion-input
              v-model="email"
              type="email"
              placeholder="Email Address(Optional)"
            ></ion-input>
          </div>
        </div>

        <!-- Gender (Radio Buttons) -->
        <div class="form-field">
          <ion-label class="field-label">Gender</ion-label>
          <div class="gender-options">
            <label class="radio-option">
              <input type="radio" value="male" v-model="gender" />
              <span class="radio-custom"></span>
              Male
            </label>
            <label class="radio-option">
              <input type="radio" value="female" v-model="gender" />
              <span class="radio-custom"></span>
              Female
            </label>
          </div>
        </div>

        <!-- Select Role (Dropdown) -->
        <div class="form-field">
          <ion-label class="field-label">Select Role</ion-label>
          <div class="input-wrapper select-wrapper">
            <ion-select v-model="role" placeholder="Select Role">
              <ion-select-option value="collector">Collector</ion-select-option>
              <!-- Using "Iquber" as seen in design -->
              <ion-select-option value="member">Member</ion-select-option>
            </ion-select>
          </div>
        </div>

        <!-- Phone (Custom Input) -->
        <div class="form-field">
          <ion-label class="field-label">Phone</ion-label>
          <div class="input-wrapper phone-wrapper">
            <!-- Ethiopia Flag & Code -->
            <div class="country-code">
              <!-- Replace with a proper flag component or SVG if available -->
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
            <ion-input v-model="phone" type="tel" placeholder=""></ion-input>
          </div>
        </div>

        <!-- Referral Code (Optional) -->
        <div class="form-field">
          <ion-label class="field-label">Referal Code</ion-label>
          <!-- Corrected typo -->
          <div class="input-wrapper">
            <ion-input
              v-model="referralCode"
              type="text"
              placeholder="Your Referal code(Optional)"
            ></ion-input>
            <!-- Corrected typo -->
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

        <!-- Confirm Password -->
        <div class="form-field">
          <ion-label class="field-label">Confirm Password</ion-label>
          <!-- Corrected typo -->
          <div class="input-wrapper password-wrapper">
            <ion-input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
            ></ion-input>
            <ion-icon
              :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
              @click="toggleShowConfirmPassword"
              class="password-toggle-icon"
            ></ion-icon>
          </div>
        </div>

        <!-- Sign Up Button -->
        <ion-button
          expand="block"
          type="submit"
          class="primary-signup-button"
          :disabled="!isFormValid"
        >
          <ion-icon :icon="personOutline"></ion-icon>
          <!-- Person icon -->
          Sign Up
        </ion-button>
      </form>

      <!-- Already a member? Sign In link -->
      <div class="login-link-container">
        <ion-text>
          Already a member?
          <span class="sign-in-link" @click="goToLogin">Sign In</span>
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
  // Removed IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonRadioGroup, IonRadio
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon, // Added for icons
  IonText, // Added for text
} from "@ionic/vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Import icons
import {
  eyeOutline,
  eyeOffOutline,
  chevronDownOutline,
  personOutline,
} from "ionicons/icons";

// Import logo and potentially flag (you'll need an Ethiopia flag image)
import wujoLogo from "@/assets/img/wujo-logo.png";
// You might need to add an Ethiopia flag image
// import ethiopiaFlag from "@/assets/img/ethiopia-flag.png"; // Make sure you have this file

const store = useStore();
const router = useRouter();

// Reactive form variables
const fullName = ref("");
const email = ref("");
const gender = ref(""); // 'male' or 'female'
const role = ref(""); // 'collector' or 'member'
const phone = ref("");
const referralCode = ref("");
const password = ref("");
const confirmPassword = ref("");

// State for password visibility
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Error message from store
const errorMessage = computed(() => store.state.auth.error); // Assuming the error is stored here

// Computed property for form validation
const isFormValid = computed(() => {
  // Basic check: Required fields are not empty and passwords match
  return (
    fullName.value !== "" &&
    phone.value !== "" &&
    gender.value !== "" &&
    role.value !== "" &&
    password.value !== "" &&
    confirmPassword.value !== "" &&
    password.value === confirmPassword.value
    // Email and referralCode are optional, so no check needed here
  );
});

// Toggle password visibility
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const goToLogin = () => {
  console.log("Login link clicked");
  router.push("/login"); // Navigate to your login page route
};

const signup = async () => {
  if (!isFormValid.value) {
    // You might want a more user-friendly validation feedback here
    console.error("Form is not valid");
    return;
  }

  try {
    // Dispatch signup action with all required fields
    await store.dispatch("auth/signup", {
      name: fullName.value, // Assuming 'name' is used in backend for full name
      username: phone.value, // Assuming phone is used as username as in login screen design
      password: password.value,
      password_confirmation: confirmPassword.value,
      email: email.value, // Include optional fields
      phone: phone.value, // Pass phone explicitly if needed in backend
      gender: gender.value,
      role: role.value,
      referral_code: referralCode.value, // Include optional fields
    });

    // After successful signup, fetch user and redirect based on role
    await store.dispatch("auth/fetchUser");
    let user = store.getters["auth/getUser"];

    if (user && user.role) {
      if (user.role === "collector") {
        router.push("/collector-dashboard");
      } else if (user.role === "member") {
        router.push("/member-dashboard");
      } else {
        router.push("/home"); // Fallback
      }
    } else {
      // Handle cases where user or role is not immediately available
      console.warn(
        "User data or role not available after signup, redirecting to default."
      );
      router.push("/home"); // Or a page indicating pending status
    }
  } catch (error: any) {
    // Update error message state
    console.error("Signup failed:", error);
    errorMessage.value =
      error.response?.data?.message || error.message || "Signup failed.";
  }
};
</script>

<style scoped>
/* Use the custom CSS variables for consistent colors */
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

/* Styling for the logo container */
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

.signup-form {
  margin-bottom: 30px; /* Space between form and login link */
}

/* Styling for each form field block (label + input/options) */
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

/* Wrapper for the input fields (adds border, padding, etc.) */
.input-wrapper {
  border: 1px solid var(--ion-color-wujo-grey); /* Grey border */
  border-radius: 8px; /* Rounded corners */
  padding: 0 12px; /* Internal padding */
  background: white; /* White background for input area */
  display: flex; /* Use flex for aligning input and icons */
  align-items: center; /* Vertically center items */
}

/* Reset default styles for Ionic inputs inside our wrapper */
.input-wrapper ion-input,
.input-wrapper ion-select {
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

/* Specific styling for the select dropdown */
.select-wrapper ion-select {
  /* Adjust alignment if needed */
  padding-top: 0;
  padding-bottom: 0;
}

/* Styling for Gender radio buttons */
.gender-options {
  display: flex; /* Arrange options horizontally */
  gap: 20px; /* Space between Male and Female options */
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333; /* Darker text for option label */
}

.radio-option input[type="radio"] {
  display: none; /* Hide default radio button */
}

/* Custom radio button appearance */
.radio-custom {
  width: 20px; /* Size of the custom radio circle */
  height: 20px;
  border: 2px solid var(--ion-color-wujo-grey); /* Default border */
  border-radius: 50%; /* Make it circular */
  margin-right: 8px; /* Space between circle and text */
  position: relative;
  transition: all 0.2s ease-in-out;
}

/* Inner dot for the custom radio button */
.radio-custom::after {
  content: "";
  width: 10px; /* Size of the inner dot */
  height: 10px;
  background: var(--ion-color-wujo-primary); /* Green dot color */
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0; /* Hidden by default */
  transition: opacity 0.2s ease-in-out;
}

/* State when radio is checked */
.radio-option input[type="radio"]:checked + .radio-custom {
  border-color: var(--ion-color-wujo-primary); /* Green border when checked */
}

.radio-option input[type="radio"]:checked + .radio-custom::after {
  opacity: 1; /* Show inner dot when checked */
}

/* Styling for Phone input */
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

/* Styling for Password input with toggle icon */
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

/* Styling for the Sign Up button */
.primary-signup-button {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(
    --ion-color-wujo-primary
  ); /* Keep green on active */
  --border-radius: 12px; /* Rounded corners */
  font-weight: bold;
  color: white;
  text-transform: capitalize; /* Capitalize text */
  height: 50px; /* Consistent button height */
  margin-top: 30px; /* Space above the button */
  --padding-start: 20px; /* Add padding for icon */
  --padding-end: 20px; /* Add padding */
  /* Center button if it's not expand="block" */
  display: block; /* ensures it takes full width */
  margin-left: auto;
  margin-right: auto;
}

.primary-signup-button ion-icon {
  font-size: 24px;
  margin-right: 8px; /* Space between icon and text */
}

/* Styling for the "Already a member? Sign In" link */
.login-link-container {
  text-align: center; /* Center the text */
  margin-top: 20px; /* Space above the link */
  margin-bottom: 20px; /* Space below */
}

.login-link-container ion-text {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey); /* Grey base text color */
}

.sign-in-link {
  color: var(--ion-color-wujo-primary); /* Green color for "Sign In" */
  font-weight: bold; /* Make it bold */
  cursor: pointer; /* Indicate it's clickable */
  margin-left: 4px; /* Space between "member?" and "Sign In" */
}
</style>
