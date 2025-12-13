<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Hero Section with Dark Green Gradient -->
      <div class="hero-section">
        <ion-icon
          :icon="arrowBack"
          class="back-icon"
          @click="goBack"
        ></ion-icon>
        <div class="hero-content">
          <div class="icon-container">
            <ion-icon :icon="addCircleOutline" class="hero-icon"></ion-icon>
          </div>
          <h1 class="hero-title">Create New Iqub</h1>
          <p class="hero-subtitle">Set up your savings group in 3 easy steps</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
        </div>
        <div class="progress-steps">
          <span :class="{ active: currentStep >= 1 }">Basic Info</span>
          <span :class="{ active: currentStep >= 2 }">Financial</span>
          <span :class="{ active: currentStep >= 3 }">Review</span>
        </div>
      </div>

      <!-- Form Container with Rounded Top -->
      <div class="form-container">
        <!-- Step 1: Basic Information -->
        <div v-show="currentStep === 1" class="wizard-step">
          <h2 class="step-title">Basic Information</h2>

          <div class="form-group">
            <ion-label class="form-label">Iqub Name</ion-label>
            <ion-item
              class="modern-item"
              :class="{
                'item-has-focus': focusedField === 'name',
                'item-has-error': errors.name,
              }"
              lines="none"
            >
              <ion-input
                v-model="formData.name"
                type="text"
                placeholder="e.g., Nimani Family Iqub"
                @ionFocus="focusedField = 'name'"
                @ionBlur="
                  focusedField = '';
                  validateField('name');
                "
              ></ion-input>
            </ion-item>
            <div v-if="errors.name" class="error-message">
              {{ errors.name }}
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Number of Members</ion-label>
            <ion-item
              class="modern-item"
              :class="{
                'item-has-focus': focusedField === 'members_count',
                'item-has-error': errors.members_count,
              }"
              lines="none"
            >
              <ion-input
                v-model.number="formData.members_count"
                type="number"
                placeholder="e.g., 10"
                @ionFocus="focusedField = 'members_count'"
                @ionBlur="
                  focusedField = '';
                  validateField('members_count');
                "
              ></ion-input>
            </ion-item>
            <div v-if="errors.members_count" class="error-message">
              {{ errors.members_count }}
            </div>
            <div
              v-if="!errors.members_count && formData.members_count"
              class="helper-text"
            >
              Valid range: 2-50 members
            </div>
          </div>

          <div v-if="estimatedDuration" class="info-card">
            <ion-icon
              :icon="informationCircleOutline"
              class="info-icon"
            ></ion-icon>
            <div class="info-content">
              <p class="info-title">Estimated Duration</p>
              <p class="info-value">{{ estimatedDuration }}</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Financial Details -->
        <div v-show="currentStep === 2" class="wizard-step">
          <h2 class="step-title">Financial Details</h2>

          <div class="form-group">
            <ion-label class="form-label">Saving Pattern</ion-label>
            <div class="pattern-cards">
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 1 }"
                @click="formData.saving_pattern = 1"
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Weekly</p>
                <p class="pattern-desc">Every 7 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 2 }"
                @click="formData.saving_pattern = 2"
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Bi-weekly</p>
                <p class="pattern-desc">Every 14 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 3 }"
                @click="formData.saving_pattern = 3"
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Monthly</p>
                <p class="pattern-desc">Every 30 days</p>
              </div>
            </div>
            <div v-if="errors.saving_pattern" class="error-message">
              {{ errors.saving_pattern }}
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Saving Amount (ETB)</ion-label>
            <ion-item
              class="modern-item"
              :class="{
                'item-has-focus': focusedField === 'saving_amount',
                'item-has-error': errors.saving_amount,
              }"
              lines="none"
            >
              <ion-input
                :value="savingAmountDisplay"
                type="text"
                placeholder="e.g., 1,000"
                @ionFocus="focusedField = 'saving_amount'"
                @ionBlur="
                  focusedField = '';
                  validateField('saving_amount');
                "
                @ionInput="handleSavingAmountInput"
              ></ion-input>
            </ion-item>
            <div v-if="errors.saving_amount" class="error-message">
              {{ errors.saving_amount }}
            </div>
            <div
              v-if="!errors.saving_amount && formData.saving_amount"
              class="helper-text"
            >
              <ion-icon
                :icon="informationCircleOutline"
                class="helper-icon"
              ></ion-icon>
              Amount each member contributes per round
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Credit Pattern</ion-label>
            <div class="pattern-cards">
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 1 }"
                @click="formData.credit_pattern = 1"
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Weekly</p>
                <p class="pattern-desc">Every 7 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 2 }"
                @click="formData.credit_pattern = 2"
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Bi-weekly</p>
                <p class="pattern-desc">Every 14 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 3 }"
                @click="formData.credit_pattern = 3"
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Monthly</p>
                <p class="pattern-desc">Every 30 days</p>
              </div>
            </div>
            <div v-if="errors.credit_pattern" class="error-message">
              {{ errors.credit_pattern }}
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Credit Amount (ETB)</ion-label>
            <ion-item
              class="modern-item"
              :class="{
                'item-has-focus': focusedField === 'credit_amount',
                'item-has-error': errors.credit_amount,
              }"
              lines="none"
            >
              <ion-input
                :value="creditAmountDisplay"
                type="text"
                placeholder="e.g., 10,000"
                @ionFocus="focusedField = 'credit_amount'"
                @ionBlur="
                  focusedField = '';
                  validateField('credit_amount');
                "
                @ionInput="handleCreditAmountInput"
              ></ion-input>
            </ion-item>
            <div v-if="errors.credit_amount" class="error-message">
              {{ errors.credit_amount }}
            </div>
            <div
              v-if="suggestedCreditAmount && !formData.credit_amount"
              class="helper-text suggestion"
            >
              <ion-icon :icon="bulbOutline" class="helper-icon"></ion-icon>
              Suggested: {{ formatCurrency(suggestedCreditAmount) }} ETB
            </div>
          </div>
        </div>

        <!-- Step 3: Review & Confirm -->
        <div v-show="currentStep === 3" class="wizard-step">
          <h2 class="step-title">Review & Confirm</h2>

          <div class="summary-card">
            <h3 class="summary-title">Iqub Details</h3>
            <div class="summary-row">
              <span class="summary-label">Name:</span>
              <span class="summary-value">{{ formData.name }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Members:</span>
              <span class="summary-value"
                >{{ formData.members_count }} people</span
              >
            </div>
            <div class="summary-row">
              <span class="summary-label">Saving Pattern:</span>
              <span class="summary-value">{{
                getPatternName(formData.saving_pattern)
              }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Saving Amount:</span>
              <span class="summary-value"
                >{{ formatCurrency(formData.saving_amount) }} ETB</span
              >
            </div>
            <div class="summary-row">
              <span class="summary-label">Credit Pattern:</span>
              <span class="summary-value">{{
                getPatternName(formData.credit_pattern)
              }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Credit Amount:</span>
              <span class="summary-value"
                >{{ formatCurrency(formData.credit_amount) }} ETB</span
              >
            </div>
          </div>

          <div class="calculations-card">
            <h3 class="summary-title">Calculations</h3>
            <div class="calc-row">
              <span class="calc-label">Total per Round:</span>
              <span class="calc-value"
                >{{ formatCurrency(totalPerRound) }} ETB</span
              >
            </div>
            <div class="calc-row">
              <span class="calc-label">Estimated Duration:</span>
              <span class="calc-value">{{ estimatedDuration }}</span>
            </div>
            <div class="calc-row highlight">
              <span class="calc-label">Total Iqub Value:</span>
              <span class="calc-value"
                >{{ formatCurrency(totalIqubValue) }} ETB</span
              >
            </div>
          </div>

          <div class="terms-container">
            <ion-checkbox
              v-model="acceptTerms"
              class="terms-checkbox"
            ></ion-checkbox>
            <label class="terms-label" @click="acceptTerms = !acceptTerms">
              I agree to the terms and conditions of creating an Iqub
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <ion-button
            v-if="currentStep > 1"
            expand="block"
            fill="outline"
            class="nav-button secondary"
            @click="previousStep"
          >
            <template #start>
              <ion-icon :icon="arrowBack"></ion-icon>
            </template>
            Previous
          </ion-button>

          <ion-button
            v-if="currentStep < 3"
            expand="block"
            class="nav-button primary"
            :disabled="!canProceedToNext"
            @click="nextStep"
          >
            Next
            <template #end>
              <ion-icon :icon="arrowForward"></ion-icon>
            </template>
          </ion-button>

          <ion-button
            v-if="currentStep === 3"
            expand="block"
            class="nav-button primary"
            :disabled="!acceptTerms || isSubmitting"
            @click="handleSubmit"
          >
            <ion-spinner v-if="isSubmitting" name="crescent"></ion-spinner>
            <span v-else>Create Iqub</span>
          </ion-button>
        </div>
      </div>

      <!-- Success Animation Modal -->
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-modal">
          <div class="success-icon-container">
            <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
          </div>
          <h2 class="success-title">Iqub Created!</h2>
          <p class="success-message">Your Iqub has been successfully created</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonItem,
  IonSpinner,
  useIonRouter,
  alertController,
} from "@ionic/vue";
import {
  arrowBack,
  arrowForward,
  addCircleOutline,
  calendarOutline,
  cashOutline,
  informationCircleOutline,
  bulbOutline,
  checkmarkCircle,
} from "ionicons/icons";
import { useStore } from "vuex";

const store = useStore();
const ionRouter = useIonRouter();

// State
const currentStep = ref(1);
const focusedField = ref("");
const acceptTerms = ref(false);
const isSubmitting = ref(false);
const showSuccess = ref(false);

// Form Data
const formData = reactive({
  name: "",
  saving_pattern: null as number | null,
  saving_amount: null as number | null,
  credit_pattern: null as number | null,
  credit_amount: null as number | null,
  members_count: null as number | null,
});

// Errors
const errors = reactive({
  name: "",
  saving_pattern: "",
  saving_amount: "",
  credit_pattern: "",
  credit_amount: "",
  members_count: "",
});

// Currency formatting
const formatCurrency = (amount: number | null): string => {
  if (!amount) return "0";
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^0-9]/g, "")) || 0;
};

