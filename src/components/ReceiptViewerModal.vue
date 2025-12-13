<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleClose"
    class="receipt-viewer-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Payment Receipt</ion-title>
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
      <div class="receipt-viewer-container">
        <!-- Image Viewer -->
        <div class="image-viewer" ref="imageViewerRef">
          <img
            :src="currentReceiptUrl"
            alt="Receipt"
            class="receipt-image"
            @load="handleImageLoad"
          />
        </div>

        <!-- Navigation Dots (if multiple images) -->
        <div v-if="receiptUrls.length > 1" class="navigation-dots">
          <span
            v-for="(url, index) in receiptUrls"
            :key="index"
            :class="['dot', { active: currentIndex === index }]"
            @click="currentIndex = index"
          />
        </div>

        <!-- Payment Info Overlay -->
        <div class="payment-info-overlay">
          <div class="info-row">
            <span class="label">Member:</span>
            <span class="value">{{ paymentInfo.memberName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Round:</span>
            <span class="value">{{ paymentInfo.roundNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">Amount:</span>
            <span class="value"
              >{{ formatCurrency(paymentInfo.amount) }} ETB</span
            >
          </div>
          <div class="info-row">
            <span class="label">Date:</span>
            <span class="value">{{ formatDate(paymentInfo.date) }}</span>
          </div>
        </div>

        <!-- Download Button -->
        <ion-fab vertical="bottom" horizontal="end">
          <ion-fab-button @click="downloadReceipt">
            <ion-icon :icon="downloadOutline" />
          </ion-fab-button>
        </ion-fab>
      </div>
    </ion-content>
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
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/vue";
import { closeOutline, downloadOutline } from "ionicons/icons";

interface ReceiptViewerModalProps {
  isOpen: boolean;
  receiptUrls: string[];
  paymentInfo: {
    roundNumber: number;
    amount: number;
    date: string;
    memberName: string;
  };
}

const props = defineProps<ReceiptViewerModalProps>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const currentIndex = ref(0);
const imageViewerRef = ref<HTMLElement | null>(null);

const currentReceiptUrl = computed(() => {
  return props.receiptUrls[currentIndex.value] || "";
});

const handleClose = () => {
  currentIndex.value = 0;
  emit("close");
};

const handleImageLoad = () => {
  // Image loaded successfully
  // Future: Initialize zoom/pan functionality here
};

const downloadReceipt = async () => {
  try {
    const response = await fetch(currentReceiptUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-round-${props.paymentInfo.roundNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download receipt:", error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET").format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<style scoped>
.receipt-viewer-modal {
  --width: 100%;
  --height: 100%;
}

.receipt-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
}

.image-viewer {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.receipt-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.navigation-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
  width: 24px;
  border-radius: 4px;
}

.payment-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(1, 64, 35, 0.95) 0%,
    rgba(1, 64, 35, 0.8) 50%,
    transparent 100%
  );
  padding: 24px;
  color: white;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  opacity: 0.8;
}

.info-row .value {
  font-weight: 600;
}

ion-fab-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
}
</style>
