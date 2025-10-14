<template>
  <ion-page>
    <!-- Removed ion-header, using custom top bar within ion-content -->
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Menu, Title, Notification) - Reused from Dashboard -->
      <!-- You might want to make this a separate component for reusability -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <!-- Assuming you have a menu -->
        <ion-text class="page-title">HI Collector</ion-text>
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <!-- Use a placeholder notification count or fetch from store -->
          <ion-badge color="danger" class="notification-badge">3</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar (Integrated Here) - Reused component -->
      <!-- Pass prop to indicate the active tab -->
      <collector-tab-bar active-tab="create-iqub"></collector-tab-bar>

      <!-- Main Form Content Area -->
      <div class="form-content">
        <!-- Page Heading -->
        <ion-text class="page-heading"><h2>Create Iqub</h2></ion-text>

        <form @submit.prevent="submit" class="create-iqub-form">
          <!-- Iquber Name -->
          <div class="form-field">
            <ion-label class="field-label">Iquber Name</ion-label>
            <div class="input-wrapper">
              <Field
                name="name"
                as="ion-input"
                type="text"
                placeholder="Iqub Name"
              />
            </div>
            <ErrorMessage name="name" as="ion-text" class="error-message" />
          </div>

          <!-- Credit Pattern (Styled Select) -->
          <div class="form-field">
            <ion-label class="field-label">Credit Pattern</ion-label>
            <div class="input-wrapper select-wrapper">
              <Field
                name="credit_pattern"
                as="ion-select"
                placeholder="Select Credit Pattern"
              >
                <ion-select-option value="1">Weekly</ion-select-option>
                <ion-select-option value="2">Daily</ion-select-option>
                <ion-select-option value="3">Monthly</ion-select-option>
              </Field>
              <ion-icon :icon="pencilOutline" class="input-icon"></ion-icon>
              <!-- Pencil icon -->
            </div>
            <ErrorMessage
              name="credit_pattern"
              as="ion-text"
              class="error-message"
            />
          </div>

          <!-- Saving Amount -->
          <div class="form-field">
            <ion-label class="field-label">Saving Amount</ion-label>
            <div class="input-wrapper">
              <Field
                name="saving_amount"
                as="ion-input"
                type="number"
                placeholder="Amount"
              />
            </div>
            <ErrorMessage
              name="saving_amount"
              as="ion-text"
              class="error-message"
            />
          </div>

          <!-- Saving Pattern (Styled Select) -->
          <div class="form-field">
            <ion-label class="field-label">Saving Pattern</ion-label>
            <div class="input-wrapper select-wrapper">
              <Field
                name="saving_pattern"
                as="ion-select"
                placeholder="Select Saving Pattern"
              >
                <ion-select-option value="1">Weekly</ion-select-option>
                <ion-select-option value="2">Daily</ion-select-option>
                <ion-select-option value="3">Monthly</ion-select-option>
              </Field>
              <ion-icon :icon="pencilOutline" class="input-icon"></ion-icon>
              <!-- Pencil icon -->
            </div>
            <ErrorMessage
              name="saving_pattern"
              as="ion-text"
              class="error-message"
            />
          </div>

          <!-- Credit Amount -->
          <div class="form-field">
            <ion-label class="field-label">Credit Amount</ion-label>
            <div class="input-wrapper">
              <Field
                name="credit_amount"
                as="ion-input"
                type="number"
                placeholder="Credit Amount"
              />
            </div>
            <ErrorMessage
              name="credit_amount"
              as="ion-text"
              class="error-message"
            />
          </div>

          <!-- Members Count -->
          <div class="form-field">
            <ion-label class="field-label">Number of Memebers</ion-label>
            <!-- Keeping typo as in design for now -->
            <div class="input-wrapper">
              <Field
                name="members_count"
                as="ion-input"
                type="number"
                placeholder="10"
              />
              <!-- Design shows 10 -->
            </div>
            <ErrorMessage
              name="members_count"
              as="ion-text"
              class="error-message"
            />
          </div>

          <!-- Confirm Button -->
          <ion-button
            expand="block"
            type="submit"
            class="primary-confirm-button"
            :disabled="isSubmitting"
          >
            <template v-if="isSubmitting">Creating...</template>
            <template v-else>Confirm</template>
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToast,
  IonIcon, // Added for icons
  IonBadge, // Added for notification badge in top bar
} from "@ionic/vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, number } from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Iqub } from "@/types"; // Adjust path as needed

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  pencilOutline,
} from "ionicons/icons";

// Import CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const router = useRouter();

// --- Validation Schema (Keep your existing schema) ---
const validationSchema = toTypedSchema(
  object({
    name: string().required("Name is required"),
    saving_pattern: string().required("Saving Pattern is required"),
    saving_amount: number()
      .required("Saving Amount is required")
      .positive("Saving Amount must be positive"),
    credit_pattern: string().required("Credit Pattern is required"),
    credit_amount: number()
      .required("Credit Amount is required")
      .positive("Credit Amount must be positive"),
    members_count: number()
      .required("Members Count is required")
      .positive("Members Count must be positive")
      .integer("Members Count must be an integer")
      .min(2, "Members Count must be at least 2"),
  })
);

// --- Form Handling (Keep your existing useForm and submit logic) ---
const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    // Setting initial values for selects if needed, matching your schema
    saving_pattern: "1", // Default to Weekly
    credit_pattern: "1", // Default to Weekly
    // You might set a default/placeholder for members_count if appropriate
    // members_count: 10,
  },
});

