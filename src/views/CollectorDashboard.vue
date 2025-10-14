<template>
  <ion-page>
    <!-- Removed ion-header, using custom top bar within ion-content -->
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Menu, Title, Notification) -->
      <div class="top-bar">
        <!-- Menu Icon (Placeholder) -->
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <!-- Assuming you have a menu -->

        <!-- Page Title -->
        <ion-text class="page-title">HI Collector</ion-text>

        <!-- Notification Icon and Badge -->
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <ion-badge color="danger" class="notification-badge">{{
            notificationCount
          }}</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar (Dashboard, Create Iqub, My Iqub, Profile) -->
      <!-- Assuming CollectorTabBar component handles the visual tabs/buttons -->
      <!-- Pass prop to indicate the active tab -->
      <collector-tab-bar></collector-tab-bar>
      <!-- Main Dashboard Content Area -->
      <div class="dashboard-content">
        <!-- Summary Cards Grid -->
        <div class="summary-cards-grid">
          <!-- Total Collected Amount Card -->
          <div class="summary-card">
            <ion-icon :icon="statsChartOutline" class="card-icon"></ion-icon>
            <!-- Example icon -->
            <ion-text class="card-title">Total Collected Amount</ion-text>
            <ion-text class="card-value">{{ totalCollectedAmount }}</ion-text>
          </div>
          <!-- Total Members Card -->
          <div class="summary-card">
            <ion-icon :icon="peopleOutline" class="card-icon"></ion-icon>
            <!-- Example icon -->
            <ion-text class="card-title">Total Members</ion-text>
            <ion-text class="card-value">{{ totalMembers }}</ion-text>
          </div>
          <!-- Total Iqub Card -->
          <div class="summary-card">
            <ion-icon :icon="starOutline" class="card-icon"></ion-icon>
            <!-- Example icon -->
            <ion-text class="card-title">Total Iqub</ion-text>
            <ion-text class="card-value">{{ totalIqub }}</ion-text>
          </div>
          <!-- Total Lottery Card -->
          <div class="summary-card">
            <ion-icon
              :icon="swapHorizontalOutline"
              class="card-icon"
            ></ion-icon>
            <!-- Example icon -->
            <ion-text class="card-title">Total Lottery</ion-text>
            <ion-text class="card-value">{{ totalLottery }}</ion-text>
          </div>
        </div>

        <!-- Charts Section -->
        <!-- Note: Implementing full charts requires a charting library (e.g., Chart.js, ApexCharts) -->
        <!-- For UI, we'll add placeholders or basic visual elements -->
        <div class="charts-section">
          <!-- Placeholder for Line Chart -->
          <div class="chart-placeholder line-chart">
            <!-- Add chart library component here -->
            <!-- Example: <LineChart :data="lineChartData" /> -->
            <!-- Or use a placeholder image -->
            <img
              src="@/assets/img/damay3month2.png"
              alt="Line Chart"
              v-if="!hasLineChartComponent"
              style="width: 100%; height: auto"
            />
            <ion-text v-if="!hasLineChartComponent"
              >Damay Iqub - Monthly Savings Collection (First 3
              Months)</ion-text
            >
          </div>
          <!-- Placeholder for Bar Chart -->
          <!-- <div class="chart-placeholder bar-chart">
            <img
              src="@/assets/img/bar-chart-placeholder.png"
              alt="Bar Chart"
              v-if="!hasBarChartComponent"
            />
            <ion-text v-if="!hasBarChartComponent"
              >Bar Chart Placeholder</ion-text
            >
          </div> -->
        </div>

        <!-- Host Lottery Button -->
        <div class="button-container">
          <ion-button
            expand="block"
            class="host-lottery-button"
            @click="hostLottery"
          >
            Host Lottery
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"; // Import onMounted if fetching data
import {
  IonPage,
  // Removed IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel
  IonContent,
  IonIcon, // For icons
  IonText, // For text elements
  IonBadge, // For the notification count badge
  IonButton, // For the main action button
} from "@ionic/vue";

