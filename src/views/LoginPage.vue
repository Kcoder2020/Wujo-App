<template>
  <ion-page>
    <!-- Enhanced Header with Gradient -->
    <ion-header class="login-header">
      <ion-toolbar class="transparent-toolbar">
        <template #start>
          <ion-buttons>
            <ion-button @click="goBack" fill="clear">
              <ion-icon :icon="arrowBack" color="light"></ion-icon>
            </ion-button>
          </ion-buttons>
        </template>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="login-content">
      <!-- Hero Section with Wujo Branding -->
      <div class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="logo-container">
            <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
          </div>
          <h1 class="hero-title">Welcome Back</h1>
          <p class="hero-subtitle">Sign in to continue your savings journey</p>
        </div>
      </div>

      <!-- Form Container -->
      <div class="form-container">
        <form @submit.prevent="login" class="login-form">
          <!-- Phone Input with E.164 Validation -->
          <div class="input-group">
            <ion-item
              :class="{
                'item-has-focus': focusedField === 'phone',
                'item-has-value': username,
                'item-has-error': fieldErrors.phone,
              }"
              lines="none"
            >
              <ion-label position="stacked">
                Phone Number <span class="required">*</span>
              </ion-label>
              <div class="phone-input-wrapper">
                <div class="country-selector">
                  <img
                    src="@/assets/img/ethiopia-flag.png"
                    alt="ET"
                    class="flag-icon"
                  />
                  <span class="country-code">+251</span>
                </div>
                <ion-input
                  v-model="username"
                  type="tel"
                  placeholder="911110000"
                  @ionFocus="focusedField = 'phone'"
                  @ionBlur="focusedField = ''"
                  @ionInput="validatePhone"
                  :class="{ 'input-error': fieldErrors.phone }"
                  :maxlength="10"
                ></ion-input>
                <ion-icon
                  v-if="username && !fieldErrors.phone && isPhoneValid"
                  :icon="checkmarkCircle"
                  color="success"
                  class="validation-icon"
                ></ion-icon>
              </div>
            </ion-item>
            <div v-if="fieldErrors.phone" class="field-error">
              {{ fieldErrors.phone }}
            </div>
            <div v-else-if="username" class="phone-preview">
              <ion-icon :icon="call" color="medium"></ion-icon>
              <span>{{ formatPhonePreview }}</span>
            </div>
          </div>

          <!-- Password Input -->
          <div class="input-group">
            <ion-item
              :class="{
                'item-has-focus': focusedField === 'password',
                'item-has-value': password,
                'item-has-error': fieldErrors.password,
              }"
              lines="none"
            >
              <ion-label position="stacked">
                Password <span class="required">*</span>
              </ion-label>
              <ion-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                @ionFocus="focusedField = 'password'"
                @ionBlur="focusedField = ''"
                @ionInput="validatePassword"
                :class="{ 'input-error': fieldErrors.password }"
              ></ion-input>
              <template #end>
                <ion-button
                  fill="clear"
                  @click="toggleShowPassword"
                  class="password-toggle"
                >
                  <ion-icon
                    :icon="showPassword ? eyeOffOutline : eyeOutline"
                    color="medium"
                  ></ion-icon>
                </ion-button>
              </template>
            </ion-item>
            <div v-if="fieldErrors.password" class="field-error">
              {{ fieldErrors.password }}
            </div>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="remember-forgot-row">
            <ion-checkbox v-model="rememberMe" class="remember-me-checkbox">
              <span class="remember-me-label">Remember Me</span>
            </ion-checkbox>
            <ion-text class="forgot-password-link" @click="forgotPassword">
              Forgot Password?
            </ion-text>
          </div>

          <!-- Error Display -->
          <ion-card v-if="errorMessage" class="error-card">
            <ion-card-content>
              <div class="error-content">
                <ion-icon :icon="alertCircle" color="danger"></ion-icon>
                <div>
                  <h4>Login Failed</h4>
                  <p>{{ errorMessage }}</p>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Sign In Button - Thumb Zone Optimized -->
          <ion-button
            expand="block"
            type="submit"
            class="primary-signin-button"
            :disabled="isLoggingIn || !isFormValid"
          >
            <template #start>
              <ion-icon v-if="!isLoggingIn" :icon="logIn"></ion-icon>
            </template>
            <ion-spinner v-if="isLoggingIn" name="crescent"></ion-spinner>
            <span v-else>Sign In</span>
          </ion-button>

          <!-- Biometric Login Option (Future Enhancement) -->
          <div class="biometric-section">
            <div class="divider">
              <span>or</span>
            </div>
            <ion-button
              fill="outline"
              expand="block"
              class="biometric-button"
              disabled
            >
              <template #start>
                <ion-icon :icon="fingerPrint"></ion-icon>
              </template>
              Sign in with Biometrics
            </ion-button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="signup-link-container">
          <p>
            Don't have an account?
            <span class="sign-up-link" @click="goToSignup">Sign Up</span>
          </p>
        </div>

        <!-- Terms and Privacy -->
        <div class="terms-section">
          <p class="terms-text">
            By signing in, you agree to our
            <a href="#" class="terms-link">Terms of Service</a> and
            <a href="#" class="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonCheckbox,
  IonCard,
  IonCardContent,
  useIonRouter,
  loadingController,
  IonSpinner,
  IonItem,
} from "@ionic/vue";
import { useStore } from "vuex";
import {
  eyeOutline,
  eyeOffOutline,
  checkmarkCircle,
  alertCircle,
  call,
  logIn,
  fingerPrint,
  arrowBack,
} from "ionicons/icons";
import wujoLogo from "@/assets/img/icon2.svg";

