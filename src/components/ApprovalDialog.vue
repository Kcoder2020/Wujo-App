<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleCancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>Approve Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="dialog-content">
        <p class="confirmation-message">
          Are you sure you want to approve this payment verification?
        </p>

        <ion-item lines="none" class="notes-item">
          <ion-label position="stacked">Notes (Optional)</ion-label>
          <ion-textarea
            v-model="notes"
            placeholder="Add any notes about this approval..."
            :rows="4"
            :maxlength="500"
          />
        </ion-item>

        <div class="button-group">
          <ion-button expand="block" @click="handleCancel" fill="outline">
            Cancel
          </ion-button>
          <ion-button
            expand="block"
            @click="handleConfirm"
            class="confirm-button"
          >
            <template #start>
              <ion-icon :icon="checkmarkCircle" />
            </template>
            Approve
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
import { checkmarkCircle } from "ionicons/icons";

interface ApprovalDialogProps {
  isOpen: boolean;
}

const props = defineProps<ApprovalDialogProps>();
const emit = defineEmits<{
  (e: "confirm", notes?: string): void;
  (e: "cancel"): void;
}>();

const notes = ref("");

// Reset notes when dialog opens
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      notes.value = "";
    }
  }
);

const handleConfirm = () => {
  emit("confirm", notes.value || undefined);
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.dialog-content {
  padding: 16px 0;
}

.confirmation-message {
  font-size: 16px;
  color: var(--ion-color-dark-green, #014023);
  margin-bottom: 24px;
  text-align: center;
}

.notes-item {
  --background: var(--ion-color-white-smoke, #f2f2f2);
  --border-radius: 12px;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.confirm-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
}
</style>
