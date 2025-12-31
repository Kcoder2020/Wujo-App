<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Premium Hero Section -->
      <div class="hero-section">
        <div class="hero-header">
          <ion-icon
            :icon="arrowBackOutline"
            class="back-icon"
            @click="goToDashboard"
          ></ion-icon>
          <h1 class="hero-title">My IqubBook</h1>
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ formatCurrency(totalSavings) }}</span>
            <span class="stat-label">Total Savings</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ activeIqubsCount }}</span>
            <span class="stat-label">Active Iqubs</span>
          </div>
        </div>
      </div>

      <member-tab-bar></member-tab-bar>

      <!-- Pull to Refresh -->
      <template #fixed>
        <ion-refresher @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
      </template>

      <div class="page-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="iqub-cards-grid">
          <div v-for="i in 3" :key="i" class="skeleton-card">
            <div class="skeleton-header">
              <div class="skeleton-title"></div>
              <div class="skeleton-badge"></div>
            </div>
            <div class="skeleton-body">
              <div class="skeleton-ring"></div>
              <div class="skeleton-info">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Iqub Cards Grid -->
        <div v-else-if="joinedIqubs.length" class="iqub-cards-grid">
          <member-iqub-card
            v-for="(iqub, index) in joinedIqubs"
            :key="iqub.id"
            :iqub="iqub"
            :style="{ animationDelay: `${(index as number) * 100}ms` }"
            class="card-entrance"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && !hasError" class="empty-state">
          <ion-icon :icon="bookOutline" class="empty-icon"></ion-icon>
          <h2 class="empty-title">Start your savings journey!</h2>
          <p class="empty-message">
            You haven't joined any Iqubs yet. Discover amazing savings
            opportunities and start building your financial future today.
          </p>
          <ion-button class="discover-btn" @click="goToDiscover">
            <template #start>
              <ion-icon :icon="searchOutline"></ion-icon>
            </template>
            Discover Iqubs
          </ion-button>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="error-state">
          <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
          <h2 class="error-title">Oops! Something went wrong</h2>
          <p class="error-message">{{ errorMessage }}</p>
          <ion-button class="retry-btn" @click="retryFetch">
            <template #start>
              <ion-icon :icon="refreshOutline"></ion-icon>
            </template>
            Try Again
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import {
  arrowBackOutline,
  notificationsOutline,
  bookOutline,
  searchOutline,
  alertCircleOutline,
  refreshOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import MemberTabBar from "@/components/MemberTabBar.vue";
import MemberIqubCard from "@/components/MemberIqubCard.vue";
import type { Iqub } from "@/types";

const store = useStore();
const router = useRouter();

// Computed properties from member store
const joinedIqubs = computed(() => store.getters["member/joinedIqubs"] || []);
const joinedIqubsStatus = computed(
  () => store.getters["member/joinedIqubsStatus"]
);
const errorMessage = computed(
  () =>
    store.getters["member/error"] ||
    "Failed to load your Iqubs. Please try again."
);

const isLoading = computed(() => joinedIqubsStatus.value === "loading");
const hasError = computed(() => joinedIqubsStatus.value === "error");

// Calculate total savings from joined Iqubs
const totalSavings = computed(() => {
  return joinedIqubs.value.reduce((total: number, iqub: Iqub) => {
    // First try to use total_collected if available
    if (iqub.total_collected !== undefined && iqub.total_collected !== null) {
      const collected =
        typeof iqub.total_collected === "string"
          ? parseFloat(iqub.total_collected)
          : iqub.total_collected || 0;
      return total + collected;
    }

    // If not available, calculate from saving_rounds
    if (iqub.saving_rounds) {
      const rounds = iqub.saving_rounds.toString().split("/");
      if (rounds.length === 2) {
        const completedRounds = parseInt(rounds[0]) || 0;
        const savingAmountRaw = iqub.saving_amount;
        const savingAmount =
          typeof savingAmountRaw === "string"
            ? parseFloat(savingAmountRaw) || 0
            : (savingAmountRaw as number) || 0;
        const membersCount = iqub.members_count || iqub.current_members || 1;
        return total + completedRounds * savingAmount * membersCount;
      }
    }

    return total;
  }, 0);
});

// Count active Iqubs
const activeIqubsCount = computed(() => {
  return joinedIqubs.value.filter(
    (iqub: Iqub) => iqub.status?.toLowerCase() === "active"
  ).length;
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const fetchJoinedIqubs = async () => {
  await store.dispatch("member/fetchJoinedIqubs");
};

const retryFetch = () => {
  fetchJoinedIqubs();
};

const handleRefresh = async (event: CustomEvent) => {
  try {
    await fetchJoinedIqubs();
    const toast = await toastController.create({
      message: "Iqubs refreshed successfully!",
      duration: 2000,
      color: "success",
      position: "top",
    });
    await toast.present();
  } catch (error) {
    const toast = await toastController.create({
      message: "Failed to refresh. Please try again.",
      duration: 2000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  } finally {
    (event.target as any)?.complete();
  }
};

const goToDashboard = () => {
  router.push("/member/dashboard");
};

const goToNotifications = () => {
  router.push("/member/notifications");
};

const goToDiscover = () => {
  router.push("/member/discover");
};

onMounted(() => {
  fetchJoinedIqubs();
});
</script>

<style scoped>
ion-content {
  --background: #f2f2f2;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

/* Premium Hero Section */
.hero-section {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 24px;
  border-radius: 0 0 24px 24px;
  animation: fadeInDown 0.5s ease-out;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-icon,
.notification-icon {
  font-size: 28px;
  color: white;
  cursor: pointer;
  transition: transform var(--wujo-transition-fast) var(--wujo-timing-function);
}

.back-icon:active,
.notification-icon:active {
  transform: scale(0.95);
}

.hero-title {
  font-size: var(--wujo-font-size-title);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  color: white;
  margin: 0;
  flex: 1;
  text-align: center;
}

.hero-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-tight);
  color: #5fd9ac;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

/* Page Content */
.page-content {
  padding: 20px;
  min-height: calc(100vh - 200px);
}

/* Iqub Cards Grid */
.iqub-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-entrance {
  animation: slideUp 0.3s ease-out backwards;
}

/* Loading Skeleton */
.skeleton-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin: 12px 0;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-title {
  width: 60%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-badge {
  width: 80px;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

.skeleton-body {
  display: flex;
  gap: 20px;
}

.skeleton-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line:nth-child(1) {
  width: 90%;
}

.skeleton-line:nth-child(2) {
  width: 70%;
}

.skeleton-line:nth-child(3) {
  width: 80%;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  min-height: 400px;
}

.empty-icon {
  font-size: 120px;
  color: #5fd9ac;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
  margin: 0 0 12px 0;
}

.empty-message {
  font-size: var(--wujo-font-size-body);
  color: #666;
  line-height: var(--wujo-line-height-relaxed);
  margin: 0 0 32px 0;
  max-width: 400px;
}

.discover-btn {
  --background: #5fd9ac;
  --color: #014023;
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
  height: var(--wujo-button-height);
  font-weight: var(--wujo-font-weight-semibold);
  font-size: var(--wujo-font-size-body);
  text-transform: none;
  min-width: 200px;
}

.discover-btn:active {
  transform: scale(0.98);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  min-height: 400px;
}

.error-icon {
  font-size: 120px;
  color: #eb445a;
  margin-bottom: 24px;
  opacity: 0.6;
}

.error-title {
  font-size: var(--wujo-font-size-section);
  font-weight: var(--wujo-font-weight-bold);
  line-height: var(--wujo-line-height-normal);
  color: #014023;
  margin: 0 0 12px 0;
}

.error-message {
  font-size: var(--wujo-font-size-body);
  color: #666;
  line-height: var(--wujo-line-height-relaxed);
  margin: 0 0 32px 0;
  max-width: 400px;
}

.retry-btn {
  --background: #014023;
  --color: white;
  --border-radius: 16px;
  --box-shadow: 0 8px 24px rgba(1, 64, 35, 0.2);
  height: var(--wujo-button-height);
  font-weight: var(--wujo-font-weight-semibold);
  font-size: var(--wujo-font-size-body);
  text-transform: none;
  min-width: 200px;
}

.retry-btn:active {
  transform: scale(0.98);
}

/* Animations */
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
