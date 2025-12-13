<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleCancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>Reject Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="dialog-content">
        <p class="warning-message">
          Are you sure you want to reject this payment verification?
        </p>

        <ion-item lines="none" class="reason-item">
          <ion-label position="stacked">Rejection Reason *</ion-label>
          <ion-textarea
            v-model="reason"
            placeholder="Please provide a reason for rejection..."
            :rows="3"
            :maxlength="500"
          />
        </ion-item>

        <ion-item lines="none" class="notes-item">
          <ion-label position="stacked">Additional Notes (Optional)</ion-label>
          <ion-textarea
            v-model="notes"
            placeholder="Add any additional notes..."
            :rows="3"
            :maxlength="500"
          />
        </ion-item>

        <p v-if="showError" class="error-message">
          Please provide a rejection reason
        </p>

        <div class="button-group">
          <ion-button expand="block" @click="handleCancel" fill="outline">
            Cancel
          </ion-button>
          <ion-button
            expand="block"
            @click="handleConfirm"
            class="reject-button"
            :disabled="!reason.trim()"
          >
            <template #start>
              <ion-icon :icon="closeCircle" />
            </template>
            Reject
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { ref, watch } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { closeCircle } from "ionicons/icons";

interface RejectionDialogProps {
  isOpen: boolean;
}

const props = defineProps<RejectionDialogProps>();
const emit = defineEmits<{
  (e: "confirm", reason: string, notes?: string): void;
  (e: "cancel"): void;
}>();

const reason = ref("");
const notes = ref("");
const showError = ref(false);

// Reset form when dialog opens
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      reason.value = "";
      notes.value = "";
      showError.value = false;
    }
  }
);

const handleConfirm = () => {
  if (!reason.value.trim()) {
    showError.value = true;
    return;
  }
  emit("confirm", reason.value, notes.value || undefined);
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.dialog-content {
  padding: 16px 0;
}

.warning-message {
  font-size: 16px;
  color: var(--ion-color-danger, #dc3545);
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
}

.reason-item,
.notes-item {
  --background: var(--ion-color-white-smoke, #f2f2f2);
  --border-radius: 12px;
  margin-bottom: 16px;
}

.error-message {
  color: var(--ion-color-danger, #dc3545);
  font-size: 14px;
  margin: 0 0 16px 0;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 12px;
}

.reject-button {
  --background: var(--ion-color-danger, #dc3545);
  --color: white;
}

.reject-button:disabled {
  opacity: 0.5;
}
</style>
