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
              v-if="!errors.credit_amount && formData.credit_amount"
              class="helper-text"
            >
              <ion-icon
                :icon="informationCircleOutline"
                class="helper-icon"
              ></ion-icon>
              Total amount each member receives when they win
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Credit Pattern</ion-label>
            <div
              v-if="!formData.credit_pattern_is_custom"
              class="pattern-cards-grid"
            >
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 1 }"
                @click="
                  formData.credit_pattern = 1;
                  formData.credit_pattern_is_custom = false;
                "
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Daily</p>
                <p class="pattern-desc">1 day</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 7 }"
                @click="
                  formData.credit_pattern = 7;
                  formData.credit_pattern_is_custom = false;
                "
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Weekly</p>
                <p class="pattern-desc">7 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.credit_pattern === 30 }"
                @click="
                  formData.credit_pattern = 30;
                  formData.credit_pattern_is_custom = false;
                "
              >
                <ion-icon :icon="cashOutline" class="pattern-icon"></ion-icon>
                <p class="pattern-name">Monthly</p>
                <p class="pattern-desc">30 days</p>
              </div>
              <div
                class="pattern-card custom-card"
                :class="{ active: formData.credit_pattern_is_custom }"
                @click="
                  formData.credit_pattern_is_custom = true;
                  formData.credit_pattern = null;
                "
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Custom</p>
                <p class="pattern-desc">Specify days</p>
              </div>
            </div>

            <!-- Premium Custom Days Input -->
            <div
              v-if="formData.credit_pattern_is_custom"
              class="premium-custom-container"
              role="region"
              aria-label="Custom pattern input section"
            >
              <div class="custom-header">
                <div class="custom-title">
                  <ion-icon
                    :icon="calendarOutline"
                    class="custom-title-icon"
                  ></ion-icon>
                  <span>Custom Credit Pattern</span>
                </div>
                <ion-button
                  fill="clear"
                  size="small"
                  @click="
                    formData.credit_pattern_is_custom = false;
                    formData.credit_pattern = null;
                  "
                  class="back-button"
                  aria-label="Back to pattern selection"
                >
                  <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
              </div>

              <div
                class="premium-input"
                :class="{
                  'premium-input-focus': focusedField === 'credit_pattern',
                  'premium-input-error': errors.credit_pattern,
                }"
              >
                <div class="input-content">
                  <label class="input-label">Number of Days</label>
                  <input
                    v-model.number="formData.credit_pattern"
                    type="number"
                    class="custom-number-input"
                    placeholder="e.g., 15"
                    @focus="focusedField = 'credit_pattern'"
                    @blur="
                      focusedField = '';
                      validateField('credit_pattern');
                    "
                    aria-label="Enter number of days between payouts"
                  />
                </div>
                <div class="input-suffix">days</div>
              </div>

              <div
                v-if="formData.credit_pattern && formData.credit_pattern > 0"
                class="pattern-preview"
              >
                <ion-icon
                  :icon="informationCircleOutline"
                  class="preview-icon"
                ></ion-icon>
                <span class="preview-text"
                  >Payouts every {{ formData.credit_pattern }} days</span
                >
              </div>
            </div>

            <div
              v-if="errors.credit_pattern"
              class="error-message"
              aria-live="polite"
            >
              {{ errors.credit_pattern }}
            </div>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Iqub Duration (Days)</ion-label>
            <ion-item
              class="modern-item"
              :class="{
                'item-has-focus': focusedField === 'iqub_duration',
                'item-has-error': errors.iqub_duration,
              }"
              lines="none"
            >
              <ion-input
                v-model.number="formData.iqub_duration"
                type="number"
                placeholder="e.g., 360"
                @ionFocus="focusedField = 'iqub_duration'"
                @ionBlur="
                  focusedField = '';
                  validateField('iqub_duration');
                "
              ></ion-input>
            </ion-item>
            <div v-if="errors.iqub_duration" class="error-message">
              {{ errors.iqub_duration }}
            </div>
            <div
              v-if="!errors.iqub_duration && formData.iqub_duration"
              class="helper-text"
            >
              Total duration of the Iqub cycle
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
            <ion-label class="form-label">Saving Pattern</ion-label>
            <div
              v-if="!formData.saving_pattern_is_custom"
              class="pattern-cards-grid"
            >
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 1 }"
                @click="
                  formData.saving_pattern = 1;
                  formData.saving_pattern_is_custom = false;
                "
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Daily</p>
                <p class="pattern-desc">1 day</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 7 }"
                @click="
                  formData.saving_pattern = 7;
                  formData.saving_pattern_is_custom = false;
                "
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Weekly</p>
                <p class="pattern-desc">7 days</p>
              </div>
              <div
                class="pattern-card"
                :class="{ active: formData.saving_pattern === 30 }"
                @click="
                  formData.saving_pattern = 30;
                  formData.saving_pattern_is_custom = false;
                "
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Monthly</p>
                <p class="pattern-desc">30 days</p>
              </div>
              <div
                class="pattern-card custom-card"
                :class="{ active: formData.saving_pattern_is_custom }"
                @click="
                  formData.saving_pattern_is_custom = true;
                  formData.saving_pattern = null;
                "
              >
                <ion-icon
                  :icon="calendarOutline"
                  class="pattern-icon"
                ></ion-icon>
                <p class="pattern-name">Custom</p>
                <p class="pattern-desc">Specify days</p>
              </div>
            </div>

            <!-- Premium Custom Days Input -->
            <div
              v-if="formData.saving_pattern_is_custom"
              class="premium-custom-container"
              role="region"
              aria-label="Custom pattern input section"
            >
              <div class="custom-header">
                <div class="custom-title">
                  <ion-icon
                    :icon="calendarOutline"
                    class="custom-title-icon"
                  ></ion-icon>
                  <span>Custom Saving Pattern</span>
                </div>
                <ion-button
                  fill="clear"
                  size="small"
                  @click="
                    formData.saving_pattern_is_custom = false;
                    formData.saving_pattern = null;
                  "
                  class="back-button"
                  aria-label="Back to pattern selection"
                >
                  <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
              </div>

              <div
                class="premium-input"
                :class="{
                  'premium-input-focus': focusedField === 'saving_pattern',
                  'premium-input-error': errors.saving_pattern,
                }"
              >
                <div class="input-content">
                  <label class="input-label">Number of Days</label>
                  <input
                    v-model.number="formData.saving_pattern"
                    type="number"
                    class="custom-number-input"
                    placeholder="e.g., 15"
                    @focus="focusedField = 'saving_pattern'"
                    @blur="
                      focusedField = '';
                      validateField('saving_pattern');
                    "
                    aria-label="Enter number of days between contributions"
                  />
                </div>
                <div class="input-suffix">days</div>
              </div>

              <div
                v-if="formData.saving_pattern && formData.saving_pattern > 0"
                class="pattern-preview"
              >
                <ion-icon
                  :icon="informationCircleOutline"
                  class="preview-icon"
                ></ion-icon>
                <span class="preview-text"
                  >Contributions every {{ formData.saving_pattern }} days</span
                >
              </div>
            </div>

            <div
              v-if="errors.saving_pattern"
              class="error-message"
              aria-live="polite"
            >
              {{ errors.saving_pattern }}
            </div>
          </div>

          <div class="form-group">
            <div class="members-section">
              <div class="section-header">
                <ion-label class="form-label">Members</ion-label>
                <div class="premium-toggle">
                  <ion-label class="toggle-label"
                    >Include half contributors</ion-label
                  >
                  <ion-toggle
                    v-model="formData.include_half_contributors"
                    color="medium-aquamarine"
                    aria-label="Include half contributors toggle"
                  ></ion-toggle>
                </div>
              </div>

              <!-- Full Contributors -->
              <div class="member-input-group">
                <div class="input-header">
                  <ion-icon
                    :icon="peopleOutline"
                    class="input-header-icon"
                  ></ion-icon>
                  <span class="input-header-title">Full Contributors</span>
                </div>
                <div
                  class="premium-member-input"
                  :class="{
                    'premium-input-focus': focusedField === 'members_count',
                    'premium-input-error': errors.members_count,
                  }"
                >
                  <input
                    v-model.number="formData.members_count"
                    type="number"
                    class="member-number-input"
                    placeholder="e.g., 10"
                    @focus="focusedField = 'members_count'"
                    @blur="
                      focusedField = '';
                      validateField('members_count');
                    "
                    aria-label="Enter number of full contributors"
                  />
                  <div class="input-suffix">members</div>
                </div>
                <div
                  v-if="errors.members_count"
                  class="error-message"
                  aria-live="polite"
                >
                  {{ errors.members_count }}
                </div>
              </div>

              <!-- Half Contributors (shown when toggle is on) -->
              <div
                v-if="formData.include_half_contributors"
                class="half-section"
              >
                <div class="input-header">
                  <ion-icon
                    :icon="peopleCircleOutline"
                    class="input-header-icon half-icon"
                  ></ion-icon>
                  <span class="input-header-title">Half Contributors</span>
                  <span class="even-badge">Must be even</span>
                </div>
                <div
                  class="premium-member-input"
                  :class="{
                    'premium-input-focus': focusedField === 'half_contributors',
                    'premium-input-error': errors.half_contributors,
                  }"
                >
                  <input
                    v-model.number="formData.half_contributors"
                    type="number"
                    class="member-number-input"
                    placeholder="e.g., 4"
                    @focus="focusedField = 'half_contributors'"
                    @blur="
                      focusedField = '';
                      validateField('half_contributors');
                    "
                    aria-label="Enter number of half contributors"
                    aria-describedby="half-helper-text"
                  />
                  <div class="input-suffix">members</div>
                </div>
                <div
                  v-if="errors.half_contributors"
                  class="error-message"
                  aria-live="polite"
                >
                  {{ errors.half_contributors }}
                </div>
                <div class="half-helper" id="half-helper-text">
                  <ion-icon
                    :icon="informationCircleOutline"
                    class="helper-icon"
                  ></ion-icon>
                  2 half contributors = 1 full member
                </div>
              </div>
            </div>

            <!-- Effective Members Calculation Card -->
            <div
              v-if="effectiveMembers > 0"
              class="effective-members-card"
              aria-label="Effective members calculation"
            >
              <div class="card-header">
                <ion-icon
                  :icon="calculatorOutline"
                  class="calculator-icon"
                ></ion-icon>
                <span class="card-title">Effective Members</span>
              </div>
              <div class="calculation-display">
                <div class="calculation-formula">
                  <span class="number">{{ formData.members_count || 0 }}</span>
                  <span class="label">full</span>
                  <template
                    v-if="
                      formData.include_half_contributors &&
                      formData.half_contributors
                    "
                  >
                    <span class="operator">+</span>
                    <span class="number">{{ formData.half_contributors }}</span>
                    <span class="label">half</span>
                  </template>
                  <span class="equals">=</span>
                  <span class="result">{{ effectiveMembers }}</span>
                  <span class="result-label">effective</span>
                </div>
              </div>
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
              <span class="summary-label">Credit Amount:</span>
              <span class="summary-value"
                >{{ formatCurrency(formData.credit_amount) }} ETB</span
              >
            </div>
            <div class="summary-row">
              <span class="summary-label">Credit Pattern:</span>
              <span class="summary-value">{{
                getPatternName(formData.credit_pattern)
              }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Iqub Duration:</span>
              <span class="summary-value"
                >{{ formData.iqub_duration }} days</span
              >
            </div>
            <div class="summary-row">
              <span class="summary-label">Saving Amount:</span>
              <span class="summary-value"
                >{{ formatCurrency(formData.saving_amount) }} ETB</span
              >
            </div>
            <div class="summary-row">
              <span class="summary-label">Saving Pattern:</span>
              <span class="summary-value">{{
                getPatternName(formData.saving_pattern)
              }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Members:</span>
              <span class="summary-value">
                {{ formData.members_count || 0 }} full
                <span
                  v-if="
                    formData.include_half_contributors &&
                    formData.half_contributors
                  "
                >
                  + {{ formData.half_contributors }} half
                </span>
                = {{ effectiveMembers }} effective
              </span>
            </div>
          </div>

          <div class="calculations-card">
            <h3 class="summary-title">Calculations</h3>
            <div class="calc-row">
              <span class="calc-label">Total Iqub Value:</span>
              <span class="calc-value"
                >{{ formatCurrency(totalIqubValue) }} ETB</span
              >
            </div>
          </div>

          <!-- Adjustable Calculated Fields -->
          <div class="adjustable-card">
            <h3 class="adjustable-title">
              <ion-icon :icon="bulbOutline" class="title-icon"></ion-icon>
              Review & Adjust
            </h3>
            <p class="adjustable-subtitle">
              These values are calculated automatically. You can adjust them if
              needed.
            </p>

            <!-- Credit Round -->
            <div class="adjustable-row">
              <div class="adjustable-info">
                <span class="adjustable-label">Credit Rounds</span>
                <span class="adjustable-desc">Number of payout rounds</span>
              </div>
              <div class="adjustable-controls">
                <ion-button
                  fill="clear"
                  size="small"
                  @click="decrementCreditRound"
                  class="adjust-button"
                >
                  <ion-icon :icon="removeOutline"></ion-icon>
                </ion-button>
                <span class="adjustable-value">{{
                  formData.credit_round || 0
                }}</span>
                <ion-button
                  fill="clear"
                  size="small"
                  @click="incrementCreditRound"
                  class="adjust-button"
                >
                  <ion-icon :icon="addOutline"></ion-icon>
                </ion-button>
              </div>
            </div>

            <!-- Saving Round -->
            <div class="adjustable-row">
              <div class="adjustable-info">
                <span class="adjustable-label">Saving Rounds</span>
                <span class="adjustable-desc"
                  >Number of contribution rounds</span
                >
              </div>
              <div class="adjustable-controls">
                <ion-button
                  fill="clear"
                  size="small"
                  @click="decrementSavingRound"
                  class="adjust-button"
                >
                  <ion-icon :icon="removeOutline"></ion-icon>
                </ion-button>
                <span class="adjustable-value">{{
                  formData.saving_round || 0
                }}</span>
                <ion-button
                  fill="clear"
                  size="small"
                  @click="incrementSavingRound"
                  class="adjust-button"
                >
                  <ion-icon :icon="addOutline"></ion-icon>
                </ion-button>
              </div>
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
  IonToggle,
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
  addOutline,
  removeOutline,
  peopleOutline,
  peopleCircleOutline,
  calculatorOutline,
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
  credit_amount: null as number | null,
  credit_pattern: null as number | null, // Days: 1, 7, 30, or custom number (stores actual days directly)
  credit_pattern_is_custom: false, // Track if custom is selected (UI state only)
  iqub_duration: null as number | null, // Days
  saving_amount: null as number | null,
  saving_pattern: null as number | null, // Days: 1, 7, 30, or custom number (stores actual days directly)
  saving_pattern_is_custom: false, // Track if custom is selected (UI state only)
  members_count: null as number | null, // Full contributors
  half_contributors: null as number | null, // Half contributors
  include_half_contributors: false, // Toggle for half contributors
  credit_round: null as number | null, // Adjustable in review
  saving_round: null as number | null, // Adjustable in review
});

