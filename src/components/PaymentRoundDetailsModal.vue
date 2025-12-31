<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleClose"
    class="payment-round-details-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Round {{ paymentDetails?.roundNumber }} Details</ion-title>
        <template #end>
          <ion-buttons>
            <ion-button @click="handleClose">
              <ion-icon :icon="closeOutline" />
            </ion-button>
          </ion-buttons>
        </template>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Debug Info (remove after testing) -->
      <div style="background: yellow; padding: 10px; margin: 10px">
        <p>Is Open: {{ isOpen }}</p>
        <p>Payment Details Exists: {{ !!paymentDetails }}</p>
        <p>Payment Details Type: {{ typeof paymentDetails }}</p>
        <pre v-if="paymentDetails">{{
          JSON.stringify(paymentDetails, null, 2)
        }}</pre>
        <p v-else>Payment Details is NULL or UNDEFINED</p>
      </div>

      <div v-if="paymentDetails" class="details-container">
        <!-- Status Banner -->
        <div :class="['status-banner', `status-${paymentDetails.status}`]">
          <ion-icon :icon="getStatusIcon(paymentDetails.status)" />
          <span class="status-text">{{
            formatStatus(paymentDetails.status)
          }}</span>
        </div>

        <!-- Payment Information -->
        <div class="section">
          <h3 class="section-title">Payment Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Round Number</span>
              <span class="value">{{ paymentDetails.roundNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">Amount</span>
              <span class="value"
                >{{ formatCurrency(paymentDetails.amount) }} ETB</span
              >
            </div>
            <div class="info-item">
              <span class="label">Payment Method</span>
              <span class="value">{{
                formatPaymentMethod(paymentDetails.paymentMethod)
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">Payment Date</span>
              <span class="value">{{
                formatDate(paymentDetails.paymentDate)
              }}</span>
            </div>
            <div v-if="paymentDetails.chapaTxRef" class="info-item full-width">
              <span class="label">Transaction Reference</span>
              <span class="value tx-ref">{{ paymentDetails.chapaTxRef }}</span>
            </div>
          </div>
        </div>

        <!-- Receipt Section -->
        <div v-if="hasReceipts" class="section">
          <h3 class="section-title">Payment Receipt</h3>
          <div class="receipt-gallery">
            <div
              v-for="(url, index) in paymentDetails.receiptUrls"
              :key="index"
              class="receipt-thumbnail-container"
              @click="openReceiptViewer(index)"
            >
              <img :src="url" alt="Receipt" class="receipt-thumbnail" />
              <div class="receipt-overlay">
                <ion-icon :icon="expandOutline" />
              </div>
            </div>
          </div>
        </div>

        <!-- Verification Section -->
        <div v-if="paymentDetails.verificationId" class="section">
          <h3 class="section-title">Verification Status</h3>
          <div class="verification-info">
            <ion-icon
              :icon="shieldCheckmarkOutline"
              class="verification-icon"
            />
            <div class="verification-text">
              <p class="verification-title">Payment Verified</p>
              <p class="verification-subtitle">
                Verification ID: {{ paymentDetails.verificationId }}
              </p>
            </div>
          </div>
        </div>

        <!-- Member Information -->
        <div class="section">
          <h3 class="section-title">Member Information</h3>
          <div class="member-info">
            <div class="member-avatar">
              <img
                v-if="memberInfo.avatar"
                :src="memberInfo.avatar"
                :alt="memberInfo.name"
              />
              <ion-icon v-else :icon="personCircleOutline" />
            </div>
            <div class="member-details">
              <p class="member-name">{{ memberInfo.name }}</p>
              <p class="member-phone">{{ memberInfo.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button
            v-if="hasReceipts"
            expand="block"
            fill="outline"
            @click="openReceiptViewer(0)"
          >
            <template #start>
              <ion-icon :icon="imageOutline" />
            </template>
            View Receipt
          </ion-button>
          <ion-button
            v-if="paymentDetails.chapaTxRef"
            expand="block"
            fill="outline"
            @click="copyTransactionRef"
          >
            <template #start>
              <ion-icon :icon="copyOutline" />
            </template>
            Copy Transaction ID
          </ion-button>
        </div>
      </div>
    </ion-content>

    <!-- Receipt Viewer Modal -->
    <ReceiptViewerModal
      :is-open="isReceiptViewerOpen"
      :receipt-urls="paymentDetails?.receiptUrls || []"
      :payment-info="receiptPaymentInfo"
      @close="closeReceiptViewer"
    />
  </ion-modal>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { ref, computed } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  toastController,
} from "@ionic/vue";
import {
  closeOutline,
  checkmarkCircle,
  timeOutline,
  alertCircle,
  expandOutline,
  shieldCheckmarkOutline,
  personCircleOutline,
  imageOutline,
  copyOutline,
} from "ionicons/icons";
import ReceiptViewerModal from "./ReceiptViewerModal.vue";

interface PaymentRoundDetailsModalProps {
  isOpen: boolean;
  paymentDetails: {
    id: string;
    roundNumber: number;
    amount: number;
    paymentDate: string;
    paymentMethod:
      | "mobile_money"
      | "bank_transfer"
      | "cash"
      | "manual"
      | "chapa";
    status: "success" | "pending" | "failed";
    chapaTxRef?: string | null;
    verificationId?: string | null;
    receiptUrls?: string[];
  } | null;
  memberInfo: {
    name: string;
    phone: string;
    avatar?: string;
  };
}

const props = defineProps<PaymentRoundDetailsModalProps>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Debug: Log when props change
console.log("Modal props:", props);
console.log("Payment details:", props.paymentDetails);
console.log("Is open:", props.isOpen);

const isReceiptViewerOpen = ref(false);
const selectedReceiptIndex = ref(0);

const hasReceipts = computed(() => {
  return (
    props.paymentDetails?.receiptUrls &&
    Array.isArray(props.paymentDetails.receiptUrls) &&
    props.paymentDetails.receiptUrls.length > 0
  );
});

const receiptPaymentInfo = computed(() => ({
  roundNumber: props.paymentDetails?.roundNumber || 0,
  amount: props.paymentDetails?.amount || 0,
  date: props.paymentDetails?.paymentDate || "",
  memberName: props.memberInfo.name,
}));

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    success: checkmarkCircle,
    pending: timeOutline,
    failed: alertCircle,
  };
  return icons[status] || timeOutline;
};

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    success: "Payment Successful",
    pending: "Payment Pending",
    failed: "Payment Failed",
  };
  return statuses[status] || status;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET").format(amount || 0);
};

const formatDate = (date: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    mobile_money: "Mobile Money",
    bank_transfer: "Bank Transfer",
    cash: "Cash Payment",
    manual: "Manual Payment",
    chapa: "Chapa Payment",
  };
  return methods[method] || method;
};

