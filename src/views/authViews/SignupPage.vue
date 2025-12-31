<template>
  <ion-page>
    <!-- Enhanced Header with Gradient -->
    <ion-header class="signup-header-bar">
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

    <ion-content :fullscreen="true" class="signup-content">
      <!-- Hero Section with Wujo Branding -->
      <div class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="logo-container">
            <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
          </div>
          <h1 class="hero-title">Join Wujo</h1>
          <p class="hero-subtitle">
            Start your savings journey with Ethiopia's trusted ROSCA platform
          </p>
        </div>
      </div>

      <!-- Form Container - Premium Card Style -->
      <div class="form-container">
        <form @submit.prevent="submit" class="signup-form">
          <!-- Full Name -->
          <div class="input-group">
            <Field name="name" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
                }"
                lines="none"
              >
                <ion-label position="stacked">
                  Full Name <span class="required">*</span>
                </ion-label>
                <ion-input
                  v-bind="field"
                  type="text"
                  placeholder="Enter your full name"
                ></ion-input>
              </ion-item>
            </Field>
            <ErrorMessage name="name" class="field-error" />
          </div>

          <!-- Email (Optional) -->
          <div class="input-group">
            <Field name="email" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
                }"
                lines="none"
              >
                <ion-label position="stacked"> Email (Optional) </ion-label>
                <ion-input
                  v-bind="field"
                  type="email"
                  placeholder="Enter your email address"
                ></ion-input>
              </ion-item>
            </Field>
            <ErrorMessage name="email" class="field-error" />
          </div>

          <!-- Gender - Premium Card Style -->
          <div class="input-group">
            <label class="section-label">
              Gender <span class="required">*</span>
            </label>
            <Field name="gender" v-slot="{ field }">
              <div class="gender-selection">
                <div
                  class="gender-card"
                  :class="{ active: field.value === 'male' }"
                  @click="setFieldValue('gender', 'male')"
                >
                  <ion-icon :icon="man" class="gender-icon"></ion-icon>
                  <span>Male</span>
                </div>
                <div
                  class="gender-card"
                  :class="{ active: field.value === 'female' }"
                  @click="setFieldValue('gender', 'female')"
                >
                  <ion-icon :icon="woman" class="gender-icon"></ion-icon>
                  <span>Female</span>
                </div>
              </div>
            </Field>
            <ErrorMessage name="gender" class="field-error" />
          </div>

          <!-- Role - Premium Card Style -->
          <div class="input-group">
            <label class="section-label">
              Select Your Role <span class="required">*</span>
            </label>
            <Field name="role" v-slot="{ field }">
              <div class="role-selection">
                <div
                  class="role-card"
                  :class="{ active: field.value === 'collector' }"
                  @click="setFieldValue('role', 'collector')"
                >
                  <div class="role-icon">
                    <ion-icon :icon="people"></ion-icon>
                  </div>
                  <h3>Collector</h3>
                  <p>Organize and manage Iqubs</p>
                </div>
                <div
                  class="role-card"
                  :class="{ active: field.value === 'member' }"
                  @click="setFieldValue('role', 'member')"
                >
                  <div class="role-icon">
                    <ion-icon :icon="person"></ion-icon>
                  </div>
                  <h3>Member</h3>
                  <p>Join and participate in Iqubs</p>
                </div>
              </div>
            </Field>
            <ErrorMessage name="role" class="field-error" />
          </div>

          <!-- Phone - Ethiopian E.164 Format -->
          <div class="input-group">
            <Field name="phone" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
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
                    v-bind="field"
                    type="tel"
                    placeholder="911110000"
                    @ionInput="formatPhoneInput"
                    :maxlength="10"
                    inputmode="numeric"
                  ></ion-input>
                  <ion-icon
                    v-if="field.value && isPhoneValid(field.value)"
                    :icon="checkmarkCircle"
                    color="success"
                    class="validation-icon"
                  ></ion-icon>
                </div>
              </ion-item>
            </Field>
            <ErrorMessage name="phone" class="field-error" />
            <div class="phone-helper">
              <ion-icon
                :icon="informationCircle"
                class="helper-icon"
              ></ion-icon>
              <span>Enter your Ethiopian mobile number</span>
            </div>
          </div>

          <!-- Referral Code (Optional) -->
          <div class="input-group">
            <Field name="referral_code" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
                }"
                lines="none"
              >
                <ion-label position="stacked">
                  Referral Code (Optional)
                </ion-label>
                <ion-input
                  v-bind="field"
                  type="text"
                  placeholder="Enter referral code"
                ></ion-input>
              </ion-item>
            </Field>
            <ErrorMessage name="referral_code" class="field-error" />
          </div>

          <!-- Password -->
          <div class="input-group">
            <Field name="password" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
                }"
                lines="none"
              >
                <ion-label position="stacked">
                  Password <span class="required">*</span>
                </ion-label>
                <ion-input
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a strong password"
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
            </Field>
            <ErrorMessage name="password" class="field-error" />
          </div>

          <!-- Confirm Password -->
          <div class="input-group">
            <Field name="password_confirmation" v-slot="{ field, meta }">
              <ion-item
                :class="{
                  'item-has-focus': meta.touched,
                  'item-has-value': field.value,
                }"
                lines="none"
              >
                <ion-label position="stacked">
                  Confirm Password <span class="required">*</span>
                </ion-label>
                <ion-input
                  v-bind="field"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                ></ion-input>
                <template #end>
                  <ion-button
                    fill="clear"
                    @click="toggleShowConfirmPassword"
                    class="password-toggle"
                  >
                    <ion-icon
                      :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
                      color="medium"
                    ></ion-icon>
                  </ion-button>
                </template>
              </ion-item>
            </Field>
            <ErrorMessage name="password_confirmation" class="field-error" />
          </div>

          <!-- Sign Up Button - Thumb Zone Optimized -->
          <ion-button
            expand="block"
            type="submit"
            class="primary-signup-button"
            :disabled="isSigningUp"
          >
            <template #start>
              <ion-icon v-if="!isSigningUp" :icon="personAdd"></ion-icon>
            </template>
            <ion-spinner v-if="isSigningUp" name="crescent"></ion-spinner>
            <span v-else>Create Account</span>
          </ion-button>
        </form>

        <!-- Sign In Link -->
        <div class="signin-link-container">
          <p>
            Already have an account?
            <span class="sign-in-link" @click="goToLogin">Sign In</span>
          </p>
        </div>

        <!-- Terms Section -->
        <div class="terms-section">
          <p class="terms-text">
            By creating an account, you agree to our
            <a href="#" class="terms-link">Terms of Service</a> and
            <a href="#" class="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>

      <!-- Success Animation Overlay -->
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-circle">
          <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
        </div>
        <h3>Account Created!</h3>
        <p>Welcome to Wujo</p>
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
  useIonRouter,
  loadingController,
  IonSpinner,
  IonItem,
  toastController,
} from "@ionic/vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, ref as yupRef } from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import {
  eyeOutline,
  eyeOffOutline,
  checkmarkCircle,
  arrowBack,
  man,
  woman,
  people,
  person,
  personAdd,
  informationCircle,
} from "ionicons/icons";
import wujoLogo from "@/assets/img/icon2.svg";

