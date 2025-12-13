<template>
  <ion-page>
    <ion-content :fullscreen="true" class="dashboard-content-wrapper">
      <!-- Premium Hero Header Section -->
      <div class="hero-header">
        <div class="hero-background"></div>
        <div class="hero-content">
          <!-- Top Bar -->
          <div class="top-bar">
            <ion-button fill="clear" @click="openMenu" class="menu-button">
              <ion-icon :icon="menuOutline" class="menu-icon"></ion-icon>
            </ion-button>

            <div class="notification-container" @click="goToNotifications">
              <ion-icon
                :icon="notificationsOutline"
                class="notification-icon"
              ></ion-icon>
              <ion-badge
                v-if="notificationCount > 0"
                class="notification-badge"
              >
                {{ notificationCount }}
              </ion-badge>
            </div>
          </div>

          <!-- Personalized Greeting -->
          <div class="greeting-section">
            <h1 class="greeting-title">Welcome Back,</h1>
            <h2 class="user-name">{{ userName }}</h2>
            <p class="greeting-subtitle">Here's your Iqub overview</p>
          </div>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="main-content">
        <!-- Premium Summary Cards -->
        <div class="summary-section">
          <h3 class="section-title">Overview</h3>
          <div class="summary-cards-grid">
            <!-- Total Collected Amount Card -->
            <div class="premium-card" @click="viewDetails('collected')">
              <div class="card-header">
                <div class="card-icon-container">
                  <ion-icon :icon="walletOutline" class="card-icon"></ion-icon>
                </div>
                <div class="card-trend positive">
                  <ion-icon
                    :icon="trendingUpOutline"
                    class="trend-icon"
                  ></ion-icon>
                  <span>+12%</span>
                </div>
              </div>
              <div class="card-body">
                <p class="card-label">Total Collected</p>
                <h3 class="card-value">
                  {{ formatCurrency(totalCollectedAmount) }}
                </h3>
                <p class="card-subtitle">ETB</p>
              </div>
              <!-- Circular Progress Ring -->
              <div class="progress-ring">
                <svg width="60" height="60">
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="rgba(95, 217, 172, 0.2)"
                    stroke-width="4"
                    fill="none"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="var(--ion-color-medium-aquamarine)"
                    stroke-width="4"
                    fill="none"
                    :stroke-dasharray="progressDashArray"
                    :stroke-dashoffset="collectedProgress"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <span class="progress-text">{{ collectedPercentage }}%</span>
              </div>
            </div>

            <!-- Total Members Card -->
            <div class="premium-card" @click="viewDetails('members')">
              <div class="card-header">
                <div class="card-icon-container">
                  <ion-icon :icon="peopleOutline" class="card-icon"></ion-icon>
                </div>
                <div class="card-trend positive">
                  <ion-icon
                    :icon="trendingUpOutline"
                    class="trend-icon"
                  ></ion-icon>
                  <span>+3</span>
                </div>
              </div>
              <div class="card-body">
                <p class="card-label">Total Members</p>
                <h3 class="card-value">{{ totalMembers }}</h3>
                <p class="card-subtitle">Active</p>
              </div>
            </div>

            <!-- Total Iqubs Card -->
            <div class="premium-card" @click="viewDetails('iqubs')">
              <div class="card-header">
                <div class="card-icon-container">
                  <ion-icon :icon="layersOutline" class="card-icon"></ion-icon>
                </div>
              </div>
              <div class="card-body">
                <p class="card-label">Active Iqubs</p>
                <h3 class="card-value">{{ totalIqub }}</h3>
                <p class="card-subtitle">Running</p>
              </div>
            </div>

            <!-- Total Lottery Card -->
            <div class="premium-card" @click="viewDetails('lottery')">
              <div class="card-header">
                <div class="card-icon-container">
                  <ion-icon :icon="trophyOutline" class="card-icon"></ion-icon>
                </div>
              </div>
              <div class="card-body">
                <p class="card-label">Lotteries Hosted</p>
                <h3 class="card-value">{{ totalLottery }}</h3>
                <p class="card-subtitle">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="quick-actions-section">
          <h3 class="section-title">Quick Actions</h3>
          <div class="action-buttons-grid">
            <ion-button class="action-button" @click="goToCreateIqub">
              <ion-icon :icon="addCircleOutline" class="action-icon"></ion-icon>
              <span>Create Iqub</span>
            </ion-button>
            <ion-button class="action-button" @click="addMember">
              <ion-icon :icon="personAddOutline" class="action-icon"></ion-icon>
              <span>Add Member</span>
            </ion-button>
            <ion-button class="action-button" @click="hostLottery">
              <ion-icon :icon="trophyOutline" class="action-icon"></ion-icon>
              <span>Host Lottery</span>
            </ion-button>
            <ion-button class="action-button" @click="viewReports">
              <ion-icon
                :icon="documentTextOutline"
                class="action-icon"
              ></ion-icon>
              <span>View Reports</span>
            </ion-button>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="activity-section">
          <div class="section-header">
            <h3 class="section-title">Recent Activity</h3>
            <ion-button fill="clear" size="small" @click="viewAllActivity">
              View All
              <template #end>
                <ion-icon :icon="chevronForwardOutline"></ion-icon>
              </template>
            </ion-button>
          </div>

          <div v-if="isLoadingActivity" class="activity-skeleton">
            <ion-skeleton-text
              animated
              style="width: 100%; height: 60px; margin-bottom: 10px"
              v-for="i in 3"
              :key="i"
            ></ion-skeleton-text>
          </div>

          <div v-else-if="recentActivities.length > 0" class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
              @click="viewActivityDetail(activity)"
            >
              <div class="activity-icon-container" :class="activity.type">
                <ion-icon :icon="getActivityIcon(activity.type)"></ion-icon>
              </div>
              <div class="activity-content">
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-description">{{ activity.description }}</p>
                <p class="activity-time">
                  {{ formatTime(activity.timestamp) }}
                </p>
              </div>
              <ion-icon
                :icon="chevronForwardOutline"
                class="activity-arrow"
              ></ion-icon>
            </div>
          </div>

          <div v-else class="empty-state">
            <ion-icon :icon="documentTextOutline" class="empty-icon"></ion-icon>
            <p>No recent activity</p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <h3 class="section-title">Performance Overview</h3>
          <div class="chart-container">
            <div class="chart-header">
              <h4>Monthly Collections</h4>
              <ion-segment value="3months" @ionChange="changeChartPeriod">
                <ion-segment-button value="1month">
                  <ion-label>1M</ion-label>
                </ion-segment-button>
                <ion-segment-button value="3months">
                  <ion-label>3M</ion-label>
                </ion-segment-button>
                <ion-segment-button value="6months">
                  <ion-label>6M</ion-label>
                </ion-segment-button>
              </ion-segment>
            </div>
            <div class="chart-placeholder">
              <img
                v-if="!hasLineChartComponent"
                src="@/assets/img/damay3month2.png"
                alt="Collections Chart"
                class="chart-image"
              />
              <p class="chart-caption">
                Damay Iqub - Monthly Savings Collection
              </p>
            </div>
          </div>
        </div>

        <!-- Primary Action Button - Thumb Zone -->
        <div class="primary-action-container">
          <ion-button
            expand="block"
            class="primary-action-button"
            @click="hostLottery"
          >
            <template #start>
              <ion-icon :icon="sparklesOutline"></ion-icon>
            </template>
            Host Lottery Now
          </ion-button>
        </div>
      </div>

      <!-- Floating Refresh Button -->
      <template #fixed>
        <ion-fab vertical="bottom" horizontal="end" class="refresh-fab">
          <ion-fab-button @click="refreshDashboard" :disabled="isRefreshing">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </template>
    </ion-content>

    <!-- Collector Tab Bar -->
    <collector-tab-bar></collector-tab-bar>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonBadge,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonSkeletonText,
  menuController,
  useIonRouter,
  loadingController,
  toastController,
} from "@ionic/vue";

