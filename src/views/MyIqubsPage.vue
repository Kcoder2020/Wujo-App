<template>
  <ion-page>
    <!-- Removed ion-header, using custom top bar within ion-content -->
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Menu, Title, Notification) - Reused component/structure -->
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
      <collector-tab-bar active-tab="my-iqubs"></collector-tab-bar>

      <!-- Action/Filter Button Row -->
      <div class="action-buttons-row">
        <ion-button fill="outline" size="small" class="action-button"
          >Copy</ion-button
        >
        <ion-button fill="outline" size="small" class="action-button"
          >Excel</ion-button
        >
        <ion-button fill="outline" size="small" class="action-button"
          >PDF</ion-button
        >
        <ion-button fill="outline" size="small" class="action-button"
          >Print</ion-button
        >
      </div>

      <!-- Main Content Area for List -->
      <div class="list-content">
        <!-- Page Heading -->
        <ion-text class="page-heading"><h2>List Of Iqubs</h2></ion-text>

        <!-- Loading Indicator -->
        <div v-if="iqubsStatus === 'loading'" class="loading-indicator">
          <IonSpinner name="dots" color="wujo-primary" />
          <ion-text>Loading Iqubs...</ion-text>
        </div>
        <!-- Error Message -->
        <div v-else-if="iqubsStatus === 'error'" class="error-message">
          <p>Error loading Iqubs: {{ iqubsError }}</p>
        </div>

        <!-- Iqubs List -->
        <div v-else class="iqubs-list-container">
          <!-- List Header -->
          <div class="list-header">
            <div class="header-item">Iqub Name</div>
            <div class="header-item">Total Collected Amount</div>
            <div class="header-item right-align">Hosted Lottery</div>
          </div>

          <!-- List Items -->
          <div
            v-for="iqub in myIqubs"
            :key="iqub.id"
            class="list-item"
            @click="() => ionRouter.push(`/iqub/${iqub.id}`)"
          >
            <div class="list-item-cell">{{ iqub.name }}</div>
            <div class="list-item-cell">{{ iqub.total_collected }}</div>
            <!-- Assuming hosted_lottery is the correct field for '8/10' like format -->
            <div class="list-item-cell right-align">
              {{ iqub.hosted_lottery }}
            </div>
          </div>

          <!-- Handle Empty State -->
          <div
            v-if="myIqubs.length === 0 && iqubsStatus === 'success'"
            class="empty-state"
          >
            <ion-text>No Iqubs found.</ion-text>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  // Removed IonHeader, IonToolbar, IonTitle, IonList, IonItem
  IonContent,
  IonLabel, // Keep Label if used elsewhere, otherwise remove
  IonInput, // Keep Input if used elsewhere, otherwise remove
  IonButton,
  IonSelect, // Keep Select if used elsewhere, otherwise remove
  IonSelectOption, // Keep SelectOption if used elsewhere, otherwise remove
  IonText,
  IonSpinner,
  IonIcon, // Added for icons
  IonBadge, // Added for notification badge in top bar
  menuController, // Import menuController
  useIonRouter,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { Iqub } from "@/types"; // Adjust the path as needed

// Import Icons
import { menuOutline, notificationsOutline } from "ionicons/icons";

// Import CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const router = useRouter();
const ionRouter = useIonRouter(); // 2. Get the IonRouter instance

// --- Vuex State & Getters ---
const myIqubs = computed<Iqub[]>(() => store.getters["iqubs/iqubs"]);
const iqubsStatus = computed<string>(() => store.state.iqubs.status); // Assuming status is like 'idle', 'loading', 'success', 'error'
const iqubsError = computed<string | null>(() => store.state.iqubs.error);

// --- Data Fetching ---
onMounted(() => {
  // Only fetch if list is empty and not already loading or errored
  if (
    myIqubs.value.length === 0 &&
    (iqubsStatus.value === "idle" || iqubsStatus.value === "error")
  ) {
    if (store.getters["auth/getUser"].id === 21) {
      let joined_iqubs = store.getters["auth/getUser"].joined_iqubs;
      store.dispatch("iqubs/setIqubs", joined_iqubs);
    } else {
      store.dispatch("iqubs/fetchMyIqubs");
    }
  }
});