import { useRouter } from "vue-router"; // Import useRouter
import { useStore } from "vuex"; // Import useStore if fetching data

// Import icons that visually match the design or are appropriate
import {
  menuOutline, // For the hamburger menu
  notificationsOutline, // For the notification bell
  statsChartOutline, // Example icon for Total Collected Amount
  peopleOutline, // Example icon for Total Members
  starOutline, // Example icon for Total Iqub
  swapHorizontalOutline, // Example icon for Total Lottery (like a transaction/swap)
} from "ionicons/icons";

// Import the CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const router = useRouter();
const store = useStore(); // Get the store instance

// --- Data Variables (Placeholder - Replace with actual data fetching) ---
// You will likely fetch this data from your Vuex store or an API call
const totalCollectedAmount = ref("520,000 ETB");
const totalMembers = ref("5");
const totalIqub = ref("1");
const totalLottery = ref("5"); // Assuming this is the total number of lotteries hosted? Or won? Clarify this data point.
const notificationCount = ref(3); // Example notification count

// Placeholder flags - set to false if you are using chart components
const hasLineChartComponent = ref(false);
const hasBarChartComponent = ref(false);

// Example: Fetch data on component mount
// onMounted(async () => {
//   try {
//     // Assuming you have a store action to fetch collector dashboard data
//     await store.dispatch('collector/fetchDashboardData');
//     const data = store.getters['collector/dashboardData']; // Assuming a getter exists

//     totalCollectedAmount.value = data.totalCollectedAmount;
//     totalMembers.value = data.totalMembers;
//     totalIqub.value = data.totalIqub;
//     totalLottery.value = data.totalLottery; // Or data.totalLotteriesHosted?
//     notificationCount.value = data.notificationCount;
//     // You would also fetch data for your charts here
//     // lineChartData.value = data.lineChartData;
//     // barChartData.value = data.barChartData;

//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     // Handle error (e.g., show a message)
//   }
// });
// --- End Data Variables ---

// --- Event Handlers ---

const openMenu = () => {
  console.log("Open menu clicked");
  // Implement logic to open the side menu/drawer
  // Example with Ionic's menu controller:
  // import { menuController } from '@ionic/vue';
  // menuController.open('your-menu-id');
};

const goToNotifications = () => {
  console.log("Notifications icon clicked");
  // router.push('/notifications'); // Navigate to notifications page
};

const hostLottery = () => {
  console.log("Host Lottery button clicked");
  // Implement the logic for hosting a lottery
  // This might navigate to a new page, open a modal, etc.
  // router.push('/create-lottery'); // Example navigation
};

// goToMyIqubs and goToCreateIqub functions from the original code
// are not directly used by elements in this dashboard template now,
// as navigation is assumed to be handled by the CollectorTabBar component.
// Keep them if they are used elsewhere or you plan to add links back to them.
// const goToMyIqubs = () => { router.push("/my-iqubs"); };
// const goToCreateIqub = () => { router.push("/create-iqub"); };
</script>

<style scoped>
/* Re-use color variables defined earlier (ideally globally in variables.css) */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-text-grey: #555; /* Grey text */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block; /* Allow content to flow */
}

/* --- Top Bar Styles --- */
.top-bar {
  display: flex;
  justify-content: space-between; /* Pushes menu left, notification right */
  align-items: center;
  padding: 15px 20px; /* Vertical and horizontal padding */
  background: var(--ion-color-wujo-primary); /* Dark green background */
  color: white; /* White icons and text */
  position: relative; /* Needed for badge positioning */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
  z-index: 10; /* Ensure it's above other content if sticky/fixed */
}

