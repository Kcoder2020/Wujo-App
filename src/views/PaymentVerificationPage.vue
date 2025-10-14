<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Reused component/structure) -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <ion-text class="page-title">HI Collector</ion-text>
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <ion-badge color="danger" class="notification-badge">3</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar (Integrated) -->
      <!-- Assuming 'My Iqub' is active as it's a sub-view -->
      <collector-tab-bar active-tab="my-iqubs"></collector-tab-bar>

      <!-- Main Content Area for Verification Detail -->
      <div class="verification-detail-content">
        <!-- Page Heading -->
        <ion-text class="page-heading"><h2>Verification Detail</h2></ion-text>

        <!-- Loading Indicator -->
        <div
          v-if="paymentRoundDetailsStatus === 'loading'"
          class="loading-indicator"
        >
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading verification details...</ion-text>
        </div>

        <!-- Error Message -->
        <div
          v-else-if="
            paymentRoundDetailsStatus === 'error' && paymentRoundDetailsError
          "
          class="error-message"
        >
          <p>
            Error loading verification details: {{ paymentRoundDetailsError }}
          </p>
          <ion-button @click="retryFetchDetails">Retry</ion-button>
        </div>

        <!-- Verification Details Content (Visible when data is loaded) -->
        <div
          v-else-if="selectedPaymentRoundDetails"
          class="verification-details-container"
        >
          <!-- Key-Value Pairs -->
          <div class="detail-item">
            <ion-text class="detail-label">Payment Method:</ion-text>
            <ion-text class="detail-value">{{
              selectedPaymentRoundDetails.payment_method || "N/A"
            }}</ion-text>
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Payment date:</ion-text>
            <!-- Format the date as needed. Assuming payment_details exists and has payment_date -->
            <ion-text class="detail-value">{{
              formatPaymentDate(
                selectedPaymentRoundDetails.payment_details?.payment_date
              ) || "N/A"
            }}</ion-text>
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Bank Name:</ion-text>
            <!-- Format the date as needed. Assuming payment_details exists and has payment_date -->
            <ion-text class="detail-value">{{
              selectedPaymentRoundDetails.payment_details?.bank_name || "N/A"
            }}</ion-text>
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Payer Name:</ion-text>
            <!-- Format the date as needed. Assuming payment_details exists and has payment_date -->
            <ion-text class="detail-value">{{
              selectedPaymentRoundDetails.payment_details?.payer_name || "N/A"
            }}</ion-text>
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Payment Amount:</ion-text>
            <!-- Format the date as needed. Assuming payment_details exists and has payment_date -->
            <ion-text class="detail-value"
              >{{
                selectedPaymentRoundDetails.payment_details?.amount || "N/A"
              }}
              ETB</ion-text
            >
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Transaction Id:</ion-text>
            <!-- Assuming payment_details exists and has transaction_id -->
            <ion-text class="detail-value">{{
              selectedPaymentRoundDetails.payment_details?.transaction_id ||
              "N/A"
            }}</ion-text>
          </div>
          <div class="detail-item">
            <ion-text class="detail-label">Status:</ion-text>
            <!-- Assuming is_checked or a status field indicates verification status -->
            <ion-text class="detail-value">{{
              getStatusText(selectedPaymentRoundDetails)
            }}</ion-text>
          </div>

          <!-- Source Image Button -->
          <ion-button
            expand="block"
            fill="outline"
            class="source-image-button"
            @click="viewSourceImage"
          >
            Source Image
          </ion-button>

          <!-- Action Buttons (Approve/Deny) -->
          <!-- Hide buttons if already verified/rejected or while verifying -->
          <div
            class="verification-buttons-row"
            v-if="
              !isVerifying && !isVerifiedOrRejected(selectedPaymentRoundDetails)
            "
          >
            <ion-button
              expand="block"
              class="approve-button"
              @click="approvePayment"
              :disabled="isVerifying"
            >
              Approve
            </ion-button>
            <ion-button
              expand="block"
              class="deny-button"
              @click="denyPayment"
              :disabled="isVerifying"
            >
              Deny
            </ion-button>
          </div>
          <!-- Show a message if verification is in progress -->
          <div v-if="isVerifying" class="verifying-message">
            <ion-spinner name="dots" color="wujo-primary" />
            <ion-text>Submitting verification...</ion-text>
          </div>
          <!-- Show a message if already verified/rejected -->
          <div
            v-if="isVerifiedOrRejected(selectedPaymentRoundDetails)"
            class="status-message"
          >
            <ion-text
              :color="
                selectedPaymentRoundDetails.is_checked ? 'success' : 'danger'
              "
            >
              Payment is
              {{
                selectedPaymentRoundDetails.is_checked
                  ? "Verified"
                  : "Rejected"
              }}.
            </ion-text>
          </div>
        </div>
        <!-- Handle case where data is success but selectedPaymentRoundDetails is null -->
        <div
          v-else-if="
            paymentRoundDetailsStatus === 'success' &&
            !selectedPaymentRoundDetails
          "
          class="empty-state"
        >
          <ion-text>Payment round details not found.</ion-text>
        </div>
      </div>

      <!-- Toast for feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="3000"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonSpinner,
  IonIcon,
  IonBadge,
  IonButton,
  IonToast,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { PaymentRound } from "@/types";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import CollectorTabBar from "@/components/CollectorTabBar.vue";