// Display values for currency inputs
const savingAmountDisplay = computed(() => {
  return formData.saving_amount ? formatCurrency(formData.saving_amount) : "";
});

const creditAmountDisplay = computed(() => {
  return formData.credit_amount ? formatCurrency(formData.credit_amount) : "";
});

// Handle currency input
const handleSavingAmountInput = (event: any) => {
  const value = event.target.value;
  const numericValue = parseCurrency(value);
  formData.saving_amount = numericValue;
};

const handleCreditAmountInput = (event: any) => {
  const value = event.target.value;
  const numericValue = parseCurrency(value);
  formData.credit_amount = numericValue;
};

// Computed Properties
const progressWidth = computed(() => `${(currentStep.value / 3) * 100}%`);

const estimatedDuration = computed(() => {
  if (!formData.members_count || !formData.saving_pattern) return "";

  const daysPerRound =
    formData.saving_pattern === 1 ? 7 : formData.saving_pattern === 2 ? 14 : 30;
  const totalDays = formData.members_count * daysPerRound;
  const weeks = Math.floor(totalDays / 7);
  const months = Math.floor(totalDays / 30);

  if (months > 0) {
    return `~${months} month${months > 1 ? "s" : ""}`;
  }
  return `~${weeks} week${weeks > 1 ? "s" : ""}`;
});

