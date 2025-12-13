<template>
  <div class="verification-request-card">
    <div class="card-header">
      <div class="alert-badge">
        <ion-icon :icon="alertCircleOutline" />
        <span>Pending Verification</span>
      </div>
    </div>

    <div class="card-body">
      <div class="request-info">
        <h3 class="round-title">Round {{ request.roundNumber }}</h3>
        <p class="submission-date">
          Submitted: {{ formatDate(request.submissionDate) }}
        </p>
      </div>

      <div class="amount-display">
        <span class="label">Claimed Amount:</span>
        <span class="amount">{{ formatCurrency(request.amount) }} ETB</span>
      </div>

      <div v-if="request.memberNotes" class="member-notes">
        <span class="label">Member Notes:</span>
        <p class="notes-text">{{ request.memberNotes }}</p>
      </div>

      <div class="receipt-preview" @click="handleReceiptClick">
        <img
          v-if="request.receiptUrls[0]"
          :src="request.receiptUrls[0]"
          alt="Receipt preview"
          class="receipt-thumbnail"
        />
        <div class="receipt-overlay">
          <ion-icon :icon="expandOutline" />
          <span>View Receipt</span>
        </div>
      </div>
    </div>

    <div class="card-actions">
      <ion-button expand="block" class="approve-button" @click="handleApprove">
        <template #start>
          <ion-icon :icon="checkmarkCircle" />
        </template>
        Approve
      </ion-button>
      <ion-button
        expand="block"
        fill="outline"
        class="reject-button"
        @click="handleReject"
      >
        <template #start>
          <ion-icon :icon="closeCircle" />
        </template>
        Reject
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { IonButton, IonIcon } from "@ionic/vue";
import {
  alertCircleOutline,
  checkmarkCircle,
  closeCircle,
  expandOutline,
} from "ionicons/icons";

interface VerificationRequestCardProps {
  request: {
    id: string;
    roundNumber: number;
    amount: number;
    submissionDate: string;
    receiptUrls: string[];
    memberNotes?: string;
    status: "pending" | "approved" | "rejected";
  };
}

const props = defineProps<VerificationRequestCardProps>();
const emit = defineEmits<{
  (e: "approve", requestId: string): void;
  (e: "reject", requestId: string): void;
  (e: "receiptClick", receiptUrls: string[]): void;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET").format(amount);
};

const handleReceiptClick = () => {
  emit("receiptClick", props.request.receiptUrls);
};

const handleApprove = () => {
  emit("approve", props.request.id);
};

const handleReject = () => {
  emit("reject", props.request.id);
};
</script>

<style scoped>
.verification-request-card {
  background: white;
  border-radius: 16px;
  border-left: 4px solid var(--ion-color-warning, #ffa500);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.alert-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ion-color-warning, #ffa500);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.alert-badge ion-icon {
  font-size: 20px;
}

.round-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 4px 0;
}

.submission-date {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
  margin: 0 0 16px 0;
}

.amount-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--ion-color-white-smoke, #f2f2f2);
  border-radius: 8px;
  margin-bottom: 16px;
}

.amount-display .label {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
}

.amount-display .amount {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-dark-green, #014023);
}

.member-notes {
  margin-bottom: 16px;
}

.member-notes .label {
  font-size: 14px;
  color: var(--ion-color-medium, #6c757d);
  display: block;
  margin-bottom: 4px;
}

.notes-text {
  font-size: 14px;
  color: var(--ion-color-dark-green, #014023);
  padding: 8px;
  background: var(--ion-color-white-smoke, #f2f2f2);
  border-radius: 8px;
  margin: 0;
}

.receipt-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 16px;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.receipt-preview:hover .receipt-overlay {
  opacity: 1;
}

.receipt-overlay ion-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.approve-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

.reject-button {
  --border-color: var(--ion-color-danger, #dc3545);
  --color: var(--ion-color-danger, #dc3545);
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}
</style>
