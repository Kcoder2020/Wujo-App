<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="$emit('close')"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.5, 0.75]"
  >
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-bar"></div>
        <h2>Round {{ round?.round_number }} Payment</h2>
        <p class="amount">{{ formatCurrency(round?.amount || 0) }}</p>
      </div>

      <div class="modal-body">
        <!-- Manual Pending State -->
        <div v-if="isManualPending" class="status-view pending">
          <div class="status-icon">
            <ion-icon :icon="hourglassOutline" />
          </div>
          <h3>Waiting approval from the collector</h3>
          <p>Your payment receipt is being reviewed.</p>
          <div class="receipt-action">
            <ion-button
              expand="block"
              fill="outline"
              :disabled="!hasReceipt"
              @click="$emit('view-receipt')"
            >
              <template #start>
                <ion-icon :icon="documentOutline" />
              </template>
              View Receipt
            </ion-button>
          </div>
        </div>

        <!-- Non-Manual Pending State -->
        <div v-else-if="isNonManualPending" class="status-view pending">
          <div class="status-icon">
            <ion-icon :icon="hourglassOutline" />
          </div>
          <h3>Payment Processing</h3>
          <p>
            Your payment via {{ round?.payment_method }} is being processed.
          </p>
          <p v-if="round?.paid_at">
            Initiated on {{ formatDate(round.paid_at) }}
          </p>
        </div>

        <!-- Manual Failed State -->
        <div
          v-else-if="isManualFailed && !isRetrying"
          class="status-view failed"
        >
          <div class="status-icon">
            <ion-icon :icon="alertCircle" />
          </div>
          <h3>Collector has declined the payment request</h3>
          <p>Please check the details and try again.</p>
          <div class="receipt-action">
            <ion-button expand="block" @click="isRetrying = true">
              Try Again
            </ion-button>
          </div>
        </div>

        <!-- Success State -->
        <div
          v-else-if="round?.status === 'success'"
          class="status-view success"
        >
          <div class="status-icon">
            <ion-icon :icon="checkmarkCircle" />
          </div>
          <h3 v-if="round.payment_method === 'manual'">
            Collector approved your payment
          </h3>
          <h3 v-else>Payment Completed</h3>
          <p>Paid on {{ formatDate(round.paid_at || "") }}</p>

          <div v-if="round.payment_method === 'manual'" class="receipt-action">
            <ion-button
              expand="block"
              fill="outline"
              @click="$emit('view-receipt')"
            >
              <template #start>
                <ion-icon :icon="documentOutline" />
              </template>
              View Receipt
            </ion-button>
          </div>
        </div>

        <!-- Payment Options (Default/Unpaid) -->
        <div v-else class="payment-options">
          <p class="section-title">Select Payment Method</p>

          <button
            class="payment-method-btn chapa"
            @click="$emit('initiate-chapa')"
          >
            <div class="method-icon">
              <ion-icon :icon="cardOutline" />
            </div>
            <div class="method-info">
              <span class="method-name">Pay with Chapa</span>
              <span class="method-desc">Instant payment via bank/wallet</span>
            </div>
            <ion-icon :icon="chevronForwardOutline" />
          </button>

          <button
            class="payment-method-btn manual"
            @click="$emit('open-manual-form')"
          >
            <div class="method-icon">
              <ion-icon :icon="documentTextOutline" />
            </div>
            <div class="method-info">
              <span class="method-name">Manual Payment</span>
              <span class="method-desc">Upload bank transfer receipt</span>
            </div>
            <ion-icon :icon="chevronForwardOutline" />
          </button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IonModal, IonIcon, IonButton } from "@ionic/vue";
import {
  cardOutline,
  documentTextOutline,
  chevronForwardOutline,
  checkmarkCircle,
  hourglassOutline,
  documentOutline,
  alertCircle,
} from "ionicons/icons";
import type { RoundPaymentDetails } from "@/types";

interface Props {
  isOpen: boolean;
  round: RoundPaymentDetails | null;
}

const props = defineProps<Props>();
defineEmits(["close", "initiate-chapa", "open-manual-form", "view-receipt"]);

const isRetrying = ref(false);

// Reset retry state when modal opens or round changes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) isRetrying.value = false;
  }
);

const isManualPending = computed(() => {
  return (
    (props.round?.status === "pending" ||
      props.round?.status === "pending_verification") &&
    props.round?.payment_method === "manual"
  );
});

const isNonManualPending = computed(() => {
  return (
    props.round?.status === "pending" &&
    props.round?.payment_method !== "manual" &&
    !!props.round?.payment_method
  );
});

const isManualFailed = computed(() => {
  return (
    props.round?.status === "failed" && props.round?.payment_method === "manual"
  );
});

const hasReceipt = computed(() => {
  return props.round?.receipt_urls && props.round.receipt_urls.length > 0;
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
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.modal-content {
  padding: 24px;
  background: white;
  height: 100%;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.header-bar {
  width: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: -12px auto 20px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #014023;
  margin: 0 0 8px;
}

.amount {
  font-size: 32px;
  font-weight: 700;
  color: #5fd9ac;
  margin: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-method-btn {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 16px;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
}

.payment-method-btn:active {
  background: #f9f9f9;
  transform: scale(0.98);
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.chapa .method-icon {
  background: rgba(95, 217, 172, 0.1);
  color: #014023;
}

.manual .method-icon {
  background: rgba(1, 64, 35, 0.05);
  color: #014023;
}

.method-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: #014023;
}

.method-desc {
  font-size: 12px;
  color: #666;
}

.status-view {
  text-align: center;
  padding: 20px 0;
}

.status-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.success .status-icon {
  color: #5fd9ac;
}

.pending .status-icon {
  color: #ffd700;
}

.status-view h3 {
  font-size: 20px;
  font-weight: 600;
  color: #014023;
  margin: 0 0 8px;
}

.status-view p {
  color: #666;
  margin: 0 0 24px;
}

.receipt-action {
  margin-top: 24px;
}

ion-button {
  --border-radius: 12px;
  --border-color: #014023;
  --color: #014023;
  font-weight: 600;
}
</style>