const suggestedCreditAmount = computed(() => {
  if (formData.saving_amount && formData.members_count) {
    return formData.saving_amount * formData.members_count;
  }
  return null;
});

const totalPerRound = computed(() => {
  if (formData.saving_amount && formData.members_count) {
    return formData.saving_amount * formData.members_count;
  }
  return 0;
});

const totalIqubValue = computed(() => {
  if (formData.credit_amount && formData.members_count) {
    return formData.credit_amount * formData.members_count;
  }
  return 0;
});

// Auto-suggest credit amount
watch([() => formData.saving_amount, () => formData.members_count], () => {
  if (!formData.credit_amount && suggestedCreditAmount.value) {
    formData.credit_amount = suggestedCreditAmount.value;
  }
});

// Validation
const validateField = (field: string) => {
  switch (field) {
    case "name":
      errors.name = !formData.name.trim() ? "Iqub name is required" : "";
      break;
    case "members_count":
      if (!formData.members_count) {
        errors.members_count = "Number of members is required";
      } else if (formData.members_count < 2) {
        errors.members_count = "At least 2 members are required";
      } else if (formData.members_count > 50) {
        errors.members_count = "Maximum 50 members allowed";
      } else {
        errors.members_count = "";
      }
      break;
    case "saving_pattern":
      errors.saving_pattern = !formData.saving_pattern
        ? "Please select a saving pattern"
        : "";
      break;
    case "saving_amount":
      errors.saving_amount =
        !formData.saving_amount || formData.saving_amount <= 0
          ? "Saving amount is required"
          : "";
      break;
    case "credit_pattern":
      errors.credit_pattern = !formData.credit_pattern
        ? "Please select a credit pattern"
        : "";
      break;
    case "credit_amount":
      errors.credit_amount =
        !formData.credit_amount || formData.credit_amount <= 0
          ? "Credit amount is required"
          : "";
      break;
  }
};

