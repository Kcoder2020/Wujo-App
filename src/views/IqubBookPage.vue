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

      <!-- Action/Filter Button Row (Copy Iqub Link - Design shows just one button here) -->
      <!-- Page 12 design shows Copy Iqub Link button like on Page 11 -->
      <div class="action-buttons-row centered-button">
        <ion-button
          fill="outline"
          size="small"
          class="copy-link-button"
          @click="copyIqubLink"
        >
          <ion-icon :icon="linkOutline"></ion-icon>
          Copy Iqub Link
        </ion-button>
      </div>

      <!-- Main Content Area for Rounds List -->
      <div class="list-content">
        <!-- Page Heading -->
        <!-- Design Page 12 title is just "Iqub Book", but list heading could be different -->
        <!-- Using "Iqub Book" as the main heading here -->
        <ion-text class="page-heading"><h2>Iqub Book</h2></ion-text>

        <!-- Loading Indicator -->
        <div v-if="paymentRoundsStatus === 'loading'" class="loading-indicator">
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading payment rounds...</ion-text>
        </div>

        <!-- Error Message -->
        <div
          v-else-if="paymentRoundsStatus === 'error' && paymentRoundsError"
          class="error-message"
        >
          <p>Error loading payment rounds: {{ paymentRoundsError }}</p>
          <ion-button @click="retryFetchRounds">Retry</ion-button>
        </div>

        <!-- Rounds List -->
        <div v-else class="rounds-list-container">
          <!-- List Header -->
          <div class="list-header">
            <div class="header-item">Collected Rounds</div>
            <div class="header-item">Payment</div>
            <div class="header-item right-align">Check</div>
          </div>

          <!-- List Items -->
          <div
            v-for="round in iqubPaymentRounds"
            :key="round.round_number"
            class="list-item"
            @click="() => goToPaymentVerification(round.round_number)"
          >
            <!-- Assuming PaymentRound type has round_number, payment_method, and is_checked -->
            <div class="list-item-cell">Round {{ round.round_number }}</div>
            <div class="list-item-cell">{{ round.payment_method || "-" }}</div>
            <div class="list-item-cell right-align check-cell">
              <ion-icon
                :icon="round.is_checked ? checkboxOutline : squareOutline"
                :class="{
                  'checked-icon': round.is_checked,
                  'unchecked-icon': !round.is_checked,
                }"
              ></ion-icon>
            </div>
          </div>

          <!-- Handle Empty State -->
          <div
            v-if="
              iqubPaymentRounds.length === 0 &&
              paymentRoundsStatus === 'success'
            "
            class="empty-state"
          >
            <ion-text>No payment rounds found for this Iqub.</ion-text>
          </div>
        </div>
      </div>
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
  IonButton, // Import IonButton for the copy link and retry
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router"; // Import useRoute
import { computed, onMounted, watch } from "vue";
import { PaymentRound } from "@/types"; // Import the PaymentRound type

// Import Icons
import {
  menuOutline,
  notificationsOutline,
  linkOutline, // For copy link button
  checkboxOutline, // For checked box
  squareOutline, // For unchecked box
} from "ionicons/icons";

// Import CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const router = useRouter();
const route = useRoute(); // Get the current route

// Get the Iqub ID from the route parameter
const iqubId = computed(() => Number(route.params.id)); // Assuming route path is /iqub-book/:id

// // --- Vuex State & Getters for Payment Rounds ---
// const iqubPaymentRounds = computed<PaymentRound[]>(
//   () => store.getters["iqubs/iqubPaymentRounds"]
// );
// const paymentRoundsStatus = computed<string>(
//   () => store.getters["iqubs/paymentRoundsStatus"]
// ); // Use the dedicated status
// const paymentRoundsError = computed<string | null>(
//   () => store.getters["iqubs/paymentRoundsError"]
// ); // Use the dedicated error