// --- Event Handlers for Top Bar (Reused - Implement actual logic) ---
const openMenu = () => {
  console.log("Open menu clicked"); /* Implement menu logic */
  menuController.open("app-menu");
};
const goToNotifications = () => {
  // router.push("/notifications"); // Navigate to notifications page
  ionRouter.push("/notifications", "forward", "none");
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
/* Styles defined in CollectorTabBar.vue. Add margin below it here. */
collector-tab-bar {
  display: block;
  margin-bottom: 20px; /* Space below the tab bar */
}

/* --- Action Buttons Row --- */
.action-buttons-row {
  display: flex;
  justify-content: space-between; /* Align buttons to the left */
  gap: 8px; /* Space between buttons */
  padding: 0 20px 15px; /* Padding: top 0, horiz 20px, bottom 15px */
  background: white; /* White background behind buttons */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* Subtle shadow below the row */
  /* Optional: Add border-bottom if shadow is not enough separation */
  /* border-bottom: 1px solid #eee; */
  /* Allow wrapping if screen is too narrow */
  flex-wrap: wrap;
  height: 40px;
}

.action-button {
  --background: white; /* White background */
  --color: var(--ion-color-wujo-text-grey); /* Grey text */
  --border-color: var(--ion-color-wujo-grey); /* Grey border */
  --border-radius: 8px; /* Rounded corners */
  --border-width: 1px;
  font-size: 12px; /* Smaller font size */
  font-weight: normal;
  text-transform: capitalize;
  height: 20px; /* Smaller button height */
  /* Add some horizontal padding if default is too little */
  --padding-start: 12px;
  --padding-end: 12px;
  margin-top: 8px;
}
/* Style when button is pressed */
.action-button ion-activated {
  --background: var(
    --ion-color-wujo-light-grey
  ); /* Light grey background on press */
}

/* --- Main Content Area for List --- */
.list-content {
  padding: 0 20px; /* Add horizontal padding */
  padding-bottom: 40px; /* Padding at the very bottom */
}

.page-heading {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey); /* Darker color for heading */
  margin-bottom: 15px; /* Space below the heading */
  text-align: center; /* Center the heading */
}

/* --- Iqubs List Container --- */
.iqubs-list-container {
  background: white; /* White background for the list */
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  overflow: hidden; /* Hide overflow if content is wider than container */
  margin-top: 10px; /* Space above the list container */
}

/* --- List Header --- */
.list-header {
  display: flex; /* Arrange columns horizontally */
  background: var(--ion-color-wujo-primary); /* Dark green background */
  color: white; /* White text */
  padding: 12px 15px; /* Vertical and horizontal padding */
  font-size: 13px; /* Adjust font size */
  font-weight: bold;
  border-top-left-radius: 10px; /* Match container radius */
  border-top-right-radius: 10px;
}

.header-item {
  flex: 1; /* Distribute space */
  /* Set widths based on design */
  /* Example: Adjust flex-basis or flex-grow for column widths */
  /* flex-basis: 30%; */ /* Give Iqub Name more space */
  /* &:nth-child(2) { flex-basis: 40%; } */ /* Give amount more space */
  /* &:nth-child(3) { flex-basis: 30%; } */ /* Give hosted less space */

  /* Simple flex distribution, may need refinement */
  min-width: 0; /* Allow shrinking */
  word-break: break-word; /* Allow text to break */
}

.header-item:nth-child(1) {
  flex: 2;
} /* Iqub Name takes more space */
.header-item:nth-child(2) {
  flex: 2;
} /* Amount takes more space */
.header-item:nth-child(3) {
  flex: 1;
} /* Hosted Lottery takes less space */

/* --- List Items --- */
.list-item {
  display: flex; /* Arrange columns horizontally */
  padding: 12px 15px; /* Match header padding */
  background: white; /* White background */
  border-bottom: 1px solid #eee; /* Subtle separator line */
  cursor: pointer; /* Indicate clickable */
  transition: background-color 0.2s ease-in-out; /* Smooth hover/active effect */
}

/* Remove border from the last item */
.list-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 10px; /* Match container radius */
  border-bottom-right-radius: 10px;
}

/* Style on hover/active */
.list-item:hover,
.list-item:active {
  background-color: var(
    --ion-color-wujo-light-grey
  ); /* Light grey background on hover/active */
}

.list-item-cell {
  flex: 1; /* Distribute space */
  /* Match width distribution of header items */
  min-width: 0; /* Allow shrinking */
  word-break: break-word; /* Allow text to break */
  font-size: 14px; /* Adjust font size */
  color: var(--ion-color-wujo-dark-grey); /* Darker text color */
  display: flex; /* Use flex to align content */
  align-items: center; /* Vertically center text */
}

/* Match width distribution of header items */
.list-item-cell:nth-child(1) {
  flex: 2;
}
.list-item-cell:nth-child(2) {
  flex: 2;
}
.list-item-cell:nth-child(3) {
  flex: 1;
}

/* Right-align text in specific columns */
.right-align {
  text-align: right;
  justify-content: flex-end; /* Align content to the right in flexbox */
}

/* --- Loading & Error States --- */
.loading-indicator,
.error-message,
.empty-state {
  display: flex;
  flex-direction: column; /* Stack spinner/text vertically */
  justify-content: center;
  align-items: center;
  height: 200px; /* Give them a defined height to center within */
  text-align: center;
  /* Position relative to the list container if needed, or just centered in form-content */
  /* Assumed centered within the list-content padding area */
}

.error-message p,
.empty-state ion-text {
  color: var(--ion-color-wujo-text-grey); /* Use grey text color */
  margin-top: 10px; /* Space above text */
}

.loading-indicator ion-spinner {
  width: 30px; /* Adjust spinner size */
  height: 30px;
  --color: var(--ion-color-wujo-primary); /* Green spinner color */
}
</style>