const validateCurrentStep = (): boolean => {
  if (currentStep.value === 1) {
    validateField("name");
    validateField("members_count");
    return !!(
      !errors.name &&
      !errors.members_count &&
      formData.name &&
      formData.members_count
    );
  } else if (currentStep.value === 2) {
    validateField("saving_pattern");
    validateField("saving_amount");
    validateField("credit_pattern");
    validateField("credit_amount");
    return !!(
      !errors.saving_pattern &&
      !errors.saving_amount &&
      !errors.credit_pattern &&
      !errors.credit_amount &&
      formData.saving_pattern &&
      formData.saving_amount &&
      formData.credit_pattern &&
      formData.credit_amount
    );
  }
  return true;
};

const canProceedToNext = computed(() => {
  if (currentStep.value === 1) {
    return !!(
      formData.name &&
      formData.members_count &&
      formData.members_count >= 2 &&
      formData.members_count <= 50
    );
  } else if (currentStep.value === 2) {
    return !!(
      formData.saving_pattern &&
      formData.saving_amount &&
      formData.credit_pattern &&
      formData.credit_amount
    );
  }
  return false;
});

// Navigation
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++;
  }
};

const previousStep = () => {
  currentStep.value--;
};

const goBack = () => {
  ionRouter.back();
};

// Get pattern name
const getPatternName = (pattern: number | null): string => {
  if (pattern === 1) return "Weekly";
  if (pattern === 2) return "Bi-weekly";
  if (pattern === 3) return "Monthly";
  return "";
};

// Submit
const handleSubmit = async () => {
  if (!acceptTerms.value) return;

  isSubmitting.value = true;

  try {
    const data = {
      name: formData.name,
      saving_pattern: formData.saving_pattern,
      saving_amount: formData.saving_amount,
      credit_pattern: formData.credit_pattern,
      credit_amount: formData.credit_amount,
      members_count: formData.members_count,
    };

    await store.dispatch("iqubs/createIqub", data);

    // Show success animation
    showSuccess.value = true;

    // Navigate after 2.5 seconds
    setTimeout(() => {
      showSuccess.value = false;
      ionRouter.push("/collector/my-iqubs");
    }, 2500);
  } catch (error: any) {
    isSubmitting.value = false;

    const alert = await alertController.create({
      header: "Error",
      message:
        error.response?.data?.message ||
        "Failed to create Iqub. Please try again.",
      buttons: ["OK"],
    });
    await alert.present();
  }
};
</script>

<style scoped>
/* Hero Section with Dark Green Gradient */
.hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 60px 24px 80px;
  position: relative;
  animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 28px;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.hero-content {
  text-align: center;
  color: white;
}

