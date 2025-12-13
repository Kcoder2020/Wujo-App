<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Premium Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <ion-icon
            :icon="menuOutline"
            class="hero-icon"
            @click="openMenu"
          ></ion-icon>
          <ion-icon
            :icon="notificationsOutline"
            class="hero-icon"
            @click="goToNotifications"
          ></ion-icon>
        </div>
        <h1 class="hero-greeting">Welcome Back, {{ userName }}!</h1>
      </div>

      <!-- Member Tab Bar -->
      <member-tab-bar></member-tab-bar>

      <!-- Main Dashboard Content -->
      <div class="dashboard-content">
        <!-- Summary Cards Section -->
        <div class="summary-cards">
          <!-- Total Savings Card -->
          <div
            class="summary-card"
            @click="goToMyIqubs"
            style="animation-delay: 0ms"
          >
            <div class="card-progress">
              <ProgressRing :percentage="savingsPercentage" :size="80" />
            </div>
            <div class="card-info">
              <h3 class="card-title">Total Savings</h3>
              <p class="card-value">{{ formatCurrency(totalSavings) }}</p>
              <p class="card-trend">{{ savingsPercentage }}% Complete</p>
            </div>
          </div>

          <!-- Active Iqubs Card -->
          <div
            class="summary-card"
            @click="goToMyIqubs"
            style="animation-delay: 100ms"
          >
            <div class="card-icon-wrapper">
              <ion-icon
                :icon="peopleOutline"
                class="card-icon-large"
              ></ion-icon>
            </div>
            <div class="card-info">
              <h3 class="card-title">Active Iqubs</h3>
              <p class="card-value">{{ activeIqubs }}</p>
              <p class="card-trend">+2 this month</p>
            </div>
          </div>

          <!-- Lottery Position Card -->
          <div class="summary-card" style="animation-delay: 200ms">
            <div class="card-icon-wrapper">
              <ion-icon
                :icon="trophyOutline"
                class="card-icon-large"
              ></ion-icon>
            </div>
            <div class="card-info">
              <h3 class="card-title">Lottery Position</h3>
              <p class="card-value">#{{ lotteryPosition }}</p>
              <p class="card-trend">
                <ion-icon
                  :icon="calendarOutline"
                  class="inline-icon"
                ></ion-icon>
                Next: {{ nextLotteryDate || "TBD" }}
              </p>
            </div>
          </div>

          <!-- Completed Iqubs Card -->
          <div class="summary-card" style="animation-delay: 300ms">
            <div class="card-icon-wrapper">
              <ion-icon :icon="cashOutline" class="card-icon-large"></ion-icon>
            </div>
            <div class="card-info">
              <h3 class="card-title">Completed Iqubs</h3>
              <p class="card-value">{{ completedIqubs }}</p>
              <p class="card-trend">Well done!</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="activity-section">
          <h2 class="section-title">Recent Activity</h2>
          <div
            v-if="isLoading && recentActivities.length === 0"
            class="activity-skeleton"
          >
            <div class="skeleton-item" v-for="i in 3" :key="i"></div>
          </div>
          <div v-else-if="recentActivities.length > 0" class="activity-feed">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon-wrapper">
                <ion-icon
                  :icon="getActivityIcon(activity.type)"
                  class="activity-icon"
                ></ion-icon>
              </div>
              <div class="activity-content">
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-description">{{ activity.description }}</p>
              </div>
              <div class="activity-time">
                <span>{{ formatRelativeTime(activity.timestamp) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <ion-icon :icon="cashOutline" class="empty-icon"></ion-icon>
            <p class="empty-text">No recent activity yet</p>
            <p class="empty-subtext">Start your savings journey today!</p>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="quick-actions">
          <ion-button class="action-btn" @click="goToDiscover">
            <template #start>
              <ion-icon :icon="searchOutline"></ion-icon>
            </template>
            Discover Iqubs
          </ion-button>
          <ion-button class="action-btn" @click="makePayment">
            <template #start>
              <ion-icon :icon="cardOutline"></ion-icon>
            </template>
            Make Payment
          </ion-button>
          <ion-button class="action-btn" @click="viewProfile">
            <template #start>
              <ion-icon :icon="personOutline"></ion-icon>
            </template>
            View Profile
          </ion-button>
        </div>
      </div>

      <!-- Pull to Refresh & Floating Refresh Button -->
      <template #fixed>
        <ion-refresher @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <ion-fab vertical="bottom" horizontal="end">
          <ion-fab-button @click="handleRefresh" :disabled="isRefreshing">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  menuController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  menuOutline,
  notificationsOutline,
  searchOutline,
  cardOutline,
  personOutline,
  refreshOutline,
  cashOutline,
  trophyOutline,
  peopleOutline,
  calendarOutline,
} from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";
import ProgressRing from "@/components/ProgressRing.vue";

const router = useRouter();
const store = useStore();

// Computed properties
const userName = computed(() => {
  return store.getters["auth/getUser"]?.name || "Member";
});

const dashboardData = computed(() => store.state.member.dashboard);
const isLoading = computed(() => store.state.member.status === "loading");
const error = computed(() => store.state.member.error);

// Dashboard summary data
const totalSavings = computed(
  () => dashboardData.value?.summary?.totalSavings || 0
);
const savingsPercentage = computed(
  () => dashboardData.value?.summary?.savingsPercentage || 0
);
const activeIqubs = computed(
  () => dashboardData.value?.summary?.activeIqubs || 0
);
const completedIqubs = computed(
  () => dashboardData.value?.summary?.completedIqubs || 0
);
const lotteryPosition = computed(
  () => dashboardData.value?.summary?.lotteryPosition || 0
);
const nextLotteryDate = computed(
  () => dashboardData.value?.summary?.nextLotteryDate || ""
);
const recentActivities = computed(
  () => dashboardData.value?.recentActivities || []
);

// State
const isRefreshing = ref(false);

// Event Handlers
const openMenu = async () => {
  await menuController.open();
};

const goToNotifications = () => {
  router.push("/notifications");
};

const goToDiscover = () => {
  router.push("/member/discover");
};

const makePayment = () => {
  // Navigate to payment page or show payment modal
  console.log("Make payment clicked");
};

const viewProfile = () => {
  router.push("/member/profile");
};

const goToMyIqubs = () => {
  router.push("/member/my-iqubs");
};

const handleRefresh = async (event?: any) => {
  isRefreshing.value = true;
  try {
    await store.dispatch("member/fetchMemberDashboard");
  } catch (error) {
    console.error("Error refreshing dashboard:", error);
  } finally {
    isRefreshing.value = false;
    if (event) {
      event.target.complete();
    }
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "payment":
      return cashOutline;
    case "lottery_win":
      return trophyOutline;
    case "iqub_join":
      return peopleOutline;
    default:
      return cashOutline;
  }
};

// Lifecycle
onMounted(() => {
  store.dispatch("member/fetchMemberDashboard");
});
</script>

<style scoped>
/* Wujo Brand Colors */
:root {
  --wujo-dark-green: #014023;
  --wujo-aquamarine: #5fd9ac;
  --wujo-white-smoke: #f2f2f2;
}

ion-content {
  --background: var(--wujo-white-smoke);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

/* --- Premium Hero Section --- */
.hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 20px;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hero-icon {
  font-size: 28px;
  color: white;
  cursor: pointer;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function);
}

.hero-icon:active {
  transform: scale(0.95);
}

.hero-greeting {
  font-size: var(--wujo-font-size-hero);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  color: white;
  margin: 0;
  animation: fadeInDown 0.5s ease-out;
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

/* --- Member Tab Bar --- */
member-tab-bar {
  display: block;
  margin-bottom: 20px;
}

/* --- Dashboard Content --- */
.dashboard-content {
  padding: 0 20px 100px 20px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Summary Cards --- */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.summary-card {
  background: var(--wujo-dark-green);
  color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  cursor: pointer;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function),
    box-shadow var(--wujo-transition-fast) var(--wujo-timing-function);
  animation: scaleIn var(--wujo-transition-normal) var(--wujo-timing-function);
  animation-fill-mode: both;
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

.summary-card:active {
  transform: scale(0.98);
}

.card-progress {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.card-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.card-icon-large {
  font-size: 48px;
  color: var(--wujo-aquamarine);
}

.card-info {
  text-align: center;
}

.card-title {
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-regular);
  line-height: var(--wujo-line-height-normal);
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
}

.card-value {
  font-size: var(--wujo-font-size-title);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  color: white;
  margin: 0 0 4px 0;
}

.card-trend {
  font-size: var(--wujo-font-size-caption);
  line-height: var(--wujo-line-height-normal);
  color: var(--wujo-aquamarine);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.inline-icon {
  font-size: 12px;
}

/* --- Activity Section --- */
.activity-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: var(--wujo-dark-green);
  margin: 0 0 16px 0;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function);
}

.activity-item:active {
  transform: scale(0.98);
}

.activity-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon {
  font-size: 20px;
  color: var(--wujo-aquamarine);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-semibold);
  line-height: var(--wujo-line-height-normal);
  color: var(--wujo-dark-green);
  margin: 0 0 4px 0;
}

.activity-description {
  font-size: var(--wujo-font-size-body);
  line-height: var(--wujo-line-height-normal);
  color: #666;
  margin: 0;
}

.activity-time {
  font-size: var(--wujo-font-size-caption);
  line-height: var(--wujo-line-height-normal);
  color: #999;
  flex-shrink: 0;
}

/* Activity Skeleton Loader */
.activity-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  height: 72px;
  border-radius: 16px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-text {
  font-size: var(--wujo-font-size-card);
  font-weight: var(--wujo-font-weight-semibold);
  line-height: var(--wujo-line-height-normal);
  color: #666;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: var(--wujo-font-size-body);
  line-height: var(--wujo-line-height-normal);
  color: #999;
  margin: 0;
}

/* --- Quick Actions (Thumb Zone Optimized) --- */
/* Positioned in bottom 30% of viewport for easy one-handed access */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.action-btn {
  --background: var(--wujo-aquamarine);
  --background-activated: #4ec99a;
  --color: var(--wujo-dark-green);
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  height: var(--wujo-button-height);
  font-size: var(--wujo-font-size-body);
  font-weight: var(--wujo-font-weight-semibold);
  text-transform: none;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function);
}

.action-btn:active {
  transform: scale(0.98);
}

/* --- Floating Action Button --- */
ion-fab-button {
  --background: var(--wujo-dark-green);
  --background-activated: #012d19;
  --color: white;
  --box-shadow: 0 4px 16px rgba(1, 64, 35, 0.3);
  animation: slideUp 0.5s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-greeting {
    font-size: var(--wujo-font-size-title);
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .card-value {
    font-size: var(--wujo-font-size-section);
  }
}

@media (min-width: 769px) {
  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
