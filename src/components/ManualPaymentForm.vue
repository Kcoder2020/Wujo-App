<template>
  <div class="manual-payment-form">
    <div class="form-header">
      <h3>Upload Receipt</h3>
      <p>Please upload a clear image of your bank transfer receipt.</p>
    </div>

    <div class="upload-area" :class="{ 'has-image': previewUrl }">
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="file-input"
        @change="handleFileChange"
      />

      <div v-if="previewUrl" class="image-preview">
        <img :src="previewUrl" alt="Receipt Preview" />
        <button class="remove-btn" @click="removeImage">
          <ion-icon :icon="closeCircle" />
        </button>
      </div>

      <div v-else class="upload-placeholder" @click="triggerUpload">
        <div class="icon-circle">
          <ion-icon :icon="cloudUploadOutline" />
        </div>
        <span class="upload-text">Tap to upload image</span>
        <span class="upload-hint">Max size: 5MB</span>
      </div>
    </div>

    <div class="error-message" v-if="error">
      <ion-icon :icon="alertCircle" />
      <span>{{ error }}</span>
    </div>

    <div class="form-actions">
      <ion-button
        expand="block"
        class="submit-btn"
        :disabled="!selectedFile || loading"
        @click="submitPayment"
      >
        <ion-spinner v-if="loading" name="crescent" />
        <span v-else>Submit Payment</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonIcon, IonButton, IonSpinner } from "@ionic/vue";
import { cloudUploadOutline, closeCircle, alertCircle } from "ionicons/icons";

const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const error = ref<string | null>(null);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      error.value = "Please upload an image file (JPG, PNG)";
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Image size must be less than 5MB";
      return;
    }

    error.value = null;
    selectedFile.value = file;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  error.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const submitPayment = () => {
  if (selectedFile.value) {
    emit("submit", selectedFile.value);
  }
};
</script>

<style scoped>
.manual-payment-form {
  padding: 24px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #014023;
  margin: 0 0 8px;
}

.form-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.upload-area {
  flex: 1;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.upload-area.has-image {
  border-style: solid;
  border-color: #5fd9ac;
  padding: 0;
}

.file-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 20px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(1, 64, 35, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #014023;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #014023;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f9f9f9;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #dc3545;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-btn {
  --background: #014023;
  --color: white;
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
}

.cancel-btn {
  --color: #666;
  font-weight: 500;
}
</style>