const store = useStore();
const ionRouter = useIonRouter();

// Form state
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoggingIn = ref(false);
const focusedField = ref("");

// Field validation errors
const fieldErrors = ref({
  phone: "",
  password: "",
});

// Phone validation utilities (E.164 format for Ethiopia)
const formatPhoneToE164 = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Case 1: Already starts with 251 (country code without +)
  if (cleaned.startsWith("251")) {
    return `+${cleaned}`;
  }

  // Case 2: 10 digits starting with 09 or 07
  if (
    cleaned.length === 10 &&
    (cleaned.startsWith("09") || cleaned.startsWith("07"))
  ) {
    // Strip the leading 0 and add +251
    return `+251${cleaned.substring(1)}`;
  }

  // Case 3: 9 digits starting with 9 or 7
  if (
    cleaned.length === 9 &&
    (cleaned.startsWith("9") || cleaned.startsWith("7"))
  ) {
    return `+251${cleaned}`;
  }

  // Case 4: If it's already in a valid format, return as is
  if (cleaned.length === 12 && cleaned.startsWith("251")) {
    return `+${cleaned}`;
  }

  // Default: assume it needs +251 prefix
  return `+251${cleaned}`;
};

const validatePhoneFormat = (phone: string): boolean => {
  const e164Phone = formatPhoneToE164(phone);
  // Ethiopian phone numbers: +251 followed by 9 digits (starting with 9 or 7)
  const ethiopianPhoneRegex = /^\+251[97]\d{8}$/;
  return ethiopianPhoneRegex.test(e164Phone);
};

// Computed properties
const isPhoneValid = computed(() => {
  if (!username.value) return false;
  return validatePhoneFormat(username.value);
});

const formatPhonePreview = computed(() => {
  if (!username.value) return "";
  try {
    return formatPhoneToE164(username.value);
  } catch {
    return username.value;
  }
});

const isFormValid = computed(() => {
  return (
    username.value &&
    password.value &&
    isPhoneValid.value &&
    !fieldErrors.value.phone &&
    !fieldErrors.value.password
  );
});

const errorMessage = computed(() => store.state.auth.error);

// Validation methods
const validatePhone = () => {
  if (!username.value) {
    fieldErrors.value.phone = "Phone number is required";
  } else if (!validatePhoneFormat(username.value)) {
    fieldErrors.value.phone = "Please enter a valid Ethiopian phone number";
  } else {
    fieldErrors.value.phone = "";
  }
};

const validatePassword = () => {
  if (!password.value) {
    fieldErrors.value.password = "Password is required";
  } else if (password.value.length < 8) {
    fieldErrors.value.password = "Password must be at least 8 characters";
  } else {
    fieldErrors.value.password = "";
  }
};