import { useStore } from "vuex";

// Import icons
import {
  menuOutline,
  notificationsOutline,
  walletOutline,
  peopleOutline,
  layersOutline,
  trophyOutline,
  trendingUpOutline,
  addCircleOutline,
  personAddOutline,
  documentTextOutline,
  chevronForwardOutline,
  sparklesOutline,
  refreshOutline,
  checkmarkCircleOutline,
  cashOutline,
  personOutline,
} from "ionicons/icons";

// Import the CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const ionRouter = useIonRouter();

// State
const isLoadingActivity = ref(false);
const isRefreshing = ref(false);
const hasLineChartComponent = ref(false);

// Dashboard Data
const totalCollectedAmount = ref(520000);
const totalMembers = ref(5);
const totalIqub = ref(1);
const totalLottery = ref(5);
const notificationCount = ref(3);

// User Data
const userName = computed(() => {
  const user = store.getters["auth/getUser"];
  return user?.name || "Collector";
});

// Progress Calculations
const collectedPercentage = computed(() => {
  // Calculate percentage based on target (example: 1,000,000 ETB target)
  const target = 1000000;
  return Math.min(Math.round((totalCollectedAmount.value / target) * 100), 100);
});

const progressDashArray = computed(() => {
  const circumference = 2 * Math.PI * 25; // radius = 25
  return circumference;
});