// Errors
const errors = reactive({
  name: "",
  credit_amount: "",
  credit_pattern: "",
  iqub_duration: "",
  saving_amount: "",
  saving_pattern: "",
  members_count: "",
  half_contributors: "",
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

// Effective members count (full + half/2)
const effectiveMembers = computed(() => {
  const full = formData.members_count || 0;
  const half = formData.include_half_contributors
    ? formData.half_contributors || 0
    : 0;
  return full + half / 2;
});

// Auto-calculate credit_round based on effective members
const calculatedCreditRound = computed(() => {
  return Math.round(effectiveMembers.value);
});

// Auto-calculate saving_round based on duration and pattern
const calculatedSavingRound = computed(() => {
  if (!formData.iqub_duration) return 0;
  const pattern = formData.saving_pattern || 1;
  return Math.round(formData.iqub_duration / pattern);
});

// Get actual pattern days (handles custom)
const getCreditPatternDays = computed(() => {
  return formData.credit_pattern || 0;
});

const getSavingPatternDays = computed(() => {
  return formData.saving_pattern || 0;
});

const estimatedDuration = computed(() => {
  if (!formData.iqub_duration) return "";

  const days = formData.iqub_duration;
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `~${months} month${months > 1 ? "s" : ""}`;
  }
  return `~${weeks} week${weeks > 1 ? "s" : ""}`;
});

const totalIqubValue = computed(() => {
  if (formData.credit_amount && effectiveMembers.value) {
    return formData.credit_amount * effectiveMembers.value;
  }
  return 0;
});

// Auto-calculate rounds when moving to review step
watch(currentStep, (newStep) => {
  if (newStep === 3) {
    // Initialize calculated values if not already set
    if (!formData.credit_round) {
      formData.credit_round = calculatedCreditRound.value;
    }
    if (!formData.saving_round) {
      formData.saving_round = calculatedSavingRound.value;
    }
  }
});

// Increment/Decrement functions for review adjustments
const incrementCreditRound = () => {
  formData.credit_round = (formData.credit_round || 0) + 1;
};

const decrementCreditRound = () => {
  if (formData.credit_round && formData.credit_round > 1) {
    formData.credit_round--;
  }
};

const incrementSavingRound = () => {
  formData.saving_round = (formData.saving_round || 0) + 1;
};

const decrementSavingRound = () => {
  if (formData.saving_round && formData.saving_round > 1) {
    formData.saving_round--;
  }
};

// Validation
const validateField = (field: string) => {
  switch (field) {
    case "name":
      errors.name = !formData.name.trim() ? "Iqub name is required" : "";
      break;
    case "credit_amount":
      errors.credit_amount =
        !formData.credit_amount || formData.credit_amount <= 0
          ? "Credit amount is required"
          : "";
      break;
    case "credit_pattern":
      if (!formData.credit_pattern) {
        errors.credit_pattern = "Please select a credit pattern";
      } else if (formData.credit_pattern < 1) {
        errors.credit_pattern = "Pattern must be at least 1 day";
      } else {
        errors.credit_pattern = "";
      }
      break;
    case "iqub_duration":
      if (!formData.iqub_duration) {
        errors.iqub_duration = "Iqub duration is required";
      } else if (formData.iqub_duration < 1) {
        errors.iqub_duration = "Duration must be at least 1 day";
      } else {
        errors.iqub_duration = "";
      }
      break;
    case "saving_amount":
      errors.saving_amount =
        !formData.saving_amount || formData.saving_amount <= 0
          ? "Saving amount is required"
          : "";
      break;
    case "saving_pattern":
      if (!formData.saving_pattern) {
        errors.saving_pattern = "Please select a saving pattern";
      } else if (formData.saving_pattern < 1) {
        errors.saving_pattern = "Pattern must be at least 1 day";
      } else {
        errors.saving_pattern = "";
      }
      break;
    case "members_count":
      if (!formData.members_count) {
        errors.members_count = "Number of full contributors is required";
      } else if (formData.members_count < 1) {
        errors.members_count = "At least 1 full contributor is required";
      } else if (formData.members_count > 500) {
        errors.members_count = "Maximum 500 full contributors allowed";
      } else {
        errors.members_count = "";
      }
      break;
    case "half_contributors":
      if (formData.include_half_contributors) {
        if (!formData.half_contributors) {
          errors.half_contributors = "Number of half contributors is required";
        } else if (formData.half_contributors % 2 !== 0) {
          errors.half_contributors = "Half contributors must be an even number";
        } else if (formData.half_contributors < 0) {
          errors.half_contributors = "Cannot be negative";
        } else {
          errors.half_contributors = "";
        }
      } else {
        errors.half_contributors = "";
      }
      break;
  }
};

const validateCurrentStep = (): boolean => {
  if (currentStep.value === 1) {
    validateField("name");
    validateField("credit_amount");
    validateField("credit_pattern");
    validateField("iqub_duration");
    return !!(
      !errors.name &&
      !errors.credit_amount &&
      !errors.credit_pattern &&
      !errors.iqub_duration &&
      formData.name &&
      formData.credit_amount &&
      formData.credit_pattern &&
      formData.iqub_duration
    );
  } else if (currentStep.value === 2) {
    validateField("saving_amount");
    validateField("saving_pattern");
    validateField("members_count");
    if (formData.include_half_contributors) {
      validateField("half_contributors");
    }
    return !!(
      !errors.saving_amount &&
      !errors.saving_pattern &&
      !errors.members_count &&
      !errors.half_contributors &&
      formData.saving_amount &&
      formData.saving_pattern &&
      formData.members_count
    );
  }
  return true;
};

const canProceedToNext = computed(() => {
  if (currentStep.value === 1) {
    return !!(
      formData.name &&
      formData.credit_amount &&
      formData.credit_pattern &&
      formData.iqub_duration
    );
  } else if (currentStep.value === 2) {
    const hasValidHalf = formData.include_half_contributors
      ? formData.half_contributors && formData.half_contributors % 2 === 0
      : true;
    return !!(
      formData.saving_amount &&
      formData.saving_pattern &&
      formData.members_count &&
      hasValidHalf
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
  if (pattern === 1) return "Daily (1 day)";
  if (pattern === 7) return "Weekly (7 days)";
  if (pattern === 30) return "Monthly (30 days)";
  if (pattern && pattern !== 1 && pattern !== 7 && pattern !== 30) {
    return `Custom (${pattern} days)`;
  }
  return "";
};

// Submit
const handleSubmit = async () => {
  if (!acceptTerms.value) return;

  isSubmitting.value = true;

  try {
    const data = {
      name: formData.name,
      credit_amount: formData.credit_amount,
      credit_pattern: getCreditPatternDays.value,
      iqub_duration: formData.iqub_duration,
      saving_amount: formData.saving_amount,
      saving_pattern: getSavingPatternDays.value,
      members_count: formData.members_count,
      half_contributors: formData.include_half_contributors
        ? formData.half_contributors
        : 0,
      credit_round: formData.credit_round,
      saving_round: formData.saving_round,
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
.pattern-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.pattern-card.custom-card {
  background: rgba(95, 217, 172, 0.1);
  border: 2px dashed var(--ion-color-medium-aquamarine);
}

.pattern-card.custom-card.active {
  background: var(--ion-color-medium-aquamarine);
  border-style: solid;
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

/* Custom Input Container */
.custom-input-container {
  margin-top: 16px;
  padding: 16px;
  background: rgba(95, 217, 172, 0.05);
  border-radius: 12px;
  border: 2px solid var(--ion-color-medium-aquamarine);
}

.back-to-selection {
  --color: var(--ion-color-medium-aquamarine);
  margin-bottom: 12px;
}

/* Premium Custom Pattern Input */
.premium-custom-container {
  margin-top: 16px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.08) 0%,
    rgba(1, 64, 35, 0.03) 100%
  );
  border-radius: 20px;
  border: 2px solid var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 16px rgba(95, 217, 172, 0.15);
  animation: slideInCustom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInCustom {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.custom-title-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.back-button {
  --color: var(--ion-color-medium-aquamarine);
  --padding-start: 8px;
  --padding-end: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.premium-input {
  background: white;
  border-radius: 16px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-input-focus {
  border-color: var(--ion-color-medium-aquamarine);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.15);
  transform: translateY(-2px);
}

.premium-input-error {
  border-color: var(--ion-color-danger);
}

.input-content {
  flex: 1;
  padding: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin-bottom: 8px;
}

.custom-number-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  background: transparent;
}

.custom-number-input::placeholder {
  color: var(--ion-color-medium);
  opacity: 0.5;
}

.input-suffix {
  padding: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.pattern-preview {
  margin-top: 12px;
  padding: 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  font-size: 16px;
  color: var(--ion-color-medium-aquamarine);
  flex-shrink: 0;
}

.preview-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-dark-green);
}

/* Premium Members Section */
.members-section {
  background: linear-gradient(
    135deg,
    rgba(1, 64, 35, 0.02) 0%,
    rgba(95, 217, 172, 0.05) 100%
  );
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(95, 217, 172, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.premium-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.member-input-group {
  margin-bottom: 16px;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.input-header-icon {
  font-size: 20px;
  color: var(--ion-color-medium-aquamarine);
}

.input-header-icon.half-icon {
  opacity: 0.7;
}

.input-header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.even-badge {
  margin-left: auto;
  padding: 4px 8px;
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.premium-member-input {
  background: white;
  border-radius: 16px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-number-input {
  flex: 1;
  padding: 20px;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  background: transparent;
}

.member-number-input::placeholder {
  color: var(--ion-color-medium);
  opacity: 0.5;
}

.half-section {
  margin-top: 16px;
  padding-left: 16px;
  border-left: 3px solid rgba(95, 217, 172, 0.3);
  animation: slideInHalf 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInHalf {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.half-helper {
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #ff9800;
}

/* Effective Members Calculation Card */
.effective-members-card {
  margin-top: 24px;
  padding: 24px;
  background: var(--ion-color-dark-green);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  color: white;
  animation: slideUpCard 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUpCard {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.calculator-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.calculation-display {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.calculation-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.calculation-formula .number {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine);
}

.calculation-formula .label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.calculation-formula .operator {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 4px;
}

.calculation-formula .equals {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 8px;
}

.calculation-formula .result {
  font-size: 32px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine);
}

.calculation-formula .result-label {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

/* Pattern Cards Fade Animations */
.pattern-cards-grid {
  animation: fadeInCards 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInCards {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Error Message Animation */
.error-message {
  animation: fadeInError 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInError {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Adjustable Card */
.adjustable-card {
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.1) 0%,
    rgba(1, 64, 35, 0.05) 100%
  );
  border-radius: 16px;
  padding: 20px;
  border: 2px solid var(--ion-color-medium-aquamarine);
  margin-bottom: 16px;
}

.adjustable-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.adjustable-subtitle {
  font-size: 13px;
  color: var(--ion-color-medium);
  margin: 0 0 20px;
}

.adjustable-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.adjustable-row:last-child {
  margin-bottom: 0;
}

.adjustable-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.adjustable-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
}

.adjustable-desc {
  font-size: 12px;
  color: var(--ion-color-medium);
}

.adjustable-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.adjust-button {
  --color: var(--ion-color-medium-aquamarine);
  --padding-start: 8px;
  --padding-end: 8px;
  width: 40px;
  height: 40px;
}

.adjust-button ion-icon {
  font-size: 24px;
}

.adjustable-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-dark-green);
  min-width: 50px;
  text-align: center;
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
