<template>
  <div class="payment-history-card" @click="handleCardClick">
    <div class="card-header">
      <div class="round-info">
        <h3 class="round-title">Round {{ payment.roundNumber }}</h3>
        <p class="payment-date">{{ formatDate(payment.paymentDate) }}</p>
      </div>
      <div class="status-indicator">
        <ion-icon
          :icon="getStatusIcon(payment.status)"
          :class="getStatusClass(payment.status)"
        />
      </div>
    </div>

    <div class="card-body">
      <div class="payment-info">
        <span class="label">Amount:</span>
        <span class="value">{{ formatCurrency(payment.amount) }} ETB</span>
      </div>
      <div class="payment-info">
        <span class="label">Method:</span>
        <span class="value">{{
          formatPaymentMethod(payment.paymentMethod)
        }}</span>
      </div>
      <div class="payment-info">
        <span class="label">Status:</span>
        <span class="value" :class="getStatusClass(payment.status)">
          {{ formatStatus(payment.status) }}
        </span>
      </div>
    </div>

    <div
      v-if="payment.receiptUrls && payment.receiptUrls.length > 0"
      class="card-footer"
    >
      <ion-button fill="clear" size="small" @click.stop="handleReceiptClick">
        <template #start>
          <ion-icon :icon="documentTextOutline" />
        </template>
        View Receipt
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { IonButton, IonIcon } from "@ionic/vue";
import {
  checkmarkCircle,
  timeOutline,
  alertCircle,
  lockClosed,
  documentTextOutline,
} from "ionicons/icons";

interface PaymentHistoryCardProps {
  payment: {
    id: string;
    roundNumber: number;
    amount: number;
    paymentDate: string;
    dueDate: string;
    paymentMethod: "mobile_money" | "bank_transfer" | "cash" | "manual";
    status: "paid" | "pending" | "overdue" | "verified";
    verificationStatus?: "pending" | "verified" | "rejected" | null;
    receiptUrls?: string[];
    collectorNotes?: string;
  };
}

const props = defineProps<PaymentHistoryCardProps>();
const emit = defineEmits<{
  (e: "receiptClick", receiptUrls: string[]): void;
}>();

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    verified: lockClosed,
    paid: checkmarkCircle,
    pending: timeOutline,
    overdue: alertCircle,
  };
  return icons[status] || timeOutline;
};

const getStatusClass = (status: string) => {
  return `status-${status}`;
};

const formatDate = (date: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET").format(amount || 0);
};

const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    mobile_money: "Mobile Money",
    bank_transfer: "Bank Transfer",
    cash: "Cash Payment",
    manual: "Manual Payment",
  };
  return methods[method] || method;
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const handleReceiptClick = () => {
  if (props.payment.receiptUrls) {
    emit("receiptClick", props.payment.receiptUrls);
  }
};

const handleCardClick = () => {
  // Card click handler for future expansion
};
</script>

<style scoped>
.payment-history-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.payment-history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.round-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.payment-date {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
  margin: 0;
}

.status-indicator ion-icon {
  font-size: 32px;
}

.status-verified {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.status-paid {
  color: var(--ion-color-success, #2dd36f);
}

.status-pending {
  color: var(--ion-color-warning, #ffa500);
}

.status-overdue {
  color: var(--ion-color-danger, #dc3545);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.payment-info .label {
  color: var(--ion-color-medium, #6c757d);
}

.payment-info .value {
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
}

.card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-light, #f4f5f8);
}

.card-footer ion-button {
  --color: var(--ion-color-medium-aquamarine, #5fd9ac);
  font-size: 14px;
  font-weight: 600;
}
</style>
