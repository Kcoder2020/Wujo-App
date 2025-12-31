<template>
  <div
    class="credit-round-card"
    :class="{ completed: creditRound.lottery_completed }"
  >
    <!-- Card Header -->
    <div class="card-header">
      <div class="round-info">
        <h3 class="round-title">
          Credit Round {{ creditRound.credit_round_number }}
        </h3>
        <span class="round-range">
          Saving Rounds {{ creditRound.saving_round_range.start }} -
          {{ creditRound.saving_round_range.end }}
        </span>
      </div>
      <div class="status-badge" :class="statusClass">
        {{ statusText }}
      </div>
    </div>

    <!-- Progress Section -->
    <div class="progress-section">
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: `${creditRound.completion_percentage}%` }"
        ></div>
      </div>
      <span class="progress-text"
        >{{ creditRound.completion_percentage }}% Complete</span
      >
    </div>

    <!-- Eligibility Status -->
    <div v-if="!creditRound.lottery_completed" class="eligibility-section">
      <div
        v-if="creditRound.can_initiate_lottery"
        class="eligibility-status eligible"
      >
        <ion-icon :icon="checkmarkCircleOutline" class="status-icon"></ion-icon>
        <span>Ready for lottery</span>
      </div>
      <div v-else class="eligibility-status not-eligible">
        <ion-icon :icon="timeOutline" class="status-icon"></ion-icon>
        <span>{{ eligibilityMessage }}</span>
      </div>
    </div>

    <!-- Winner Info (for completed lotteries) -->
    <div
      v-if="creditRound.lottery_completed && creditRound.winner"
      class="winner-section"
    >
      <div class="winner-header">
        <ion-icon :icon="trophyOutline" class="trophy-icon"></ion-icon>
        <span class="winner-label">Winner</span>
      </div>
      <div class="winner-info">
        <span class="winner-name">
          <template
            v-if="creditRound.winner.is_pair && creditRound.winner.pair_member"
          >
            {{ creditRound.winner.name }} &
            {{ creditRound.winner.pair_member.name }}
          </template>
          <template v-else>
            {{ creditRound.winner.name }}
          </template>
        </span>
        <span class="winner-amount"
          >{{ formatAmount(creditRound.winner.credit_amount) }} ETB</span
        >
      </div>
      <div v-if="creditRound.lottery_date" class="lottery-date">
        <ion-icon :icon="calendarOutline" class="date-icon"></ion-icon>
        <span>{{ formatDate(creditRound.lottery_date) }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <div class="action-section">
      <ion-button
        v-if="!creditRound.lottery_completed"
        expand="block"
        :disabled="!creditRound.can_initiate_lottery"
        @click="handleInitiateLottery"
        class="initiate-button"
        :class="{ disabled: !creditRound.can_initiate_lottery }"
      >
        <template #start>
          <ion-icon :icon="shuffleOutline"></ion-icon>
        </template>
        Initiate Lottery
      </ion-button>

      <div v-else class="completed-badge">
        <ion-icon
          :icon="checkmarkCircleOutline"
          class="completed-icon"
        ></ion-icon>
        <span>Lottery Completed</span>
      </div>
    </div>

    <!-- Tooltip for disabled state -->
    <div
      v-if="!creditRound.can_initiate_lottery && !creditRound.lottery_completed"
      class="tooltip"
    >
      {{ eligibilityMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import {
  checkmarkCircleOutline,
  timeOutline,
  trophyOutline,
  calendarOutline,
  shuffleOutline,
} from "ionicons/icons";
import { CreditRoundInfo } from "../types/lottery";

interface Props {
  creditRound: CreditRoundInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "initiateLottery", creditRoundNumber: number): void;
}>();

// Computed
const statusClass = computed(() => {
  if (props.creditRound.lottery_completed) return "completed";
  if (props.creditRound.can_initiate_lottery) return "ready";
  if (props.creditRound.is_complete) return "pending";
  return "in-progress";
});

const statusText = computed(() => {
  if (props.creditRound.lottery_completed) return "Completed";
  if (props.creditRound.can_initiate_lottery) return "Ready";
  if (props.creditRound.is_complete) return "Pending Verification";
  return "In Progress";
});

const eligibilityMessage = computed(() => {
  if (props.creditRound.lottery_completed) return "";
  if (props.creditRound.can_initiate_lottery)
    return "Ready to initiate lottery";
  if (!props.creditRound.is_complete) {
    return `${
      100 - props.creditRound.completion_percentage
    }% of payments remaining`;
  }
  return "All payments must be verified first";
});

// Methods
function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function handleInitiateLottery() {
  if (props.creditRound.can_initiate_lottery) {
    emit("initiateLottery", props.creditRound.credit_round_number);
  }
}
</script>

<style scoped>
.credit-round-card {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    #016630 100%
  );
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.credit-round-card.completed {
  background: linear-gradient(135deg, #012a17 0%, #014023 100%);
}

.credit-round-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle at top right,
    rgba(95, 217, 172, 0.1) 0%,
    transparent 70%
  );
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.round-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.round-title {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.round-range {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.completed {
  background: rgba(95, 217, 172, 0.2);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.status-badge.ready {
  background: rgba(95, 217, 172, 0.3);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.status-badge.pending {
  background: rgba(255, 196, 9, 0.2);
  color: #ffc409;
}

.status-badge.in-progress {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

/* Progress Section */
.progress-section {
  margin-bottom: 16px;
}

.progress-bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

/* Eligibility Section */
.eligibility-section {
  margin-bottom: 16px;
}

.eligibility-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
}

.eligibility-status.eligible {
  background: rgba(95, 217, 172, 0.15);
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.eligibility-status.not-eligible {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
}

.status-icon {
  font-size: 18px;
}

/* Winner Section */
.winner-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.winner-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.trophy-icon {
  font-size: 20px;
  color: #ffd700;
}

.winner-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.winner-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.winner-name {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.winner-amount {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 16px;
  font-weight: 700;
}

.lottery-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.date-icon {
  font-size: 14px;
}

/* Action Section */
.action-section {
  margin-top: 8px;
}

.initiate-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --background-hover: #4bc99a;
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 12px;
  font-weight: 700;
  height: 48px;
}

.initiate-button.disabled {
  --background: rgba(255, 255, 255, 0.1);
  --color: rgba(255, 255, 255, 0.4);
}

.completed-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-weight: 600;
}

.completed-icon {
  font-size: 20px;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.credit-round-card:hover .tooltip {
  opacity: 1;
}
</style>