const collectedProgress = computed(() => {
  const circumference = progressDashArray.value;
  return circumference - (collectedPercentage.value / 100) * circumference;
});

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    type: "lottery",
    title: "Lottery Winner Announced",
    description: "Abebe Kebede won the lottery for Damay Iqub",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    description: "5 members paid their monthly contribution",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 3,
    type: "member",
    title: "New Member Joined",
    description: "Tigist Alemu joined Damay Iqub",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
]);

// Utility Functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "lottery":
      return trophyOutline;
    case "payment":
      return cashOutline;
    case "member":
      return personOutline;
    default:
      return checkmarkCircleOutline;
  }
};

// Event Handlers
const openMenu = async () => {
  await menuController.open("app-menu");
};

const goToNotifications = () => {
  ionRouter.push("/notifications");
};

const viewDetails = (type: string) => {
  console.log(`View details for: ${type}`);
  // Navigate to specific detail pages
  switch (type) {
    case "collected":
      ionRouter.push("/collector/reports");
      break;
    case "members":
      ionRouter.push("/collector/members");
      break;
    case "iqubs":
      ionRouter.push("/collector/my-iqubs");
      break;
    case "lottery":
      ionRouter.push("/collector/lottery-history");
      break;
  }
};

const goToCreateIqub = () => {
  ionRouter.push("/collector/create-iqub");
};

const addMember = () => {
  console.log("Add member clicked");
  // Open modal or navigate to add member page
  ionRouter.push("/collector/add-member");
};

const hostLottery = () => {
  console.log("Host lottery clicked");
  ionRouter.push("/collector/host-lottery");
};

const viewReports = () => {
  ionRouter.push("/collector/reports");
};

const viewAllActivity = () => {
  ionRouter.push("/collector/activity");
};

const viewActivityDetail = (activity: any) => {
  console.log("View activity:", activity);
  // Navigate to activity detail or show modal
};

const changeChartPeriod = (event: any) => {
  console.log("Chart period changed:", event.detail.value);
  // Fetch new chart data based on period
};

const refreshDashboard = async () => {
  isRefreshing.value = true;

  try {
    // Fetch fresh data from API
    // await store.dispatch('collector/fetchDashboardData');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const toast = await toastController.create({
      message: "Dashboard refreshed successfully",
      duration: 2000,
      position: "top",
      color: "success",
    });
    await toast.present();
  } catch (error) {
    console.error("Error refreshing dashboard:", error);
    const toast = await toastController.create({
      message: "Failed to refresh dashboard",
      duration: 2000,
      position: "top",
      color: "danger",
    });
    await toast.present();
  } finally {
    isRefreshing.value = false;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  isLoadingActivity.value = true;

  try {
    // Fetch dashboard data from store
    // await store.dispatch('collector/fetchDashboardData');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update data from store
    // const data = store.getters['collector/dashboardData'];
    // totalCollectedAmount.value = data.totalCollectedAmount;
    // totalMembers.value = data.totalMembers;
    // totalIqub.value = data.totalIqub;
    // totalLottery.value = data.totalLottery;
    // notificationCount.value = data.notificationCount;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoadingActivity.value = false;
  }
});
</script>

<style scoped>
/* ===== WUJO BRAND IDENTITY - COLLECTOR DASHBOARD ===== */

.dashboard-content-wrapper {
  --background: var(--ion-color-white-smoke);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

/* Hero Header Section */
.hero-header {
  position: relative;
  padding: 60px 24px 80px;
  overflow: hidden;
  min-height: 240px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green) 0%,
    var(--ion-color-dark-green-shade) 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  opacity: 0.95;
}