.menu-icon,
.notification-icon {
  font-size: 24px;
  color: white; /* Icons are white in the design */
  cursor: pointer; /* Indicate clickable */
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: white; /* Title text is white */
  flex-grow: 1; /* Allow title space to center */
  text-align: center; /* Center the title visually */
  /* Adjust margin if icon space is fixed */
  margin-left: 20px; /* Offset title from menu icon */
  margin-right: 20px; /* Offset title from notification icon */
  /* Prevent text wrapping if possible, or handle overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Notification icon and badge container */
.notification-container {
  position: relative; /* Container for the badge */
  width: 24px; /* Give it a fixed size */
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* Indicate clickable */
}

.notification-badge {
  position: absolute;
  top: -5px; /* Position above the icon */
  right: -5px; /* Position to the right of the icon */
  font-size: 10px; /* Smaller font size */
  padding: 3px 5px; /* Adjust padding */
  border-radius: 10px; /* Fully round badge */
  --background: var(--ion-color-danger, #eb445a); /* Default ionic danger red */
  color: white;
  /* Ensure badge is on top */
  z-index: 1;
}

/* --- Collector Tab Bar Styles --- */
/* This component's styling is likely handled within CollectorTabBar.vue */
/* Add margin below the tab bar to separate it from dashboard content */
collector-tab-bar {
  display: block; /* Ensure it takes full width */
  margin-bottom: 20px; /* Space below the tab bar */
  /* Add background if it's not handled in the component itself */
  background: var(--ion-color-wujo-light-grey);
  /* Add horizontal padding if not handled internally */
  padding: 0 10px; /* Example padding */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* Optional: add subtle shadow below tabs */
}

/* --- Main Dashboard Content Area --- */
.dashboard-content {
  padding: 0 20px; /* Horizontal padding for the content sections */
  padding-bottom: 40px; /* Padding at the very bottom before potential footers */
}

/* --- Summary Cards Grid --- */
.summary-cards-grid {
  display: grid;
  /* Responsive grid: min width 150px, max 1fr, auto-fit columns */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px; /* Space between grid items */
  margin-bottom: 30px; /* Space below the grid */
}

.summary-card {
  background: white; /* White background for cards */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  text-align: center;
}

.card-icon {
  font-size: 36px; /* Adjust icon size */
  color: var(--ion-color-wujo-primary); /* Green icon color */
  margin-bottom: 10px; /* Space below icon */
}

.card-title {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey); /* Grey text */
  margin-bottom: 5px; /* Space below title */
}

.card-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey); /* Darker text for value */
}

/* --- Charts Section --- */
.charts-section {
  display: flex;
  flex-direction: column; /* Stack charts vertically by default */
  gap: 20px; /* Space between charts */
  margin-bottom: 30px; /* Space below charts */
}

/* Placeholder styles for charts */
.chart-placeholder {
  background: white; /* Or light grey */
  border-radius: 10px;
  padding: 15px; /* Padding inside the chart container */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%; /* Full width on small screens */
  min-height: 300px; /* Ensure a minimum height */
  display: flex; /* Use flex to center content/image if needed */
  flex-direction: column; /* Stack image and text placeholder */
  align-items: center;
  justify-content: center;
  color: var(--ion-color-wujo-text-grey); /* Color for text placeholder */
  font-size: 16px;
}

.chart-placeholder img {
  max-width: 100%; /* Ensure image fits */
  max-height: 180px; /* Limit image height */
  object-fit: contain;
  margin-bottom: 10px; /* Space below image */
}

/* Media query for larger screens to place charts side-by-side */
@media (min-width: 768px) {
  .charts-section {
    flex-direction: row; /* Arrange charts horizontally */
  }
  .chart-placeholder {
    flex: 1; /* Allow charts to take equal width */
  }
}

/* --- Host Lottery Button Container --- */
.button-container {
  text-align: center; /* Center the button */
  margin-top: 20px; /* Space above the button */
  margin-bottom: 20px; /* Space below the button */
}

.host-lottery-button {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(--ion-color-wujo-primary); /* Keep green on tap */
  --border-radius: 12px; /* Rounded corners */
  font-weight: bold;
  color: white;
  text-transform: capitalize; /* Capitalize text */
  height: 50px; /* Consistent height */
  /* Center the button if it's not full width */
  display: block; /* Make it a block element */
  margin-left: auto; /* Auto margins horizontally centers block elements */
  margin-right: auto;
  max-width: 300px; /* Limit max-width to match design appearance */
}
</style>