function createFallbackPaymentRoundsData(): PaymentRound[] {
  const roundsData: PaymentRound[] = [];
  const paymentMethods = ["Mobile Money", "Cash Payment", "Bank Transfer"];

  for (let i = 1; i <= 105; i++) {
    let paymentMethod: string;
    let isChecked: boolean;

    if (i === 105) {
      // Specific rule for the last round
      paymentMethod = "Bank Transfer";
      isChecked = false;
    } else {
      // Rules for rounds 1 to 104
      const randomIndex = Math.floor(Math.random() * paymentMethods.length);
      paymentMethod = paymentMethods[randomIndex];
      isChecked = true;
    }

    roundsData.push({
      round_number: i,
      payment_method: paymentMethod,
      is_checked: isChecked,
    });
  }
  console.log("Fallback payment rounds data generated."); // Log to confirm generation
  return roundsData;
}

// --- Generate the fallback data ONCE and store it ---
const fallbackPaymentRounds: PaymentRound[] = createFallbackPaymentRoundsData();

// --- Vuex State & Getters for Payment Rounds ---
// Fetch the list of payment rounds for the selected Iqub.
// Fallback to mock data if UI testing is enabled or data is missing.
const iqubPaymentRounds = computed<PaymentRound[]>(() => {
  const rounds = store.getters["iqubs/iqubPaymentRounds"];
  if (rounds?.length) return rounds;

  // --- Default Mock Data for UI Testing ---
  return fallbackPaymentRounds;
});

// Reflects the loading status of the payment rounds.
// Used to show loading spinner or error UI.
const paymentRoundsStatus = computed<string>(() => {
  const status = store.getters["iqubs/paymentRoundsStatus"];
  return status || "success"; // Default to "success" during UI testing
});

// Error message if fetching payment rounds failed.
// Displayed in the error section of the template.
const paymentRoundsError = computed<string | null>(() => {
  const error = store.getters["iqubs/paymentRoundsError"];
  return error ?? null;
});

// --- Data Fetching ---
onMounted(() => {
  // Fetch payment rounds when the component mounts IF:
  // 1. We have an iqubId
  // 2. The status is idle or error (meaning no successful fetch or a previous fetch failed)
  // Note: We might not need to watch route.params.id here if this page is only accessed
  // from a specific IqubDetail link and not via direct navigation between different Iqub Books.
  // If direct navigation is possible, add the watch similar to IqubDetailPage.
  // if (
  //   iqubId.value &&
  //   (paymentRoundsStatus.value === "idle" ||
  //     paymentRoundsStatus.value === "error")
  // ) {
  //   store.dispatch("iqubs/fetchIqubPaymentRounds", iqubId.value);
  // }
});

// Optional: Watch route.params.id if navigating directly between Iqub Books is possible
// watch(() => route.params.id, (newId) => {
//     const newIqubId = Number(newId);
//      if (newIqubId && newIqubId !== iqubId.value) { // Check if ID actually changed
//         store.dispatch("iqubs/fetchIqubPaymentRounds", newIqubId);
//      }
// });

// --- Event Handlers for Top Bar (Reused) ---
const openMenu = () => {
  console.log("Open menu clicked"); /* Implement menu logic */
};
const goToNotifications = () => {
  console.log("Notifications icon clicked"); /* Navigate */
};

// --- Action Button Handlers ---
// Placeholder function for Copy Iqub Link (you might need the Iqub ID or link from somewhere)
const copyIqubLink = async () => {
  // You would need the actual Iqub Link or ID to copy
  // Maybe fetch the specific iqub data or pass the link from the previous page?
  // For now, using a placeholder message
  console.log("Copy Iqub Link clicked for Iqub ID:", iqubId.value);
  // Example: if you have the iqub ID and your API provides a way to get the join link
  // const iqubDetails = computed(() => store.getters["iqubs/getIqubById"](iqubId.value));
  // if (iqubDetails.value?.join_link) {
  //    await navigator.clipboard.writeText(iqubDetails.value.join_link);
  //    // Show success toast
  // } else {
  //    // Show error/warning toast
  // }
  // For this page based on design, copying just the ID might be intended:
  if (iqubId.value) {
    try {
      await navigator.clipboard.writeText(iqubId.value.toString());
      console.log("Iqub ID copied:", iqubId.value);
      // show success toast
    } catch (err) {
      console.error("Failed to copy Iqub ID: ", err);
      // show error toast
    }
  } else {
    console.warn("Iqub ID not available to copy.");
    // show warning toast
  }
};

