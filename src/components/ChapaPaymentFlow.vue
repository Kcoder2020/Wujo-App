<template>
  <div class="chapa-payment-flow">
    <div class="flow-header">
      <div class="chapa-logo">
        <!-- Chapa Logo Placeholder or Text -->
        <span class="logo-text">Chapa</span>
      </div>
      <h3>Secure Payment</h3>
      <p>You will be redirected to Chapa to complete your payment.</p>
    </div>

    <div class="payment-summary">
      <div class="summary-row">
        <span>Payment For</span>
        <span class="value">Round {{ round.round_number }}</span>
      </div>
      <div class="summary-row">
        <span>Iqub Name</span>
        <span class="value">{{ iqubName }}</span>
      </div>
      <div class="divider"></div>
      <div class="summary-row total">
        <span>Total Amount</span>
        <span class="amount">{{ formatCurrency(amount) }}</span>
      </div>
    </div>

    <div class="error-message" v-if="error">
      <ion-icon :icon="alertCircle" />
      <span>{{ error }}</span>
    </div>

    <div class="flow-actions">
      <ion-button
        expand="block"
        class="pay-btn"
        :disabled="loading"
        @click="initiatePayment"
      >
        <ion-spinner v-if="loading" name="crescent" />
        <span v-else>Pay Now</span>
      </ion-button>

      <ion-button
        expand="block"
        fill="clear"
        class="cancel-btn"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        Cancel
      </ion-button>
    </div>

    <div class="secure-badge">
      <ion-icon :icon="lockClosed" />
      <span>Secured by Chapa</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { IonIcon, IonButton, IonSpinner } from "@ionic/vue";
import { alertCircle, lockClosed } from "ionicons/icons";
import type { RoundPaymentDetails } from "@/types";

const props = defineProps<{
  round: RoundPaymentDetails;
  iqubId: string;
  iqubName: string;
  amount: number;
}>();

const emit = defineEmits(["success", "error", "cancel"]);
const store = useStore();

const loading = ref(false);
const error = ref<string | null>(null);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const initiatePayment = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await store.dispatch("member/initiatePayment", {
      iqubId: props.iqubId,
      roundNumber: props.round.round_number,
      amount: props.amount,
    });

    if (result.success && result.checkout_url) {
      // Redirect to Chapa
      window.location.href = result.checkout_url;
      emit("success");
    } else {
      error.value =
        result.error || "Failed to initiate payment. Please try again.";
      emit("error", error.value);
    }
  } catch (err: any) {
    error.value = err.message || "An unexpected error occurred.";
    emit("error", error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.chapa-payment-flow {
  padding: 24px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flow-header {
  text-align: center;
  margin-bottom: 32px;
}

.chapa-logo {
  width: 80px;
  height: 80px;
  background: #014023;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-text {
  color: #5fd9ac;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 1px;
}

.flow-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #014023;
  margin: 0 0 8px;
}

.flow-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.payment-summary {
  background: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.summary-row.total {
  margin-bottom: 0;
  align-items: center;
}

.summary-row .value {
  font-weight: 600;
  color: #333;
}

.summary-row.total span:first-child {
  font-weight: 600;
  color: #014023;
  font-size: 16px;
}

.summary-row .amount {
  font-size: 24px;
  font-weight: 700;
  color: #014023;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 8px;
}

.flow-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.pay-btn {
  --background: #5fd9ac;
  --color: #014023;
  --border-radius: 12px;
  font-weight: 700;
  height: 48px;
}

.cancel-btn {
  --color: #666;
  font-weight: 500;
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #999;
  font-size: 12px;
  margin-top: auto;
}
</style>
