<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleDismiss">
    <ion-content class="join-dialog-content">
      <div class="dialog-container">
        <!-- Header -->
        <div class="dialog-header">
          <h2 class="dialog-title">Join Iqub</h2>
          <ion-button fill="clear" @click="handleCancel" class="close-button">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </div>

        <!-- Iqub Details Summary -->
        <div class="iqub-summary">
          <h3 class="iqub-name">{{ iqub?.name }}</h3>
          <p class="iqub-description">
            {{
              iqub?.description ||
              "Join this Iqub to start your savings journey"
            }}
          </p>

          <div class="summary-grid">
            <div class="summary-item">
              <ion-icon :icon="cashOutline" />
              <div class="summary-content">
                <span class="summary-label">Total Amount</span>
                <span class="summary-value">{{
                  formatCurrency(totalAmount)
                }}</span>
              </div>
            </div>

            <div class="summary-item">
              <ion-icon :icon="walletOutline" />
              <div class="summary-content">
                <span class="summary-label">Per Round</span>
                <span class="summary-value">{{
                  formatCurrency(savingAmount)
                }}</span>
              </div>
            </div>

            <div class="summary-item">
              <ion-icon :icon="timeOutline" />
              <div class="summary-content">
                <span class="summary-label">Duration</span>
                <span class="summary-value">{{ duration }} months</span>
              </div>
            </div>

            <div class="summary-item">
              <ion-icon :icon="peopleOutline" />
              <div class="summary-content">
                <span class="summary-label">Members</span>
                <span class="summary-value"
                  >{{ membersCount }}/{{ totalSpots }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Schedule Preview -->
        <div class="payment-schedule">
          <h4 class="section-title">
            <ion-icon :icon="calendarOutline" />
            Payment Schedule
          </h4>
          <div class="schedule-info">
            <p class="schedule-text">
              You will pay
              <strong>{{ formatCurrency(savingAmount) }}</strong> per round
            </p>
            <p class="schedule-text">
              Total rounds: <strong>{{ duration }}</strong>
            </p>
            <p class="schedule-text">
              Start date: <strong>{{ formatDate(startDate) }}</strong>
            </p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms-section">
          <h4 class="section-title">
            <ion-icon :icon="documentTextOutline" />
            Terms & Conditions
          </h4>
          <div class="terms-content">
            <ul class="terms-list">
              <li>
                You commit to paying {{ formatCurrency(savingAmount) }} per
                round on time
              </li>
              <li>
                Missing payments may result in penalties or removal from the
                Iqub
              </li>
              <li>Lottery winners are selected randomly each round</li>
              <li>All payments are final and non-refundable</li>
              <li>You agree to follow the Iqub rules set by the collector</li>
            </ul>
            <div class="terms-checkbox">
              <ion-checkbox v-model="termsAccepted" />
              <span class="terms-label"
                >I agree to the terms and conditions</span
              >
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="dialog-actions">
          <ion-button
            expand="block"
            fill="outline"
            @click="handleCancel"
            :disabled="loading"
            class="cancel-button"
          >
            Cancel
          </ion-button>
          <ion-button
            expand="block"
            @click="handleConfirm"
            :disabled="!termsAccepted || loading"
            class="confirm-button"
          >
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Confirm & Join</span>
          </ion-button>
        </div>

        <!-- Success Animation -->
        <div v-if="showSuccess" class="success-overlay">
          <div class="success-content">
            <div class="checkmark-circle">
              <ion-icon :icon="checkmarkCircleOutline" class="checkmark-icon" />
            </div>
            <div class="confetti">
              <div
                v-for="i in 20"
                :key="i"
                class="confetti-piece"
                :style="getConfettiStyle(i)"
              ></div>
            </div>
            <h3 class="success-title">Welcome to the Iqub!</h3>
            <p class="success-message">
              You've successfully joined {{ iqub?.name }}
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSpinner,
} from "@ionic/vue";
import {
  closeOutline,
  cashOutline,
  walletOutline,
  timeOutline,
  peopleOutline,
  calendarOutline,
  documentTextOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";

interface Iqub {
  id: string | number;
  name: string;
  description?: string;
  saving_amount?: number | string;
  members_count?: number;
  totalSpots?: number;
  duration?: number;
  startDate?: string;
  category?: string;
  current_members?: number;
  joined_members?: number;
}

interface Props {
  isOpen: boolean;
  iqub: Iqub | null;
  loading?: boolean;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
// eslint-disable-next-line no-undef
const emit = defineEmits<{
  confirm: [iqubId: string | number];
  cancel: [];
  dismiss: [];
}>();

const termsAccepted = ref(false);
const showSuccess = ref(false);

const savingAmount = computed(() => {
  if (!props.iqub) return 0;
  return typeof props.iqub.saving_amount === "string"
    ? parseFloat(props.iqub.saving_amount)
    : props.iqub.saving_amount || 0;
});

const totalAmount = computed(() => {
  const members = totalSpots.value || 1;
  return savingAmount.value * members;
});

const duration = computed(() => {
  if (!props.iqub) return 12;
  return props.iqub.duration || props.iqub.members_count || 12;
});

const membersCount = computed(() => {
  if (!props.iqub) return 0;
  return props.iqub.current_members || props.iqub.joined_members || 0;
});

const totalSpots = computed(() => {
  if (!props.iqub) return 10;
  return props.iqub.totalSpots || props.iqub.members_count || 10;
});

const startDate = computed(() => {
  if (!props.iqub?.startDate) {
    // Default to next month
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    return date.toISOString();
  }
  return props.iqub.startDate;
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleConfirm = () => {
  if (!termsAccepted.value || !props.iqub) return;
  emit("confirm", props.iqub.id);
};

const handleCancel = () => {
  termsAccepted.value = false;
  emit("cancel");
};

const handleDismiss = () => {
  termsAccepted.value = false;
  emit("dismiss");
};

const getConfettiStyle = (index: number) => {
  const colors = ["#5FD9AC", "#014023", "#FFB800", "#4285f4", "#FF6B6B"];
  const angle = (360 / 20) * index;
  const distance = 100 + Math.random() * 50;

  return {
    "--angle": `${angle}deg`,
    "--distance": `${distance}px`,
    "--color": colors[index % colors.length],
    "--delay": `${Math.random() * 0.3}s`,
    "--duration": `${0.8 + Math.random() * 0.4}s`,
  };
};

// Expose method to show success animation
const showSuccessAnimation = () => {
  showSuccess.value = true;
};

// eslint-disable-next-line no-undef
defineExpose({
  showSuccessAnimation,
});
</script>

<style scoped>
.join-dialog-content {
  --background: #f2f2f2;
}

.dialog-container {
  padding: 0;
  min-height: 100%;
  position: relative;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #014023;
  color: white;
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.close-button {
  --color: white;
  --padding-start: 8px;
  --padding-end: 8px;
}

.close-button ion-icon {
  font-size: 28px;
}

.iqub-summary {
  background: white;
  padding: 24px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.iqub-name {
  font-size: 20px;
  font-weight: 700;
  color: #014023;
  margin: 0 0 8px 0;
}

.iqub-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.summary-item > ion-icon {
  font-size: 24px;
  color: #5fd9ac;
  margin-top: 2px;
  flex-shrink: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.summary-value {
  font-size: 16px;
  color: #014023;
  font-weight: 700;
}

.payment-schedule,
.terms-section {
  background: white;
  padding: 20px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #014023;
  margin: 0 0 16px 0;
}

.section-title ion-icon {
  font-size: 20px;
  color: #5fd9ac;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.schedule-text strong {
  color: #014023;
  font-weight: 600;
}

.terms-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.terms-list {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
}

.terms-list li {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 8px;
}

.terms-checkbox ion-checkbox {
  --size: 24px;
  --checkbox-background-checked: #5fd9ac;
  --border-color-checked: #5fd9ac;
}

.terms-label {
  font-size: 14px;
  color: #014023;
  font-weight: 600;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.cancel-button {
  --border-color: #014023;
  --color: #014023;
  --border-width: 2px;
  font-weight: 600;
}

.confirm-button {
  --background: #5fd9ac;
  --color: #014023;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  font-weight: 700;
}

.confirm-button:disabled {
  --background: #ccc;
  --color: #666;
  --box-shadow: none;
}

.confirm-button ion-spinner {
  width: 20px;
  height: 20px;
}

/* Success Animation */
.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 64, 35, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.success-content {
  text-align: center;
  padding: 40px;
  position: relative;
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.checkmark-icon {
  font-size: 80px;
  color: #5fd9ac;
  animation: checkmarkPop 0.6s ease-out 0.3s both;
}

.success-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  animation: slideUp 0.5s ease-out 0.4s both;
}

.success-message {
  font-size: 16px;
  color: #5fd9ac;
  margin: 0;
  animation: slideUp 0.5s ease-out 0.5s both;
}

.confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color);
  animation: confettiFall var(--duration) ease-out var(--delay) both;
  transform-origin: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkmarkPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes confettiFall {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(
        calc(cos(var(--angle)) * var(--distance)),
        calc(sin(var(--angle)) * var(--distance))
      )
      rotate(720deg);
    opacity: 0;
  }
}
</style>
