<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="logo-container">
        <img :src="wujoLogo" alt="Wujo Logo" class="wujo-logo" />
      </div>

      <error-display :error-message="apiError" />

      <form @submit.prevent="submit" class="signup-form">
        <!-- Full Name -->
        <div class="form-field">
          <ion-label class="field-label">Full Name</ion-label>
          <Field name="name" v-slot="{ field }">
            <ion-item class="input-wrapper" lines="none">
              <ion-input
                v-bind="field"
                type="text"
                placeholder="Enter your full name"
              ></ion-input>
            </ion-item>
          </Field>
          <ErrorMessage name="name" class="error-message" />
        </div>

        <!-- Email (Optional) -->
        <div class="form-field">
          <ion-label class="field-label">Email (Optional)</ion-label>
          <Field name="email" v-slot="{ field }">
            <ion-item class="input-wrapper" lines="none">
              <ion-input
                v-bind="field"
                type="email"
                placeholder="Enter your email address"
              ></ion-input>
            </ion-item>
          </Field>
          <ErrorMessage name="email" class="error-message" />
        </div>

        <!-- Gender -->
        <div class="form-field">
          <ion-label class="field-label">Gender</ion-label>
          <Field name="gender" v-slot="{ field }">
            <div class="gender-options">
              <label class="radio-option">
                <input type="radio" value="male" v-bind="field" />
                <span class="radio-custom"></span>
                Male
              </label>
              <label class="radio-option">
                <input type="radio" value="female" v-bind="field" />
                <span class="radio-custom"></span>
                Female
              </label>
            </div>
          </Field>
          <ErrorMessage name="gender" class="error-message" />
        </div>

        <!-- Role -->
        <div class="form-field">
          <ion-label class="field-label">Select Role</ion-label>
          <Field name="role" v-slot="{ field }">
            <ion-item class="input-wrapper" lines="none">
              <ion-select
                v-bind="field"
                placeholder="Select Role"
                interface="action-sheet"
              >
                <ion-select-option value="collector"
                  >Collector</ion-select-option
                >
                <ion-select-option value="member">Member</ion-select-option>
              </ion-select>
            </ion-item>
          </Field>
          <ErrorMessage name="role" class="error-message" />
        </div>

        <!-- Phone -->
        <div class="form-field">
          <ion-label class="field-label">Phone</ion-label>
          <Field name="phone" v-slot="{ field }">
            <ion-item class="input-wrapper phone-wrapper" lines="none">
              <div class="country-code mr-1">
                <img
                  src="@/assets/img/ethiopia-flag.png"
                  alt="Ethiopia Flag"
                  class="flag-icon"
                />
                <span>+251</span>
              </div>
              <ion-input
                v-bind="field"
                type="tel"
                placeholder="912 345 678"
              ></ion-input>
            </ion-item>
          </Field>
          <ErrorMessage name="phone" class="error-message" />
        </div>

        <!-- Referral Code (Optional) -->
        <div class="form-field">
          <ion-label class="field-label">Referral Code (Optional)</ion-label>
          <Field name="referral_code" v-slot="{ field }">
            <ion-item class="input-wrapper" lines="none">
              <ion-input
                v-bind="field"
                type="text"
                placeholder="Enter referral code"
              ></ion-input>
            </ion-item>
          </Field>
          <ErrorMessage name="referral_code" class="error-message" />
        </div>

        <!-- Password -->
        <div class="form-field">
          <ion-label class="field-label">Password</ion-label>
          <Field name="password" v-slot="{ field }">
            <ion-item class="input-wrapper password-wrapper" lines="none">
              <ion-input
                v-bind="field"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
              ></ion-input>
              <ion-icon
                :icon="showPassword ? eyeOffOutline : eyeOutline"
                @click="toggleShowPassword"
                class="password-toggle-icon"
              ></ion-icon>
            </ion-item>
          </Field>
          <ErrorMessage name="password" class="error-message" />
        </div>

        <!-- Confirm Password -->
        <div class="form-field">
          <ion-label class="field-label">Confirm Password</ion-label>
          <Field name="password_confirmation" v-slot="{ field }">
            <ion-item class="input-wrapper password-wrapper" lines="none">
              <ion-input
                v-bind="field"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
              ></ion-input>
              <ion-icon
                :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
                @click="toggleShowConfirmPassword"
                class="password-toggle-icon"
              ></ion-icon>
            </ion-item>
          </Field>
          <ErrorMessage name="password_confirmation" class="error-message" />
        </div>

        <ion-button
          expand="block"
          type="submit"
          class="primary-signup-button"
          :disabled="isSigningUp"
        >
          <ion-spinner v-if="isSigningUp" name="crescent"></ion-spinner>
          <span v-else>Sign Up</span>
        </ion-button>
      </form>

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
import { ref, computed } from "vue";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonText,
  useIonRouter,
  loadingController,
  IonSpinner,
  IonItem,
} from "@ionic/vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, ref as yupRef } from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import wujoLogo from "@/assets/img/wujo-logo.png";

