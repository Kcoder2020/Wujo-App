<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleClose"
    class="member-lottery-modal"
  >
    <ion-content class="modal-content">
      <!-- Custom Header with Back Button -->
      <div class="modal-header">
        <button class="back-button" @click="handleClose" aria-label="Go back">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </button>
        <h1 class="header-title">Lottery Result</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- Loading Phase -->
      <div v-if="phase === 'loading'" class="phase-container loading-phase">
        <ion-spinner name="crescent" class="loading-spinner"></ion-spinner>
        <p class="loading-text">Loading lottery details...</p>
      </div>

      <!-- Error Phase -->
      <div v-else-if="phase === 'error'" class="phase-container error-phase">
        <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
        <h3 class="error-title">Unable to Load</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <ion-button @click="handleRetry" class="retry-button">
          <template #start>
            <ion-icon :icon="refreshOutline"></ion-icon>
          </template>
          Try Again
        </ion-button>
      </div>

      <!-- Result Phase - Show result directly -->
      <div v-else-if="phase === 'result'" class="phase-container result-phase">
        <!-- Iqub Info Card -->
        <div class="iqub-info-card">
          <h2 class="iqub-name">{{ lotteryDetails?.iqub_name }}</h2>
          <div class="credit-round-badge">
            Credit Round {{ lotteryDetails?.credit_round_number }}
          </div>
          <p class="lottery-date">
            {{ formatDate(lotteryDetails?.lottery_date) }}
          </p>
        </div>

        <!-- Winner Result Card -->
        <div
          class="result-card"
          :class="{ 'is-winner': lotteryDetails?.is_winner }"
        >
          <!-- Trophy Icon -->
          <div
            class="trophy-container"
            :class="{ gold: lotteryDetails?.is_winner }"
          >
            <ion-icon :icon="trophyOutline" class="trophy-icon"></ion-icon>
          </div>

          <!-- Winner Info -->
          <div v-if="lotteryDetails?.is_winner" class="winner-section you-won">
            <div class="confetti-burst"></div>
            <h3 class="result-label">🎉 You Won! 🎉</h3>
            <p class="winner-name">{{ lotteryDetails?.winner?.name }}</p>
            <div class="credit-amount-display">
              <span class="amount-label">Credit Amount</span>
              <span class="amount-value">{{
                formatCurrency(lotteryDetails?.credit_amount)
              }}</span>
            </div>
          </div>

          <div v-else class="winner-section">
            <h3 class="result-label">Winner</h3>
            <p class="winner-name">
              <template
                v-if="
                  lotteryDetails?.winner?.is_pair &&
                  lotteryDetails?.winner?.pair_name
                "
              >
                {{ lotteryDetails?.winner?.name }} &
                {{ lotteryDetails?.winner?.pair_name }}
              </template>
              <template v-else>
                {{ lotteryDetails?.winner?.name }}
              </template>
            </p>
            <div class="credit-amount-display">
              <span class="amount-label">Credit Amount</span>
              <span class="amount-value">{{
                formatCurrency(lotteryDetails?.credit_amount)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Participants Summary -->
        <div class="participants-summary">
          <ion-icon :icon="peopleOutline" class="participants-icon"></ion-icon>
          <span
            >{{ lotteryDetails?.participants?.length || 0 }} participants in
            this lottery</span
          >
        </div>

        <!-- Done Button -->
        <ion-button expand="block" class="done-button" @click="handleDone">
          Got It
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  IonModal,
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  alertCircleOutline,
  refreshOutline,
  arrowBackOutline,
  trophyOutline,
  peopleOutline,
} from "ionicons/icons";
import { useStore } from "vuex";

type ModalPhase = "loading" | "error" | "result";

interface Props {
  isOpen: boolean;
  lotteryId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "viewed"): void;
}>();

const store = useStore();

// Refs
const phase = ref<ModalPhase>("loading");
const errorMessage = ref("");

// Computed
const lotteryDetails = computed(
  () => store.getters["member/selectedLotteryDetails"]
);

// Methods
const fetchLotteryDetails = async () => {
  if (!props.lotteryId) return;

  phase.value = "loading";
  errorMessage.value = "";

  const result = await store.dispatch("member/fetchLotteryDetails", {
    lotteryId: props.lotteryId,
  });

  if (result?.success) {
    phase.value = "result";
  } else {
    phase.value = "error";
    errorMessage.value = result?.error || "Failed to load lottery details";
  }
};

const handleDone = async () => {
  // Mark lottery as viewed
  if (props.lotteryId) {
    await store.dispatch("member/markLotteryAsViewed", {
      lotteryId: props.lotteryId,
    });
  }

  emit("viewed");
  handleClose();
};

const handleRetry = () => {
  fetchLotteryDetails();
};

const handleClose = () => {
  phase.value = "loading";
  emit("close");
};

const formatCurrency = (amount: number): string => {
  if (!amount) return "ETB 0";
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Watch for modal open
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.lotteryId) {
      fetchLotteryDetails();
    }
  }
);
</script>

<style scoped>
.member-lottery-modal {
  --background: transparent;
}

.modal-content {
  --background: linear-gradient(
    180deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012a17 100%
  );
}

/* Custom Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  padding-top: calc(16px + var(--ion-safe-area-top, 0px));
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.back-button ion-icon {
  font-size: 24px;
  color: white;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.header-spacer {
  width: 40px;
}

/* Phase Container */
.phase-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  text-align: center;
}

/* Loading Phase */
.loading-phase {
  justify-content: center;
  min-height: calc(100vh - 100px);
  gap: 16px;
}

.loading-spinner {
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  width: 48px;
  height: 48px;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
}

/* Error Phase */
.error-phase {
  justify-content: center;
  min-height: calc(100vh - 100px);
  gap: 12px;
}

.error-icon {
  font-size: 64px;
  color: #dc3545;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.error-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 280px;
}

.retry-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 12px;
  margin-top: 8px;
}

/* Result Phase */
.result-phase {
  gap: 20px;
  padding-bottom: 40px;
}

/* Iqub Info Card */
.iqub-info-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 340px;
}

.iqub-name {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
}

.credit-round-badge {
  display: inline-block;
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  color: var(--ion-color-dark-green, #014023);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.lottery-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Result Card */
.result-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px 24px;
  width: 100%;
  max-width: 340px;
  position: relative;
  overflow: hidden;
}

.result-card.is-winner {
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.2) 0%,
    rgba(255, 165, 0, 0.15) 100%
  );
  border: 2px solid rgba(255, 215, 0, 0.4);
}

.trophy-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.trophy-container.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
  animation: trophyPulse 2s ease-in-out infinite;
}

@keyframes trophyPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6);
  }
}

.trophy-icon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.8);
}

.trophy-container.gold .trophy-icon {
  color: white;
}

.winner-section {
  text-align: center;
}

.winner-section.you-won {
  position: relative;
}

.result-label {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px 0;
}

.you-won .result-label {
  font-size: 20px;
  color: #ffd700;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.winner-name {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.credit-amount-display {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.amount-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.amount-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.is-winner .amount-value {
  color: #ffd700;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

/* Participants Summary */
.participants-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.participants-icon {
  font-size: 18px;
}

/* Done Button */
.done-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-hover: #4bc99a;
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  height: 52px;
  width: 100%;
  max-width: 340px;
  margin-top: 12px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .trophy-container.gold {
    animation: none;
  }
}
</style>