const store = useStore();
const ionRouter = useIonRouter();

const isSigningUp = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showSuccess = ref(false);
const apiError = computed(() => store.state.auth.error);

/**
 * Format Ethiopian phone number to E.164 format
 * Handles: 251XXXXXXXXX, 09XXXXXXXX, 07XXXXXXXX, 9XXXXXXXX, 7XXXXXXXX
 */
const formatPhoneToE164 = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Case 1: Starts with 251 (country code without +)
  if (cleaned.startsWith("251") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Case 2: 10 digits starting with 09 or 07
  if (
    cleaned.length === 10 &&
    (cleaned.startsWith("09") || cleaned.startsWith("07"))
  ) {
    return `+251${cleaned.substring(1)}`; // Strip leading 0, add +251
  }

  // Case 3: 9 digits starting with 9 or 7
  if (
    cleaned.length === 9 &&
    (cleaned.startsWith("9") || cleaned.startsWith("7"))
  ) {
    return `+251${cleaned}`;
  }

  // Case 4: Already in E.164 format
  if (cleaned.startsWith("251") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Default: assume it needs +251 prefix
  return `+251${cleaned}`;
};

/**
 * Validate if phone is in correct format for Ethiopian numbers
 */
const isPhoneValid = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, "");

  // Valid formats:
  // 9 digits starting with 9 or 7
  // 10 digits starting with 09 or 07
  // 12 digits starting with 251
  return (
    (cleaned.length === 9 &&
      (cleaned.startsWith("9") || cleaned.startsWith("7"))) ||
    (cleaned.length === 10 &&
      (cleaned.startsWith("09") || cleaned.startsWith("07"))) ||
    (cleaned.length === 12 && cleaned.startsWith("251"))
  );
};

