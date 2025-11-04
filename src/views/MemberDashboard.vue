<template>
  <ion-page>
    <!-- Removed ion-header, using custom top bar within ion-content -->
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Menu, Title, Notification) -->
      <div class="top-bar">
        <!-- Menu Icon -->
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>

        <!-- Page Title -->
        <ion-text class="page-title">HI Iquber</ion-text>

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

      <!-- Member Tab Bar -->
      <member-tab-bar></member-tab-bar>

      <!-- Main Dashboard Content Area -->
      <div class="dashboard-content">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <h1 class="welcome-text">Welcome to your Iqub Dashboard!</h1>
          <ion-button
            class="join-iqub-button"
            @click="goToJoinIqub"
            fill="solid"
          >
            Join Iqub
          </ion-button>
          <p class="info-text">
            Here you can view and manage your Iqub invitations using a unique
            code
          </p>
        </div>

        <!-- Summary Cards Grid -->
        <div class="summary-cards-grid">
          <!-- Total Iqub Joined Card -->
          <div class="summary-card">
            <ion-icon :icon="statsChartOutline" class="card-icon"></ion-icon>
            <ion-text class="card-title">Total Iqub joined</ion-text>
            <ion-text class="card-value">{{ totalIqubJoined }}</ion-text>
          </div>

          <!-- Total Finished Iqub Card -->
          <div class="summary-card">
            <ion-icon
              :icon="swapHorizontalOutline"
              class="card-icon"
            ></ion-icon>
            <ion-text class="card-title">Total Finished Iqub</ion-text>
            <ion-text class="card-value">{{ totalFinishedIqub }}</ion-text>
          </div>

          <!-- Total Saved Amount Card -->
          <div class="summary-card">
            <ion-text class="card-title">Total Saved Amount</ion-text>
            <ion-text class="card-value">{{ totalSavedAmount }}</ion-text>
          </div>

          <!-- Total Lottery Won Card -->
          <div class="summary-card">
            <ion-text class="card-title">Total lottery Won</ion-text>
            <ion-text class="card-value">{{ totalLotteryWon }}</ion-text>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <!-- Top Row: Line Chart and Bar Chart -->
          <div class="charts-row">
            <!-- Multi-Line Chart -->
            <div class="chart-container line-chart-container">
              <div class="chart-placeholder">
                <!-- SVG representation of multi-line chart -->
                <svg
                  viewBox="0 0 300 200"
                  class="chart-svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <!-- Grid lines -->
                  <defs>
                    <linearGradient
                      id="gridGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stop-color="#f0f0f0" />
                      <stop offset="100%" stop-color="#e0e0e0" />
                    </linearGradient>
                  </defs>
                  <!-- Y-axis grid lines -->
                  <line
                    x1="40"
                    y1="20"
                    x2="40"
                    y2="180"
                    stroke="#ddd"
                    stroke-width="1"
                  />
                  <line
                    x1="40"
                    y1="180"
                    x2="280"
                    y2="180"
                    stroke="#ddd"
                    stroke-width="1"
                  />
                  <!-- Sample data lines (simplified representation) -->
                  <polyline
                    points="50,150 80,120 110,100 140,80 170,90 200,70 230,60 260,50"
                    fill="none"
                    stroke="#4285f4"
                    stroke-width="2"
                  />
                  <polyline
                    points="50,140 80,110 110,90 140,70 170,80 200,60 230,50 260,40"
                    fill="none"
                    stroke="#ff9800"
                    stroke-width="2"
                  />
                  <polyline
                    points="50,130 80,100 110,80 140,60 170,70 200,50 230,40 260,30"
                    fill="none"
                    stroke="#34a853"
                    stroke-width="2"
                  />
                  <!-- Data points -->
                  <circle cx="50" cy="150" r="3" fill="#4285f4" />
                  <circle cx="80" cy="120" r="3" fill="#4285f4" />
                  <circle cx="110" cy="100" r="3" fill="#4285f4" />
                </svg>
              </div>
            </div>

            <!-- Vertical Bar Chart -->
            <div class="chart-container bar-chart-container">
              <div class="chart-placeholder">
                <!-- SVG representation of bar chart -->
                <svg
                  viewBox="0 0 300 200"
                  class="chart-svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <!-- Bars -->
                  <rect
                    x="40"
                    y="120"
                    width="30"
                    height="60"
                    fill="#4285f4"
                    rx="2"
                  />
                  <text x="55" y="115" text-anchor="middle" font-size="12">
                    20%
                  </text>
                  <rect
                    x="85"
                    y="100"
                    width="30"
                    height="80"
                    fill="#00bcd4"
                    rx="2"
                  />
                  <text x="100" y="95" text-anchor="middle" font-size="12">
                    30%
                  </text>
                  <rect
                    x="130"
                    y="80"
                    width="30"
                    height="100"
                    fill="#ff9800"
                    rx="2"
                  />
                  <text x="145" y="75" text-anchor="middle" font-size="12">
                    40%
                  </text>
                  <rect
                    x="175"
                    y="90"
                    width="30"
                    height="90"
                    fill="#ffc107"
                    rx="2"
                  />
                  <text x="190" y="85" text-anchor="middle" font-size="12">
                    25%
                  </text>
                  <rect
                    x="220"
                    y="70"
                    width="30"
                    height="110"
                    fill="#8bc34a"
                    rx="2"
                  />
                  <text x="235" y="65" text-anchor="middle" font-size="12">
                    36%
                  </text>
                  <!-- X-axis -->
                  <line
                    x1="40"
                    y1="180"
                    x2="280"
                    y2="180"
                    stroke="#ddd"
                    stroke-width="1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Monthly Line Chart with Percentages -->
          <div class="chart-container monthly-chart-container">
            <div class="chart-placeholder monthly-chart">
              <!-- SVG representation of monthly chart -->
              <svg
                viewBox="0 0 600 200"
                class="chart-svg monthly-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <!-- Background pattern (light blue) -->
                <rect
                  x="50"
                  y="20"
                  width="400"
                  height="140"
                  fill="#e3f2fd"
                  opacity="0.3"
                />
                <!-- Y-axis labels -->
                <text x="45" y="30" text-anchor="end" font-size="10">125</text>
                <text x="45" y="60" text-anchor="end" font-size="10">100</text>
                <text x="45" y="90" text-anchor="end" font-size="10">75</text>
                <text x="45" y="120" text-anchor="end" font-size="10">50</text>
                <text x="45" y="150" text-anchor="end" font-size="10">25</text>
                <!-- X-axis labels (months) -->
                <text x="70" y="175" text-anchor="middle" font-size="10">
                  Jan
                </text>
                <text x="100" y="175" text-anchor="middle" font-size="10">
                  Feb
                </text>
                <text x="130" y="175" text-anchor="middle" font-size="10">
                  Mar
                </text>
                <text x="160" y="175" text-anchor="middle" font-size="10">
                  Apr
                </text>
                <text x="190" y="175" text-anchor="middle" font-size="10">
                  May
                </text>
                <text x="220" y="175" text-anchor="middle" font-size="10">
                  Jun
                </text>
                <text x="250" y="175" text-anchor="middle" font-size="10">
                  Jul
                </text>
                <text x="280" y="175" text-anchor="middle" font-size="10">
                  Aug
                </text>
                <text x="310" y="175" text-anchor="middle" font-size="10">
                  Sep
                </text>
                <text x="340" y="175" text-anchor="middle" font-size="10">
                  Oct
                </text>
                <text x="370" y="175" text-anchor="middle" font-size="10">
                  Nov
                </text>
                <text x="400" y="175" text-anchor="middle" font-size="10">
                  Dec
                </text>
                <!-- Grid lines -->
                <line
                  x1="50"
                  y1="20"
                  x2="50"
                  y2="160"
                  stroke="#ddd"
                  stroke-width="1"
                />
                <line
                  x1="50"
                  y1="160"
                  x2="450"
                  y2="160"
                  stroke="#ddd"
                  stroke-width="1"
                />
                <!-- Sample lines (simplified) -->
                <polyline
                  points="70,120 100,110 130,100 160,90 190,85 220,80 250,75 280,70 310,65 340,60 370,55 400,50"
                  fill="none"
                  stroke="#00bcd4"
                  stroke-width="2"
                />
                <polyline
                  points="70,100 100,90 130,80 160,70 190,65 220,60 250,55 280,50 310,45 340,40 370,35 400,30"
                  fill="none"
                  stroke="#ff9800"
                  stroke-width="2"
                />
                <!-- Data points -->
                <circle cx="70" cy="120" r="3" fill="#00bcd4" />
                <circle cx="100" cy="110" r="3" fill="#00bcd4" />
                <circle cx="400" cy="50" r="3" fill="#00bcd4" />
                <circle cx="70" cy="100" r="3" fill="#ff9800" />
                <circle cx="100" cy="90" r="3" fill="#ff9800" />
                <circle cx="400" cy="30" r="3" fill="#ff9800" />
              </svg>
              <!-- Percentage indicators on the right -->
              <div class="percentage-indicators">
                <div class="percentage-item">
                  <div class="percentage-value">67%</div>
                  <div class="percentage-label">LOREM IPSUM</div>
                </div>
                <div class="percentage-item">
                  <div class="percentage-value">96%</div>
                  <div class="percentage-label">LOREM IPSUM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonText,
  IonBadge,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import {
  menuOutline,
  notificationsOutline,
  statsChartOutline,
  swapHorizontalOutline,
} from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";