// Method to retry fetching payment rounds
const retryFetchRounds = () => {
  if (iqubId.value) {
    store.dispatch("iqubs/fetchIqubPaymentRounds", iqubId.value);
  }
};

// Method to navigate to Payment Verification page (Page 13)
const goToPaymentVerification = (roundNumber: number) => {
  console.log(
    `Navigate to verification for Iqub ${iqubId.value}, Round ${roundNumber}`
  );
  // Navigate to the verification page, passing the Iqub ID and Round Number as params
  // Example route: /iqub-book/:iqubId/round/:roundNumber/verify
  // router.push(`/collector/iqub/${iqubId.value}/round/${roundNumber}/verify`);
  let roundNum = 1;
  router.push(`/collector/payment-verify/${roundNum}`);
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

/* --- Action Buttons Row (Adapted for single button) --- */
.action-buttons-row.centered-button {
  display: flex;
  justify-content: center; /* Center the button horizontally */
  padding: 0 20px 15px;
  background: white; /* Match design background */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  /* Optional: Add border-bottom */
  /* border-bottom: 1px solid #eee; */
}

/* Reuse copy link button style from Iqub Detail */
.copy-link-button {
  --background: white;
  --color: var(--ion-color-wujo-text-grey);
  --border-color: var(--ion-color-wujo-grey);
  --border-radius: 8px;
  --border-width: 1px;
  font-size: 13px;
  font-weight: normal;
  text-transform: capitalize;
  height: 36px;
  /* No need for auto margins here as flex container centers it */
  margin: 0;
}
.copy-link-button ion-icon {
  font-size: 18px;
  margin-right: 5px;
}

/* --- Main Content Area for Rounds List --- */
.list-content {
  padding: 0 20px; /* Add horizontal padding */
  padding-bottom: 40px; /* Padding at the very bottom */
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

/* --- Rounds List Container (Similar to Members List) --- */
.rounds-list-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 10px; /* Space above the list container */
}

/* --- List Header (Adapted) --- */
.list-header {
  display: flex;
  background: var(--ion-color-wujo-primary);
  color: white;
  padding: 12px 15px;
  font-size: 13px;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.header-item {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  /* Adjust column widths based on design Page 12 */
  /* Collected Rounds, Payment, Check */
}
.list-header .header-item:nth-child(1) {
  flex: 2;
} /* Collected Rounds */
.list-header .header-item:nth-child(2) {
  flex: 2;
} /* Payment */
.list-header .header-item:nth-child(3) {
  flex: 1;
} /* Check */

/* --- List Items (Adapted) --- */
.list-item {
  display: flex;
  padding: 12px 15px;
  background: white;
  border-bottom: 1px solid #eee;
  cursor: pointer; /* Indicate clickable to go to verification */
  transition: background-color 0.2s ease-in-out;
}
.list-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.list-item:hover,
.list-item:active {
  background-color: var(--ion-color-wujo-light-grey);
}

.list-item-cell {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  font-size: 14px;
  color: var(--ion-color-wujo-dark-grey);
  display: flex;
  align-items: center;
}

/* Match width distribution of header items */
.list-item .list-item-cell:nth-child(1) {
  flex: 2;
}
.list-item .list-item-cell:nth-child(2) {
  flex: 2;
}
.list-item .list-item-cell:nth-child(3) {
  flex: 1;
}

/* Right-align text in specific columns */
.right-align {
  text-align: right;
  justify-content: flex-end;
}

/* Style for the check column content */
.check-cell ion-icon {
  font-size: 24px; /* Adjust icon size */
}
.check-cell .checked-icon {
  color: var(--ion-color-success, #2fdf75); /* Green color for checked */
}
.check-cell .unchecked-icon {
  color: var(--ion-color-wujo-grey); /* Grey color for unchecked */
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
</style>