/**
 * Format phone input as user types (add spaces for readability)
 */
const formatPhoneInput = (event: any) => {
  let value = event.target.value.replace(/\D/g, "");

  // Format with spaces: 9 12 34 56 78
  if (value.length > 0) {
    const parts = [];
    if (value.length > 0) parts.push(value.substring(0, 1));
    if (value.length > 1) parts.push(value.substring(1, 3));
    if (value.length > 3) parts.push(value.substring(3, 5));
    if (value.length > 5) parts.push(value.substring(5, 7));
    if (value.length > 7) parts.push(value.substring(7, 9));
    event.target.value = parts.join(" ");
  }
};

// --- Validation Schema ---
const validationSchema = toTypedSchema(
  object({
    name: string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: string().email("Must be a valid email"), // Optional, but validates if present
    phone: string()
      .required("Phone number is required")
      .test(
        "is-valid-ethiopian",
        "Enter a valid Ethiopian phone number",
        (value) => {
          return isPhoneValid(value || "");
        }
      ),
    password: string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[0-9]/, "Must contain at least one number"),
    password_confirmation: string()
      .oneOf([yupRef("password")], "Passwords must match")
      .required("Password confirmation is required"),
    gender: string().required("Gender is required"),
    role: string().required("Role is required"),
    referral_code: string(), // Optional
  })
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    // Set a default gender to pre-select it and clear the validation error
    gender: "male",
  },
});

const submit = handleSubmit(async (values) => {
  isSigningUp.value = true;
  const loading = await loadingController.create({
    message: "Creating your account...",
    spinner: "crescent",
    translucent: true,
    cssClass: "wujo-loader",
  });
  await loading.present();

  try {
    // Format phone number to E.164 before sending to API
    const formattedPhone = formatPhoneToE164(values.phone);

    const signupData = {
      ...values,
      phone: formattedPhone,
    };

    console.log("Sending signup data:", { ...signupData, password: "***" });

    await store.dispatch("auth/signup", signupData);
    await store.dispatch("auth/fetchUser");

    const user = store.getters["auth/getUser"];

    // Show success animation
    showSuccess.value = true;

    // Navigate after animation
    setTimeout(() => {
      const path =
        user?.role === "collector"
          ? "/collector/dashboard"
          : "/member/dashboard";
      ionRouter.push(path);
    }, 2000);
  } catch (error: any) {
    console.error("Signup failed:", error);

    // Show error toast
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Signup failed. Please try again.";

    const toast = await toastController.create({
      message: errorMessage,
      duration: 4000,
      position: "top",
      color: "danger",
      cssClass: "error-toast",
    });
    await toast.present();
  } finally {
    isSigningUp.value = false;
    await loading.dismiss();
  }
});

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const goBack = () => {
  ionRouter.push("/onboarding");
};

