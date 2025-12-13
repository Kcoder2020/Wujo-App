<template>
  <div class="payment-history-item">
    <div class="timeline-marker">
      <div class="marker-dot" :class="statusClass"></div>
      <div class="marker-line" v-if="!isLast"></div>
    </div>

    <div class="payment-card">
      <div class="payment-header">
        <h4 class="iqub-name">{{ payment.iqubName }}</h4>
        <span class="payment-amount">{{ formatCurrency(payment.amount) }}</span>
      </div>
      <div class="payment-details">
        <p class="payment-date">{{ formatDate(payment.date) }}</p>
        <span class="payment-status" :class="statusClass">{{
          statusText
        }}</span>
      </div>
      <ion-button
        v-if="payment.receiptUrl"
        fill="clear"
        size="small"
        @click="viewReceipt"
        class="receipt-button"
      >
        <template #start>
          <ion-icon :icon="documentTextOutline" />
        </template>
        View Receipt
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { documentTextOutline } from "ionicons/icons";

export interface Payment {
  iqubName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  receiptUrl?: string;
}

interface Props {
  payment: Payment;
  isLast?: boolean;
}

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(), {
  isLast: false,
});

// eslint-disable-next-line no-undef
const emit = defineEmits<{
  viewReceipt: [url: string];
}>();

const statusClass = computed(() => {
  return `status-${props.payment.status}`;
});

const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
  };
  return statusMap[props.payment.status] || "Unknown";
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const viewReceipt = () => {
  if (props.payment.receiptUrl) {
    emit("viewReceipt", props.payment.receiptUrl);
  }
};
</script>

<style scoped>
.payment-history-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 1;
}

.marker-dot.status-completed {
  background: #5fd9ac;
  box-shadow: 0 0 0 4px rgba(95, 217, 172, 0.2);
}

.marker-dot.status-pending {
  background: #999;
  box-shadow: 0 0 0 4px rgba(153, 153, 153, 0.2);
}

.marker-dot.status-failed {
  background: #ff4444;
  box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.2);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: #e0e0e0;
  margin-top: 4px;
  min-height: 40px;
}

.payment-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.iqub-name {
  font-size: 16px;
  font-weight: 700;
  color: #014023;
  margin: 0;
  flex: 1;
}

.payment-amount {
  font-size: 16px;
  font-weight: 700;
  color: #5fd9ac;
}

.payment-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.payment-date {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.payment-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: capitalize;
}

.payment-status.status-completed {
  background: rgba(95, 217, 172, 0.15);
  color: #00a86b;
}

.payment-status.status-pending {
  background: rgba(255, 165, 0, 0.15);
  color: #ff8c00;
}

.payment-status.status-failed {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
}

.receipt-button {
  --color: #5fd9ac;
  --padding-start: 0;
  --padding-end: 0;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 600;
}

.receipt-button ion-icon {
  font-size: 16px;
}
</style>