// UI interaction methods
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const goBack = () => {
  ionRouter.push("/onboarding", "back");
};

const goToSignup = () => {
  ionRouter.push("/signup", "forward");
};

const forgotPassword = () => {
  console.log("Forgot Password link clicked");
  // TODO: Implement forgot password flow
};

// Login handler
const login = async () => {
  // Validate all fields
  validatePhone();
  validatePassword();

  if (!isFormValid.value) {
    store.commit("auth/setAuthError", "Please fix the errors and try again.");
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
    // Format phone to E.164 before sending
    const formattedPhone = formatPhoneToE164(username.value);

    console.log("Attempting login with phone:", formattedPhone);

    await store.dispatch("auth/login", {
      phone: formattedPhone,
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

    // Handle validation errors from backend
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      if (backendErrors.phone) {
        fieldErrors.value.phone = backendErrors.phone[0];
      }
      if (backendErrors.password) {
        fieldErrors.value.password = backendErrors.password[0];
      }
    }
    // Error message is already set by the Vuex action
  } finally {
    isLoggingIn.value = false;
    await loading.dismiss();
  }
};
</script>

<style scoped>
/* ===== WUJO BRAND IDENTITY - TRUSTWORTHY FUTURISTIC FINTECH UI ===== */

/* Header Enhancement */
.login-header {
  --background: transparent;
}

.transparent-toolbar {
  --background: transparent;
  --border-width: 0;
}

/* Content with Gradient Background */
.login-content {
  --background: linear-gradient(
    180deg,
    var(--ion-color-dark-green) 0%,
    var(--ion-color-dark-green-tint) 35%,
    var(--ion-color-white-smoke) 35%,
    var(--ion-color-white-smoke) 100%
  );
}

/* Hero Section - Premium Card Feel */
.hero-section {
  position: relative;
  padding: 60px 24px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green) 0%,
    var(--ion-color-dark-green-shade) 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  opacity: 0.95;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.logo-container {
  margin-bottom: 32px;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wujo-logo {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  box-shadow: 0 12px 48px rgba(95, 217, 172, 0.3);
  background: white;
  padding: 12px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 16px;
  color: var(--ion-color-medium-aquamarine);
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
}

/* Form Container - Premium Card Style */
.form-container {
  background: white;
  border-radius: 32px 32px 0 0;
  margin-top: -50px;
  position: relative;
  z-index: 3;
  box-shadow: 0 -8px 48px rgba(1, 64, 35, 0.15);
  min-height: calc(100vh - 280px);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  padding: 40px 24px 32px;
}

/* Input Groups - Mobile-First Design */
.input-group {
  margin-bottom: 24px;
}

.required {
  color: var(--ion-color-danger);
  font-weight: 600;
}

/* Enhanced Ion Items - Wujo Style */
ion-item {
  --background: var(--ion-color-white-smoke);
  --border-radius: 16px;
  --padding-start: 20px;
  --padding-end: 20px;
  --inner-padding-end: 0;
  --min-height: 64px;
  margin-bottom: 4px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-item.item-has-focus {
  --background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 0 0 4px rgba(95, 217, 172, 0.15);
  transform: translateY(-2px);
}

ion-item.item-has-error {
  border-color: var(--ion-color-danger);
  --background: rgba(var(--ion-color-danger-rgb), 0.05);
}

ion-item.item-has-value {
  --background: white;
  border-color: rgba(1, 64, 35, 0.1);
}

ion-label {
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
  font-size: 14px;
  letter-spacing: 0.3px;
}

ion-input {
  font-size: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --color: var(--ion-color-dark-green);
  font-weight: 500;
}

ion-input.input-error {
  --color: var(--ion-color-danger);
}

.validation-icon {
  font-size: 22px;
  margin-left: 8px;
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.field-error {
  color: var(--ion-color-danger);
  font-size: 12px;
  margin-top: 6px;
  margin-left: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Phone Input - Ethiopian E.164 Format */
.phone-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.country-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--ion-color-dark-green);
  padding: 12px 16px;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(1, 64, 35, 0.2);
}

.flag-icon {
  width: 22px;
  height: 16px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.country-code {
  font-weight: 700;
  color: white;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.phone-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-left: 20px;
  font-size: 13px;
  color: var(--ion-color-medium-aquamarine);
  font-weight: 500;
}

/* Password Toggle */
.password-toggle {
  --color: var(--ion-color-medium);
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}

/* Remember Me & Forgot Password */
.remember-forgot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 8px;
}

.remember-me-checkbox {
  --size: 20px;
  --checkbox-background-checked: var(--ion-color-medium-aquamarine);
  --border-color-checked: var(--ion-color-medium-aquamarine);
  --checkmark-color: var(--ion-color-dark-green);
}

.remember-me-label {
  font-size: 14px;
  color: var(--ion-color-dark-green);
  font-weight: 500;
  margin-left: 8px;
}

.forgot-password-link {
  font-size: 14px;
  color: var(--ion-color-medium-aquamarine);
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;
}

.forgot-password-link:active {
  color: var(--ion-color-dark-green);
}

/* Error Card - Premium Style */
.error-card {
  margin: 0 0 24px 0;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(var(--ion-color-danger-rgb), 0.15);
  border-left: 4px solid var(--ion-color-danger);
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-content ion-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-danger);
}

.error-content p {
  margin: 0;
  font-size: 13px;
  color: var(--ion-color-medium);
  line-height: 1.4;
}

/* Primary Sign In Button - Thumb Zone Optimized */
.primary-signin-button {
  --background: var(--ion-color-medium-aquamarine);
  --background-activated: var(--ion-color-medium-aquamarine-shade);
  --background-hover: var(--ion-color-medium-aquamarine-shade);
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  font-weight: 700;
  text-transform: none;
  height: 56px;
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
  --color: var(--ion-color-dark-green);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.primary-signin-button:not([disabled]):active {
  transform: scale(0.98);
}

.primary-signin-button[disabled] {
  --background: rgba(95, 217, 172, 0.3);
  --box-shadow: none;
}

/* Biometric Section */
.biometric-section {
  margin-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(1, 64, 35, 0.1);
}

.divider span {
  padding: 0 16px;
  color: var(--ion-color-medium);
  font-size: 13px;
  font-weight: 500;
}

.biometric-button {
  --border-color: rgba(1, 64, 35, 0.2);
  --border-width: 2px;
  --border-radius: 16px;
  --color: var(--ion-color-dark-green);
  height: 56px;
  font-weight: 600;
  text-transform: none;
  margin-bottom: 24px;
}

.biometric-button[disabled] {
  opacity: 0.4;
}

/* Sign Up Link */
.signup-link-container {
  text-align: center;
  padding: 24px 0;
}

.signup-link-container p {
  font-size: 15px;
  color: var(--ion-color-dark-green);
  margin: 0;
  font-weight: 500;
}

.sign-up-link {
  color: var(--ion-color-medium-aquamarine);
  font-weight: 700;
  cursor: pointer;
  margin-left: 6px;
  transition: color 0.2s ease;
}

.sign-up-link:active {
  color: var(--ion-color-dark-green);
}

/* Terms Section */
.terms-section {
  text-align: center;
  padding: 0 24px 32px;
}

.terms-text {
  font-size: 12px;
  color: var(--ion-color-medium);
  line-height: 1.5;
  margin: 0;
}

.terms-link {
  color: var(--ion-color-medium-aquamarine);
  text-decoration: none;
  font-weight: 600;
}

.terms-link:active {
  color: var(--ion-color-dark-green);
}

/* Custom Loader */
:global(.wujo-loader) {
  --background: rgba(1, 64, 35, 0.95);
  --spinner-color: var(--ion-color-medium-aquamarine);
}

/* Mobile Optimization - Thumb Zone */
@media (max-height: 667px) {
  .hero-section {
    padding: 40px 24px 60px;
  }

  .hero-title {
    font-size: 28px;
  }

  .login-form {
    padding: 32px 24px 24px;
  }

  .input-group {
    margin-bottom: 20px;
  }
}

/* Haptic Feedback Simulation */
.primary-signin-button:active,
.biometric-button:active,
.sign-up-link:active,
.forgot-password-link:active {
  opacity: 0.8;
}
</style>