const goToLogin = () => {
  ionRouter.push("/login");
};
</script>

<style scoped>
/* ===== WUJO BRAND IDENTITY - TRUSTWORTHY FUTURISTIC FINTECH UI ===== */

/* Header Enhancement */
.signup-header-bar {
  --background: transparent;
}

.transparent-toolbar {
  --background: transparent;
  --border-width: 0;
}

/* Content with Gradient Background */
.signup-content {
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
  max-width: 320px;
  margin: 0 auto;
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

.signup-form {
  padding: 40px 24px 32px;
}

/* Input Groups - Mobile-First Design */
.input-group {
  margin-bottom: 18px;
}

.required {
  color: var(--ion-color-danger);
  font-weight: 600;
}

.section-label {
  display: block;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 10px;
  font-size: 13px;
  letter-spacing: 0.2px;
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

/* Gender Selection - Premium Cards */
.gender-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.gender-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 12px;
  background: var(--ion-color-white-smoke);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 80px;
}

.gender-card:active {
  transform: scale(0.96);
}

.gender-card.active {
  background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.2);
}

.gender-icon {
  font-size: 28px;
  color: var(--ion-color-dark-green);
  margin-bottom: 6px;
}

.gender-card.active .gender-icon {
  color: var(--ion-color-medium-aquamarine);
}

.gender-card span {
  font-weight: 600;
  color: var(--ion-color-dark-green);
  font-size: 14px;
}

/* Role Selection - Premium Cards */
.role-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-card {
  background: var(--ion-color-white-smoke);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 110px;
}

.role-card:active {
  transform: scale(0.96);
}

.role-card.active {
  background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.2);
}

.role-icon {
  width: 40px;
  height: 40px;
  background: var(--ion-color-dark-green);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  transition: all 0.3s ease;
}

.role-card.active .role-icon {
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine),
    var(--ion-color-dark-green)
  );
}

.role-icon ion-icon {
  font-size: 20px;
  color: white;
}

.role-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px 0;
}

.role-card p {
  font-size: 11px;
  color: var(--ion-color-medium);
  margin: 0;
  line-height: 1.3;
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

.phone-helper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  margin-left: 20px;
  font-size: 12px;
  color: var(--ion-color-medium);
  font-weight: 500;
}

.helper-icon {
  font-size: 14px;
  color: var(--ion-color-medium-aquamarine);
}

/* Password Toggle */
.password-toggle {
  --color: var(--ion-color-medium);
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}

/* Primary Sign Up Button - Thumb Zone Optimized */
.primary-signup-button {
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

.primary-signup-button:not([disabled]):active {
  transform: scale(0.98);
}

.primary-signup-button[disabled] {
  --background: rgba(95, 217, 172, 0.3);
  --box-shadow: none;
}

/* Sign In Link */
.signin-link-container {
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid rgba(1, 64, 35, 0.1);
}

.signin-link-container p {
  font-size: 15px;
  color: var(--ion-color-dark-green);
  margin: 0;
  font-weight: 500;
}

.sign-in-link {
  color: var(--ion-color-medium-aquamarine);
  font-weight: 700;
  cursor: pointer;
  margin-left: 6px;
  transition: color 0.2s ease;
}

.sign-in-link:active {
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

/* Success Animation Overlay */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.success-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine),
    var(--ion-color-dark-green)
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
  box-shadow: 0 8px 32px rgba(95, 217, 172, 0.4);
}

.success-icon {
  font-size: 48px;
  color: white;
}

.success-overlay h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark-green);
  margin: 0 0 8px 0;
}

.success-overlay p {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

  .signup-form {
    padding: 32px 24px 24px;
  }

  .input-group {
    margin-bottom: 20px;
  }
}

/* Haptic Feedback Simulation */
.primary-signup-button:active,
.sign-in-link:active,
.gender-card:active,
.role-card:active {
  opacity: 0.8;
}
</style>
