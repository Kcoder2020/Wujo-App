<template>
  <div class="payment-history-item">
    <!-- Timeline Connector -->
    <div class="timeline-connector">
      <div class="timeline-dot" :class="statusClass"></div>
      <div v-if="!isLast" class="timeline-line"></div>
    </div>

    <!-- Payment Card -->
    <div class="payment-card" :class="statusClass">
      <div class="payment-header">
        <div class="payment-info">
          <h4 class="iqub-name">{{ payment.iqubName }}</h4>
          <p class="payment-date">{{ formatDate(payment.date) }}</p>
        </div>
        <div class="payment-amount" :class="statusClass">
          {{ formatCurrency(payment.amount) }}
        </div>
      </div>

      <div class="payment-footer">
        <!-- Status Badge -->
        <div class="status-badge" :class="statusClass">
          <ion-icon :icon="statusIcon"></ion-icon>
          <span>{{ statusText }}</span>
        </div>

        <!-- View Receipt Button -->
        <button
          v-if="payment.receiptUrl && payment.status === 'completed'"
          class="receipt-button"
          @click="viewReceipt"
        >
          <ion-icon :icon="receiptOutline"></ion-icon>
          <span>Receipt</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
  receiptOutline,
} from "ionicons/icons";

interface Payment {
  id: string;
  iqubName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  receiptUrl?: string;
}

const props = defineProps<{
  payment: Payment;
  isLast: boolean;
}>();

const emit = defineEmits<{
  (e: "view-receipt", url: string): void;
}>();

const statusClass = computed(() => {
  return `status-${props.payment.status}`;
});

const statusIcon = computed(() => {
  switch (props.payment.status) {
    case "completed":
      return checkmarkCircleOutline;
    case "pending":
      return timeOutline;
    case "failed":
      return closeCircleOutline;
    default:
      return timeOutline;
  }
});

const statusText = computed(() => {
  switch (props.payment.status) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
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

const viewReceipt = () => {
  if (props.payment.receiptUrl) {
    emit("view-receipt", props.payment.receiptUrl);
  }
};
</script>

<style scoped>
.payment-history-item {
  display: flex;
  gap: 16px;
}

/* Timeline Connector */
.timeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.timeline-dot.status-completed {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.timeline-dot.status-pending {
  background: #ffc107;
}

.timeline-dot.status-failed {
  background: #ef4444;
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(180deg, #e0e0e0 0%, transparent 100%);
  margin-top: 4px;
  min-height: 40px;
}

/* Payment Card */
.payment-card {
  flex: 1;
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.payment-card.status-completed {
  border-left-color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.payment-card.status-pending {
  border-left-color: #ffc107;
}

.payment-card.status-failed {
  border-left-color: #ef4444;
}

.payment-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Payment Header */
.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.payment-info {
  flex: 1;
  min-width: 0;
}

.iqub-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.payment-date {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.payment-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
}

.payment-amount.status-completed {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.payment-amount.status-pending {
  color: #ffc107;
}

.payment-amount.status-failed {
  color: #ef4444;
  text-decoration: line-through;
}

/* Payment Footer */
.payment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #f5f5f5;
  color: #666;
}

.status-badge.status-completed {
  background: rgba(95, 217, 172, 0.15);
  color: #2e7d5a;
}

.status-badge.status-pending {
  background: rgba(255, 193, 7, 0.15);
  color: #b8860b;
}

.status-badge.status-failed {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.status-badge ion-icon {
  font-size: 14px;
}

/* Receipt Button */
.receipt-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  border-radius: 20px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.receipt-button:hover {
  background: rgba(95, 217, 172, 0.1);
}

.receipt-button:active {
  transform: scale(0.95);
}

.receipt-button ion-icon {
  font-size: 14px;
}
</style>