const handleClose = () => {
  emit("close");
};

const openReceiptViewer = (index: number) => {
  selectedReceiptIndex.value = index;
  isReceiptViewerOpen.value = true;
};

const closeReceiptViewer = () => {
  isReceiptViewerOpen.value = false;
};

const copyTransactionRef = async () => {
  if (!props.paymentDetails?.chapaTxRef) return;

  try {
    await navigator.clipboard.writeText(props.paymentDetails.chapaTxRef);
    const toast = await toastController.create({
      message: "Transaction ID copied to clipboard",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
    await toast.present();
  } catch (error) {
    console.error("Failed to copy transaction ID:", error);
  }
};
</script>

<style scoped>
.payment-round-details-modal {
  --width: 100%;
  --max-width: 600px;
  --height: auto;
  --max-height: 90%;
}

ion-content {
  --background: var(--ion-color-white-smoke, #f2f2f2);
}

.details-container {
  padding: 0 0 24px 0;
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.status-banner ion-icon {
  font-size: 32px;
}

.status-success {
  background: linear-gradient(135deg, #2dd36f, #1fb35f);
}

.status-pending {
  background: linear-gradient(135deg, #ffa500, #ff8c00);
}

.status-failed {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

/* Section */
.section {
  background: white;
  padding: 20px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .label {
  font-size: 12px;
  color: var(--ion-color-medium, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
}

.info-item .value.tx-ref {
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
}

/* Receipt Gallery */
.receipt-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.receipt-thumbnail-container {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.receipt-thumbnail-container:hover {
  transform: scale(1.05);
}

.receipt-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.receipt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 64, 35, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.receipt-thumbnail-container:hover .receipt-overlay {
  opacity: 1;
}

.receipt-overlay ion-icon {
  font-size: 32px;
  color: white;
}

/* Verification Info */
.verification-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(95, 217, 172, 0.1);
  border-radius: 12px;
  border-left: 4px solid var(--ion-color-medium-aquamarine, #5fd9ac);
}

.verification-icon {
  font-size: 40px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.verification-text {
  flex: 1;
}

.verification-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.verification-subtitle {
  font-size: 12px;
  color: var(--ion-color-medium, #6c757d);
  margin: 0;
  font-family: monospace;
}

/* Member Info */
.member-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ion-color-light, #f4f5f8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar ion-icon {
  font-size: 48px;
  color: var(--ion-color-medium, #6c757d);
}

.member-details {
  flex: 1;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.member-phone {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons ion-button {
  --border-color: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 576px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