// --- Store and Route Setup ---
const store = useStore();
const router = useRouter();
const route = useRoute();

const iqubId = computed(() => Number(route.params.iqubId));
const roundNumber = computed(() => Number(route.params.iqubId));

// const paymentRoundDetailsStatus = computed<string>(
//   () => store.getters["iqubs/paymentRoundDetailsStatus"]
// );
// const paymentRoundDetailsError = computed<string | null>(
//   () => store.getters["iqubs/paymentRoundDetailsError"]
// );

// ✅ Mock status (e.g., 'success', 'loading', or 'error')
const paymentRoundDetailsStatus = computed<string>(() => "success");

// --- Local Component State ---
const isVerifying = ref(false);
// const selectedPaymentRoundDetails = ref<PaymentRound | null>(null);

// ✅ Sample PaymentRound mock data
const selectedPaymentRoundDetails = ref<PaymentRound | null>({
  round_number: 7,
  is_checked: undefined,
  payment_details: {
    payer_name: "Alemseged Yimam",
    amount: 2200.0,
    payment_date: "2025-04-15T12:00:00Z",
    source_image_url:
      "https://imgv2-1-f.scribdassets.com/img/document/685286177/original/ba6297feaa/1?v=1",
    transaction_id: "FT23321WXWD5",
    bank_name: "CBE",
  },
  payment_method: "Bank Transfer",
});

// Toast State
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref<"success" | "danger" | "warning">("success");

// --- Fetch on Mount or Route Change ---
const fetchPaymentRoundDetails = async () => {
  if (!iqubId.value || !roundNumber.value) return;

  await store.dispatch("iqubs/fetchPaymentRoundDetails", {
    iqubId: iqubId.value,
    roundNumber: roundNumber.value,
  });

  const data = store.getters["iqubs/selectedPaymentRoundDetails"];
  selectedPaymentRoundDetails.value = data ?? null;
};

onMounted(fetchPaymentRoundDetails);
watch(
  () => [iqubId.value, roundNumber.value],
  () => {
    isVerifying.value = false;
    // fetchPaymentRoundDetails();
  }
);

// --- Event Handlers for Top Bar ---
const openMenu = () => console.log("Open menu clicked");
const goToNotifications = () => console.log("Notifications icon clicked");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Verification Actions ---
const approvePayment = async () => {
  // if (!iqubId.value || !roundNumber.value) return;

  isVerifying.value = true;
  showToast.value = false;

  try {
    // await store.dispatch("iqubs/verifyPaymentRound", {
    //   iqubId: iqubId.value,
    //   roundNumber: roundNumber.value,
    //   verificationStatus: "verified",
    // });

    // Add the 5-second wait here
    console.log("Waiting for 5 seconds...");
    await delay(5000); // 5000 milliseconds = 5 seconds
    console.log("Wait finished. Continuing with approval.");
    selectedPaymentRoundDetails.value = {
      ...selectedPaymentRoundDetails.value!,
      is_checked: true,
    };

    showToastMessage("Payment approved successfully.", "success");
    isVerifying.value = false;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to approve payment.";
    showToastMessage(errorMessage, "danger");
  } finally {
    isVerifying.value = false;
  }
};

const denyPayment = async () => {
  // if (!iqubId.value || !roundNumber.value) return;

  isVerifying.value = true;
  showToast.value = false;

  try {
    // await store.dispatch("iqubs/verifyPaymentRound", {
    //   iqubId: iqubId.value,
    //   roundNumber: roundNumber.value,
    //   verificationStatus: "rejected",
    // });

    // Add the 5-second wait here
    console.log("Waiting for 5 seconds...");
    await delay(5000); // 5000 milliseconds = 5 seconds
    console.log("Wait finished. Continuing with approval.");
    selectedPaymentRoundDetails.value = {
      ...selectedPaymentRoundDetails.value!,
      is_checked: false,
    };

    showToastMessage("Payment denied.", "danger");
    isVerifying.value = false;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to deny payment.";
    showToastMessage(errorMessage, "danger");
  } finally {
    isVerifying.value = false;
  }
};

// --- Source Image View ---
const viewSourceImage = () => {
  const imageUrl =
    selectedPaymentRoundDetails.value?.payment_details?.source_image_url;
  if (imageUrl) {
    window.open(imageUrl, "_blank");
  } else {
    showToastMessage("Source image URL not available.", "warning");
  }
};

// --- Utility Helpers ---
const showToastMessage = (
  message: string,
  color: "success" | "danger" | "warning"
) => {
  toastMessage.value = message;
  toastColor.value = color;
  showToast.value = true;
};