const submit = handleSubmit(async (values) => {
  try {
    const data = {
      credit_amount: String(values.credit_amount),
      credit_pattern: Number(values.credit_pattern),
      members_count: String(values.members_count),
      name: values.name,
      saving_amount: String(values.saving_amount),
      saving_pattern: Number(values.saving_amount),
    };
    await store.dispatch("iqubs/createIqub", data);
    await IonToast.create({
      message: "Iqub created successfully!",
      duration: 2000,
      position: "top",
      color: "success",
    }).then((toast) => toast.present());
    // Navigate to My Iqubs page after successful creation
    router.push("/collector/my-iqubs"); // Ensure this route exists and is correct
  } catch (error: any) {
    console.error("Failed to create Iqub:", error); // Log error
    await IonToast.create({
      message: error.response?.data?.message || "Failed to create Iqub.",
      duration: 2000,
      position: "top",
      color: "danger",
    }).then((toast) => toast.present());
  }
});

// --- Event Handlers for Top Bar (Reused - Implement actual logic) ---
const openMenu = () => {
  console.log("Open menu clicked"); /* Implement menu logic */
};
const goToNotifications = () => {
  console.log("Notifications icon clicked"); /* Navigate */
};
</script>

<style scoped>
/* Re-use color variables (ideally globally in variables.css) */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0; /* Remove default padding */
  --padding-end: 0;
  display: block;
}

/* --- Top Bar Styles (Reused from Dashboard) --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--ion-color-wujo-primary);
  color: white;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.menu-icon,
.notification-icon {
  font-size: 24px;
  color: white;
  cursor: pointer;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
  flex-grow: 1;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notification-container {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  padding: 3px 5px;
  border-radius: 10px;
  --background: var(--ion-color-danger, #eb445a);
  color: white;
  z-index: 1;
}

/* --- Collector Tab Bar Styles (Reference) --- */
/* Styles defined in CollectorTabBar.vue. Add margin below it here. */
collector-tab-bar {
  display: block;
  margin-bottom: 20px; /* Space below the tab bar */
}

/* --- Main Form Content Area --- */
.form-content {
  padding: 20px; /* Add horizontal and vertical padding */
}

.page-heading {
  display: block; /* Ensure heading takes its own line */
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey); /* Darker color for heading */
  margin-bottom: 25px; /* Space below the heading */
  text-align: center; /* Center the heading */
}

/* Styling for each form field block (label + input/options) */
.form-field {
  margin-bottom: 20px; /* Space between form fields */
}

.field-label {
  display: block; /* Make label take its own line */
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey); /* Grey label text */
  margin-bottom: 8px; /* Space between label and input */
  font-weight: normal; /* Standard weight for label */
}

/* Wrapper for the input/select fields (adds border, padding, etc.) */
.input-wrapper {
  border: 1px solid var(--ion-color-wujo-grey); /* Grey border */
  border-radius: 8px; /* Rounded corners */
  padding: 0 12px; /* Internal horizontal padding */
  background: white; /* White background */
  display: flex; /* Use flex for aligning input/select and icons */
  align-items: center; /* Vertically center items */
}

/* Reset default styles for Ionic inputs/selects inside our wrapper */
.input-wrapper ion-input,
.input-wrapper ion-select {
  --padding-start: 0; /* Remove default ionic input padding */
  --padding-end: 0;
  --padding-top: 10px; /* Add some vertical padding */
  --padding-bottom: 10px; /* Add some vertical padding */
  --background: transparent; /* Use wrapper background */
  --highlight-color-focused: transparent; /* Remove focus highlight */
  --highlight-color-valid: transparent;
  --highlight-color-invalid: transparent;
  width: 100%; /* Make input take available space */
  flex-grow: 1; /* Allow input to grow */
  caret-color: var(
    --ion-color-wujo-primary,
    #006a52
  ); /* <-- You've correctly set caret-color */
}

/* Specific adjustments for ion-select */
.input-wrapper ion-select {
  padding-top: 0; /* Adjust vertical padding to align better */
  padding-bottom: 0;
}

/* Styling for the pencil icon inside the input wrapper */
.input-icon {
  font-size: 20px; /* Adjust icon size */
  color: var(--ion-color-wujo-text-grey); /* Grey icon color */
  margin-left: 8px; /* Space between input/select and icon */
  /* Disable pointer events if icon is just decorative */
  pointer-events: none;
}

/* Error message styling */
.error-message {
  color: var(--ion-color-danger); /* Ionic danger red */
  font-size: 0.85em; /* Slightly larger than default */
  display: block; /* Ensure it's on its own line */
  margin-top: 4px; /* Space above error message */
  padding-left: 5px; /* Slight indent */
}

/* Styling for the Confirm Button */
.primary-confirm-button {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(
    --ion-color-wujo-primary
  ); /* Keep green on active */
  --border-radius: 12px; /* Rounded corners */
  font-weight: bold;
  color: white;
  text-transform: capitalize; /* Capitalize text */
  height: 50px; /* Consistent button height */
  margin-top: 30px; /* Space above the button */
  /* Center the button */
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px; /* Example max-width for centering */
}

/* Disable button look when disabled */
.primary-confirm-button:disabled {
  opacity: 0.6; /* Make it slightly transparent */
}
</style>