.hero-content {
  position: relative;
  z-index: 2;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.menu-button {
  --color: white;
  --background: rgba(255, 255, 255, 0.1);
  --border-radius: 12px;
  margin: 0;
}

.menu-icon {
  font-size: 24px;
  color: white;
}

.notification-container {
  position: relative;
  cursor: pointer;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.notification-icon {
  font-size: 24px;
  color: white;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
}

/* Greeting Section */
.greeting-section {
  text-align: center;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.greeting-title {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
}

.user-name {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.greeting-subtitle {
  font-size: 14px;
  color: var(--ion-color-medium-aquamarine);
  margin: 0;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 32px 32px 0 0;
  margin-top: -50px;
  position: relative;
  z-index: 3;
  box-shadow: 0 -8px 48px rgba(1, 64, 35, 0.15);
  padding: 32px 20px 100px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Titles */
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark-green);
  margin: 0 0 16px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* Summary Section */
.summary-section {
  margin-bottom: 32px;
}

.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* Premium Cards */
.premium-card {
  background: var(--ion-color-dark-green);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.4s ease-out;
  animation-fill-mode: backwards;
}

.premium-card:nth-child(1) {
  animation-delay: 0.1s;
}
.premium-card:nth-child(2) {
  animation-delay: 0.2s;
}
.premium-card:nth-child(3) {
  animation-delay: 0.3s;
}
.premium-card:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.premium-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-icon-container {
  width: 48px;
  height: 48px;
  background: rgba(95, 217, 172, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.card-trend.positive {
  background: rgba(95, 217, 172, 0.2);
  color: var(--ion-color-medium-aquamarine);
}

.trend-icon {
  font-size: 14px;
}

.card-body {
  color: white;
}

.card-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
}

.card-subtitle {
  font-size: 12px;
  color: var(--ion-color-medium-aquamarine);
  margin: 0;
}

/* Progress Ring */
.progress-ring {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
  color: var(--ion-color-medium-aquamarine);
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 32px;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-button {
  --background: var(--ion-color-white-smoke);
  --color: var(--ion-color-dark-green);
  --border-radius: 16px;
  height: 80px;
  flex-direction: column;
  font-weight: 600;
  font-size: 13px;
  text-transform: none;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-button:active {
  transform: scale(0.98);
}

.action-icon {
  font-size: 28px;
  margin-bottom: 6px;
}

/* Activity Section */
.activity-section {
  margin-bottom: 32px;
}

.activity-skeleton {
  padding: 8px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--ion-color-white-smoke);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.activity-item:active {
  transform: scale(0.98);
  background: #e8e8e8;
}

.activity-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon-container.lottery {
  background: rgba(95, 217, 172, 0.2);
  color: var(--ion-color-medium-aquamarine);
}

.activity-icon-container.payment {
  background: rgba(1, 64, 35, 0.1);
  color: var(--ion-color-dark-green);
}

.activity-icon-container.member {
  background: rgba(95, 217, 172, 0.2);
  color: var(--ion-color-medium-aquamarine);
}

.activity-icon-container ion-icon {
  font-size: 20px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0 0 4px 0;
}

.activity-description {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 0 0 4px 0;
}

.activity-time {
  font-size: 11px;
  color: var(--ion-color-medium);
  margin: 0;
}

.activity-arrow {
  font-size: 20px;
  color: var(--ion-color-medium);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--ion-color-medium);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* Charts Section */
.charts-section {
  margin-bottom: 32px;
}

.chart-container {
  background: var(--ion-color-white-smoke);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark-green);
  margin: 0;
}

.chart-placeholder {
  text-align: center;
}

.chart-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 12px;
}

.chart-caption {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 0;
}

/* Primary Action Button */
.primary-action-container {
  margin: 32px 0 20px;
}

.primary-action-button {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  height: 56px;
  font-weight: 700;
  font-size: 16px;
  text-transform: none;
}

.primary-action-button:active {
  transform: scale(0.98);
}

/* Floating Refresh Button */
.refresh-fab {
  margin-bottom: 80px;
}

.refresh-fab ion-fab-button {
  --background: var(--ion-color-dark-green);
  --color: white;
  --box-shadow: 0 4px 16px rgba(1, 64, 35, 0.3);
}

/* Responsive Design */
@media (min-width: 768px) {
  .summary-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .action-buttons-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-height: 667px) {
  .hero-header {
    padding: 40px 24px 60px;
  }

  .user-name {
    font-size: 28px;
  }
}
</style>
