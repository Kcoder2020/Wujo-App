<template>
  <div
    class="round-payment-card"
    :class="{ disabled: disabled }"
    @click="handleClick"
  >
    <div class="card-content">
      <div class="round-info">
        <span class="round-number">Round {{ round.round_number }}</span>
        <span class="payment-date" v-if="round.paid_at">
          Paid: {{ formatDate(round.paid_at) }}
        </span>
        <span class="due-date" v-else-if="round.due_date">
          Due: {{ formatDate(round.due_date) }}
        </span>
      </div>

      <div class="amount-status">
        <span class="amount">{{ formatCurrency(round.amount) }}</span>
        <div class="status-badge" :class="statusClass">
          <ion-icon :icon="statusIcon" />
          <span>{{ statusText }}</span>
        </div>
      </div>
    </div>

    <div class="card-action" v-if="showAction">
      <ion-icon :icon="chevronForwardOutline" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  checkmarkCircle,
  timeOutline,
  alertCircle,
  hourglassOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import type { RoundPaymentDetails } from "@/types";

interface Props {
  round: RoundPaymentDetails;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const statusClass = computed(() => {
  return `status-${props.round.status}`;
});

const statusText = computed(() => {
  switch (props.round.status) {
    case "success":
      return "Paid";
    case "pending":
      return "Processing";
    case "failed":
      return "Failed";
    case "pending_verification":
      return "Verifying";
    case "due":
      return "Pay Now";
    case "upcoming":
      return "Upcoming";
    default:
      return props.round.status;
  }
});

const statusIcon = computed(() => {
  switch (props.round.status) {
    case "success":
      return checkmarkCircle;
    case "pending":
      return hourglassOutline;
    case "failed":
      return alertCircle;
    case "pending_verification":
      return hourglassOutline;
    case "due":
      return alertCircle;
    case "upcoming":
      return timeOutline;
    default:
      return timeOutline;
  }
});

const showAction = computed(() => {
  return (
    !props.disabled &&
    props.round.status !== "success" &&
    props.round.status !== "pending_verification"
  );
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const handleClick = () => {
  if (!props.disabled) {
    emit("click", props.round);
  }
};
</script>

<style scoped>
.round-payment-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.round-payment-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9f9f9;
}

.round-payment-card:active {
  transform: scale(0.98);
}

.round-payment-card.disabled:active {
  transform: none;
}

.card-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.round-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.round-number {
  font-size: 16px;
  font-weight: 600;
  color: #014023;
}

.payment-date,
.due-date {
  font-size: 12px;
  color: #666;
}

.amount-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.amount {
  font-size: 16px;
  font-weight: 700;
  color: #014023;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.status-success {
  background: rgba(95, 217, 172, 0.15);
  color: #014023;
}

.status-pending {
  background: rgba(255, 165, 0, 0.15);
  color: #e69500;
}

.status-failed {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

.status-pending_verification {
  background: rgba(255, 215, 0, 0.15);
  color: #b39700;
}

.status-due {
  background: rgba(255, 165, 0, 0.15);
  color: #e69500;
}

.status-upcoming {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
}

.card-action {
  margin-left: 12px;
  color: #ccc;
  font-size: 20px;
}
</style>