const router = useRouter();

// Data Variables
const totalIqubJoined = ref("10");
const totalFinishedIqub = ref("65");
const totalSavedAmount = ref("10,000");
const totalLotteryWon = ref("12");
const notificationCount = ref(3);

// Event Handlers
const openMenu = () => {
  console.log("Open menu clicked");
};

const goToNotifications = () => {
  console.log("Notifications icon clicked");
};

const goToJoinIqub = () => {
  router.push("/member/join-iqub");
};
</script>

<style scoped>
/* Re-use color variables */
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
  display: block;
}

/* --- Top Bar Styles --- */
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

/* --- Member Tab Bar Styles --- */
member-tab-bar {
  display: block;
  margin-bottom: 20px;
  background: var(--ion-color-wujo-light-grey);
  padding: 0 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* --- Main Dashboard Content Area --- */
.dashboard-content {
  padding: 0 20px;
  padding-bottom: 40px;
}

/* --- Welcome Section --- */
.welcome-section {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 15px;
}

.join-iqub-button {
  --background: var(--ion-color-wujo-primary);
  --background-activated: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  height: 50px;
  margin-bottom: 15px;
  min-width: 200px;
}

.info-text {
  font-size: 14px;
  color: var(--ion-color-wujo-text-grey);
  margin-top: 10px;
  line-height: 1.5;
}

/* --- Summary Cards Grid --- */
.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.summary-card {
  background: #f0f2f5; /* Light grey background like in image */
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-icon {
  font-size: 36px;
  color: #555; /* Dark grey icon color */
  margin-bottom: 10px;
}

.card-title {
  font-size: 12px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 8px;
  font-weight: normal;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
}

/* --- Charts Section --- */
.charts-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.chart-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-placeholder {
  padding: 15px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-svg {
  width: 100%;
  height: auto;
  max-height: 180px;
}

.monthly-chart-container {
  width: 100%;
}

.monthly-chart {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  min-height: 200px;
}

.monthly-svg {
  flex: 1;
  max-height: 160px;
}

.percentage-indicators {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #e0e0e0;
}

.percentage-item {
  text-align: center;
}

.percentage-value {
  font-size: 36px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 5px;
}

.percentage-label {
  font-size: 12px;
  color: var(--ion-color-wujo-text-grey);
  text-transform: uppercase;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .monthly-chart {
    flex-direction: column;
  }

  .percentage-indicators {
    flex-direction: row;
    margin-left: 0;
    margin-top: 20px;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    width: 100%;
    justify-content: space-around;
  }
}
</style>