const formatPaymentDate = (dateString?: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString || "";
  }
};

const getStatusText = (roundDetails: PaymentRound | null): string => {
  if (!roundDetails) return "Unknown";
  if (roundDetails.is_checked === true) return "Verified";
  if (roundDetails.is_checked === false) return "Rejected";
  return "Pending";
};

const isVerifiedOrRejected = (roundDetails: PaymentRound | null): boolean => {
  if (!roundDetails) return false;
  return roundDetails.is_checked === true || roundDetails.is_checked === false;
};
</script>

<style scoped>
/* Re-use color variables */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
  --ion-color-wujo-red: #eb445a; /* Red color for Deny button */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block;
}

/* --- Top Bar Styles (Reused) --- */
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
collector-tab-bar {
  display: block;
  margin-bottom: 20px;
}

/* --- Main Verification Detail Content Area --- */
.verification-detail-content {
  padding: 0 20px; /* Horizontal padding */
  padding-bottom: 40px; /* Bottom padding */
}

/* --- Page Heading --- */
.page-heading {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 15px;
  text-align: center;
}

/* --- Loading, Error, Empty States (Reused) --- */
.loading-indicator,
.error-message,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
  width: 100%;
}
.error-message p,
.empty-state ion-text {
  color: var(--ion-color-wujo-text-grey);
  margin-top: 10px;
}
.loading-indicator ion-spinner {
  width: 30px;
  height: 30px;
  --color: var(--ion-color-wujo-primary);
}

/* --- Verification Details Container (The white block) --- */
.verification-details-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px; /* Internal padding */
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between detail items and buttons */
}

/* Styling for each key-value pair */
.detail-item {
  display: flex;
  justify-content: space-between; /* Push label and value to ends */
  font-size: 15px;
  /* Optional: Add border bottom for separation if needed */
  /* border-bottom: 1px solid #eee; */
  /* padding-bottom: 10px; */
}

.detail-label {
  font-weight: bold; /* Label is bold in design */
  color: var(--ion-color-wujo-dark-grey); /* Darker color for label */
  flex-shrink: 0; /* Prevent label from shrinking */
  margin-right: 10px; /* Space between label and value */
}

.detail-value {
  color: var(--ion-color-wujo-text-grey); /* Grey color for value */
  text-align: right; /* Align value to the right */
  flex-grow: 1; /* Allow value to take remaining space */
  word-break: break-word; /* Allow long values to break */
}

/* --- Source Image Button --- */
.source-image-button {
  --background: white;
  --color: var(--ion-color-wujo-text-grey); /* Grey text */
  --border-color: var(--ion-color-wujo-grey); /* Grey border */
  --border-radius: 8px;
  --border-width: 1px;
  font-size: 14px;
  font-weight: normal;
  text-transform: capitalize;
  height: 40px; /* Adjust height */
  /* Center button within the container */
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px; /* Limit width */
  margin-top: 10px; /* Space above button */
}
.source-image-button ion-icon {
  /* If adding icon */
  font-size: 18px;
  margin-right: 5px;
}

/* --- Verification Action Buttons Row --- */
.verification-buttons-row {
  display: flex;
  gap: 15px; /* Space between Approve and Deny buttons */
  margin-top: 20px; /* Space above the buttons */
}

/* Common styles for action buttons */
.verification-buttons-row ion-button {
  flex: 1; /* Distribute space equally */
  --border-radius: 12px;
  font-weight: bold;
  height: 50px;
  text-transform: capitalize;
}

/* Approve button style (Green) */
.approve-button {
  --background: var(
    --ion-color-success,
    #2fdf75
  ); /* Ionic default success green */
  --background-activated: var(--ion-color-success, #2fdf75);
  color: white;
}

/* Deny button style (Red) */
.deny-button {
  --background: var(--ion-color-danger, #eb445a); /* Ionic default danger red */
  --background-activated: var(--ion-color-danger, #eb445a);
  color: white;
}

/* Styles for verifying message / already verified message */
.verifying-message,
.status-message {
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.verifying-message ion-spinner {
  width: 24px;
  height: 24px;
  --color: var(--ion-color-wujo-primary);
}
.verifying-message ion-text,
.status-message ion-text {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
}
/* Color for verified/rejected status text */
.status-message ion-text[color="success"] {
  color: var(--ion-color-success);
}
.status-message ion-text[color="danger"] {
  color: var(--ion-color-danger);
}
/* Add styles for the rejected icon color */
.rejected-icon {
  color: var(--ion-color-danger, #eb445a); /* Red color for rejected */
}

/* Ensure Check column aligns items correctly */
.check-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Align icon to the right */
}

/* Adjust list-item-cell to use flexbox for centering content vertically */
.list-item-cell {
  display: flex;
  align-items: center; /* Center content vertically */
  min-width: 0; /* Prevent flex item from growing excessively */
  word-break: break-word;
  font-size: 14px;
  color: var(--ion-color-wujo-dark-grey);
}
</style>