.icon-container {
  width: 80px;
  height: 80px;
  background: rgba(95, 217, 172, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.hero-icon {
  font-size: 48px;
  color: var(--ion-color-medium-aquamarine);
}

.hero-title {
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 8px;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* Progress Bar */
.progress-container {
  padding: 16px 24px;
  background: white;
}

.progress-bar {
  height: 4px;
  background: rgba(1, 64, 35, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--ion-color-medium-aquamarine);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.progress-steps span {
  transition: color 0.3s;
}

.progress-steps span.active {
  color: var(--ion-color-dark-green);
  font-weight: 600;
}

/* Form Container with Rounded Top */
.form-container {
  background: white;
  border-radius: 32px 32px 0 0;
  margin-top: -50px;
  padding: 32px 24px 100px;
  box-shadow: 0 -8px 48px rgba(1, 64, 35, 0.15);
  position: relative;
  z-index: 1;
}

/* Wizard Steps */
.wizard-step {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 24px;
}

/* Form Groups */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
}

/* Modern Input with Focus State */
.modern-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--ion-color-white-smoke);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-item ion-input {
  --padding-start: 20px;
  --padding-end: 20px;
  font-size: 16px;
  min-height: 64px;
}

.modern-item.item-has-focus {
  --background: white;
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.15);
  transform: translateY(-2px);
}

.modern-item.item-has-error {
  border-color: var(--ion-color-danger);
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
}

.helper-text {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 4px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.helper-text.suggestion {
  color: var(--ion-color-medium-aquamarine);
  font-weight: 500;
}

.helper-icon {
  font-size: 14px;
}

/* Info Card */
.info-card {
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.info-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 0 0 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0;
}

/* Pattern Selection Cards */
.pattern-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.pattern-card {
  background: var(--ion-color-white-smoke);
  border-radius: 16px;
  padding: 16px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.pattern-card:active {
  transform: scale(0.98);
}

.pattern-card.active {
  background: var(--ion-color-medium-aquamarine);
  border-color: var(--ion-color-medium-aquamarine);
  transform: scale(1.05);
}

.pattern-icon {
  font-size: 32px;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
}

.pattern-card.active .pattern-icon {
  color: var(--ion-color-dark-green);
}

.pattern-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px;
}

.pattern-desc {
  font-size: 11px;
  color: var(--ion-color-medium);
  margin: 0;
}

.pattern-card.active .pattern-desc {
  color: var(--ion-color-dark-green);
  opacity: 0.8;
}

/* Summary and Calculations Cards */
.summary-card,
.calculations-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 16px;
}

.summary-row,
.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-row:last-child,
.calc-row:last-child {
  border-bottom: none;
}

.summary-label,
.calc-label {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.summary-value,
.calc-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.calc-row.highlight {
  background: rgba(95, 217, 172, 0.1);
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.calc-row.highlight .calc-label,
.calc-row.highlight .calc-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--ion-color-dark-green);
}

/* Terms Container */
.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
}

.terms-checkbox {
  --size: 24px;
  --checkbox-background-checked: var(--ion-color-medium-aquamarine);
  margin-top: 2px;
}

.terms-label {
  font-size: 14px;
  color: var(--ion-color-medium);
  line-height: 1.5;
  cursor: pointer;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.nav-button {
  --border-radius: 16px;
  height: 56px;
  font-weight: 700;
  text-transform: none;
  flex: 1;
}

.nav-button.primary {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
}

.nav-button.primary:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.nav-button.secondary {
  --border-color: var(--ion-color-dark-green);
  --color: var(--ion-color-dark-green);
  --border-width: 2px;
}

/* Success Overlay */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 64, 35, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.success-modal {
  text-align: center;
  padding: 40px;
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

.success-icon-container {
  width: 120px;
  height: 120px;
  background: rgba(95, 217, 172, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-icon {
  font-size: 80px;
  color: var(--ion-color-medium-aquamarine);
}

.success-title {
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin: 0 0 8px;
}

.success-message {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
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
</style>