const store = useStore();
const ionRouter = useIonRouter();

const isSigningUp = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const apiError = computed(() => store.state.auth.error);

// --- Validation Schema ---
const validationSchema = toTypedSchema(
  object({
    name: string().required("Full name is required"),
    email: string().email("Must be a valid email"), // Optional, but validates if present
    phone: string()
      .required("Phone number is required")
      .matches(/^[0-9]{9}$/, "Must be 9 digits"),
    password: string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: string()
      .oneOf([yupRef("password")], "Passwords must match")
      .required("Password confirmation is required"),
    gender: string().required("Gender is required"),
    role: string().required("Role is required"),
    referral_code: string(), // Optional
  })
);

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    // Set a default gender to pre-select it and clear the validation error
    gender: "male",
  },
});

const submit = handleSubmit(async (values) => {
  isSigningUp.value = true;
  const loading = await loadingController.create({
    message: "Creating Account...",
    spinner: "crescent",
    translucent: true,
    cssClass: "wujo-loader",
  });
  await loading.present();

  try {
    await store.dispatch("auth/signup", values);
    await store.dispatch("auth/fetchUser");
    const user = store.getters["auth/getUser"];
    const path =
      user?.role === "collector" ? "/collector/dashboard" : "/member/dashboard";
    ionRouter.push(path, "root");
  } catch (error) {
    console.error("Signup failed:", error);
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
const goToLogin = () => {
  ionRouter.push("/login", "back");
};
</script>

<style scoped>
:root {
  --ion-color-wujo-primary: #006a52;
  --ion-color-wujo-primary-rgb: 0, 106, 82;
  --ion-color-wujo-light-grey: #f0f2f5;
  --ion-color-wujo-grey: #dcdcdc;
  --ion-color-wujo-text-grey: #555;
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-start: 20px;
  --padding-end: 20px;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding-top: 40px;
  margin-bottom: 20px;
}
.wujo-logo {
  width: 100px;
}

.form-field {
  margin-bottom: 10px;
}

.field-label {
  display: block;
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  --border-color: var(--ion-color-wujo-grey);
  --border-radius: 8px;
  --border-width: 1px;
  --padding-start: 12px;
  --inner-padding-end: 12px;
  --background: white;
  --highlight-height: 0;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.input-wrapper.item-focused {
  --border-color: var(--ion-color-wujo-primary);
  box-shadow: 0 0 0 2px rgba(0, 106, 82, 0.2);
}

.input-wrapper ion-input {
  --color: #333;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 0.8rem;
  padding-left: 4px;
  margin-top: 4px;
  display: block;
}

.gender-options {
  display: flex;
  gap: 20px;
  padding-top: 8px;
}
.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}
.radio-option input[type="radio"] {
  display: none;
}
.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--ion-color-wujo-grey);
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s ease-in-out;
}
.radio-custom::after {
  content: "";
  width: 10px;
  height: 10px;
  background: var(--ion-color-wujo-primary);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.radio-option input[type="radio"]:checked + .radio-custom {
  border-color: var(--ion-color-wujo-primary);
}
.radio-option input[type="radio"]:checked + .radio-custom::after {
  opacity: 1;
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

.password-toggle-icon {
  font-size: 22px;
  color: var(--ion-color-wujo-text-grey);
  cursor: pointer;
}

.primary-signup-button {
  --background: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  text-transform: none;
  height: 50px;
  margin-top: 20px;
}

.login-link-container {
  text-align: center;
  margin-top: 20px;
}
.login-link-container ion-text {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
}
.sign-in-link {
  color: var(--ion-color-wujo-primary);
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
}

:global(.wujo-loader) {
  --background: rgba(255, 255, 255, 0.8);
  --spinner-color: var(--ion-color-wujo-primary);
}
</style>
