<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Hero Section with Dark Green Gradient -->
      <div class="hero-section">
        <div class="hero-header">
          <ion-icon
            :icon="arrowBackOutline"
            class="back-icon"
            @click="goBack"
          ></ion-icon>
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
        </div>
        <div class="hero-content">
          <ion-icon :icon="walletOutline" class="hero-icon"></ion-icon>
          <h1 class="hero-title">My Iqubs</h1>
          <p class="hero-subtitle">Manage your savings groups</p>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="content-container">
        <!-- Search Bar -->
        <div class="search-container">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search Iqubs..."
            class="custom-searchbar"
            :debounce="300"
          ></ion-searchbar>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips">
          <ion-chip
            v-for="filter in filters"
            :key="filter.value"
            :class="{ active: selectedFilter === filter.value }"
            @click="selectedFilter = filter.value"
            class="filter-chip"
          >
            <ion-label>{{ filter.label }}</ion-label>
          </ion-chip>
        </div>

        <!-- Pull to Refresh -->
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
          <ion-refresher-content
            :pulling-icon="chevronDownCircleOutline"
            pulling-text="Pull to refresh"
            refreshing-spinner="circles"
          ></ion-refresher-content>
        </ion-refresher>

        <!-- Loading State with Skeleton Loaders -->
        <div v-if="iqubsStatus === 'loading'" class="iqubs-grid">
          <div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton-card">
            <div class="skeleton-header"></div>
            <div class="skeleton-ring"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="iqubsStatus === 'error'" class="error-state">
          <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
          <p class="error-message">{{ iqubsError }}</p>
          <ion-button @click="retryFetch" class="retry-button">
            <template #start>
              <ion-icon :icon="refreshOutline"></ion-icon>
            </template>
            Retry
          </ion-button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredIqubs.length === 0" class="empty-state">
          <ion-icon :icon="folderOpenOutline" class="empty-icon"></ion-icon>
          <h3 class="empty-title">No Iqubs Found</h3>
          <p class="empty-message">
            {{
              searchQuery || selectedFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start your savings journey by creating your first Iqub"
            }}
          </p>
          <ion-button
            v-if="!searchQuery && selectedFilter === 'all'"
            @click="goToCreateIqub"
            class="empty-cta"
          >
            Create Your First Iqub
          </ion-button>
        </div>

        <!-- Iqubs Grid -->
        <div v-else class="iqubs-grid">
          <div
            v-for="iqub in filteredIqubs"
            :key="iqub.id"
            class="iqub-card"
            @click="goToIqubDetail(iqub.id)"
          >
            <!-- Card Header -->
            <div class="card-header">
              <h3 class="iqub-name">{{ iqub.name }}</h3>
              <ion-badge
                :color="getStatusColor(iqub.status)"
                class="status-badge"
              >
                {{ iqub.status || "active" }}
              </ion-badge>
            </div>

            <!-- Progress Ring -->
            <div class="card-progress">
              <progress-ring :percentage="calculateProgress(iqub)" :size="80" />
            </div>

            <!-- Card Stats -->
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-label">Total Collected</span>
                <span class="stat-value">{{
                  formatCurrency(iqub.total_collected)
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Hosted Lottery</span>
                <span class="stat-value">{{
                  iqub.hosted_lottery || "0/0"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="goToCreateIqub" class="fab-button">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { Iqub } from "@/types";
import ProgressRing from "@/components/ProgressRing.vue";

// Import Icons
import {
  walletOutline,
  addOutline,
  folderOpenOutline,
  alertCircleOutline,
  refreshOutline,
  chevronDownCircleOutline,
  arrowBackOutline,
  notificationsOutline,
} from "ionicons/icons";

const store = useStore();
const router = useRouter();

// State
const searchQuery = ref("");
const selectedFilter = ref("all");

// Filter options
const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

// Vuex State & Getters
const myIqubs = computed<Iqub[]>(() => store.getters["iqubs/iqubs"]);
const iqubsStatus = computed<string>(() => store.state.iqubs.status);
const iqubsError = computed<string | null>(() => store.state.iqubs.error);

// Computed - Filtered Iqubs
const filteredIqubs = computed(() => {
  let iqubs = myIqubs.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    iqubs = iqubs.filter((iqub) => iqub.name.toLowerCase().includes(query));
  }

  // Apply status filter
  if (selectedFilter.value !== "all") {
    iqubs = iqubs.filter(
      (iqub) => (iqub.status || "active") === selectedFilter.value
    );
  }

  return iqubs;
});

// Methods
const formatCurrency = (amount: string | number | undefined): string => {
  if (!amount) return "0 ETB";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return (
    new Intl.NumberFormat("en-ET", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount) + " ETB"
  );
};

const calculateProgress = (iqub: Iqub): number => {
  // Calculate progress based on hosted lottery
  if (iqub.hosted_lottery) {
    const [completed, total] = iqub.hosted_lottery.split("/").map(Number);
    return total > 0 ? (completed / total) * 100 : 0;
  }
  // Fallback to members count
  if (iqub.current_members && iqub.members_count) {
    return (iqub.current_members / iqub.members_count) * 100;
  }
  return 0;
};

const getStatusColor = (status: string | undefined): string => {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "medium";
    default:
      return "success";
  }
};

const handleRefresh = async (event: any) => {
  await fetchIqubs();
  event.target.complete();
};

const retryFetch = () => {
  fetchIqubs();
};

const fetchIqubs = async () => {
  const user = store.getters["auth/getUser"];
  if (user.id === 21) {
    const joined_iqubs = user.joined_iqubs;
    await store.dispatch("iqubs/setIqubs", joined_iqubs);
  } else {
    await store.dispatch("iqubs/fetchMyIqubs");
  }
};

const goToIqubDetail = (iqubId: number | string) => {
  console.log("Navigating to Iqub detail with ID:", iqubId);

  if (!iqubId || iqubId === "undefined") {
    console.error("Invalid Iqub ID, cannot navigate:", iqubId);
    return;
  }

  router.push(`/iqub/${iqubId}`);
};

const goToCreateIqub = () => {
  router.push("/collector/create-iqub");
};

const goBack = () => {
  router.push("/collector/dashboard");
};

const goToNotifications = () => {
  router.push("/notifications");
};

// Data Fetching
onMounted(() => {
  if (
    myIqubs.value.length === 0 &&
    (iqubsStatus.value === "idle" || iqubsStatus.value === "error")
  ) {
    fetchIqubs();
  }
});
</script>

<style scoped>
/* Hero Section with Dark Green Gradient */
.hero-section {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 20px 24px 80px;
  position: relative;
  animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: transform 0.2s;
}

.back-icon:hover,
.notification-icon:hover {
  transform: scale(1.1);
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-icon {
  font-size: 48px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.hero-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  color: white;
}

/* Content Container */
.content-container {
  background: white;
  border-radius: 32px 32px 0 0;
  margin-top: -50px;
  padding: 24px;
  min-height: calc(100vh - 200px);
  box-shadow: 0 -8px 48px rgba(1, 64, 35, 0.15);
  animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1);
}

/* Search Bar */
.search-container {
  margin-bottom: 16px;
}

.custom-searchbar {
  --background: var(--ion-color-white-smoke, #f2f2f2);
  --border-radius: 16px;
  --box-shadow: none;
  --icon-color: var(--ion-color-dark-green, #014023);
  --placeholder-color: #6c757d;
  padding: 0;
}

.custom-searchbar::part(native) {
  padding-inline-start: 16px;
  padding-inline-end: 16px;
}

/* Filter Chips */
.filter-chips {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-chip {
  --background: var(--ion-color-white-smoke, #f2f2f2);
  --color: var(--ion-color-dark-green, #014023);
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.filter-chip.active {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  transform: scale(1.05);
}

/* Iqubs Grid */
.iqubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 80px;
}

/* Premium Iqub Card */
.iqub-card {
  background: var(--ion-color-dark-green, #014023);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(1, 64, 35, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1);
}

.iqub-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(1, 64, 35, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.iqub-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.status-badge {
  text-transform: capitalize;
  font-size: 11px;
  padding: 4px 8px;
  margin-left: 8px;
}

.card-progress {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

/* Skeleton Loaders */
.skeleton-card {
  background: var(--ion-color-dark-green, #014023);
  border-radius: 20px;
  padding: 24px;
  height: 280px;
  position: relative;
  overflow: hidden;
}

.skeleton-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.skeleton-header,
.skeleton-ring,
.skeleton-text {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}

.skeleton-header {
  height: 24px;
  width: 70%;
}

.skeleton-ring {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  margin: 20px auto;
}

.skeleton-text {
  height: 16px;
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 12px 0;
}

.empty-message {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 32px 0;
  max-width: 300px;
}

.empty-cta {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 16px;
  height: 56px;
  font-weight: 700;
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.error-icon {
  font-size: 80px;
  color: var(--ion-color-danger, #dc3545);
  margin-bottom: 24px;
  opacity: 0.7;
}

.error-message {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 32px 0;
  max-width: 300px;
}

.retry-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 16px;
  height: 48px;
  font-weight: 600;
}

/* Floating Action Button */
.fab-button {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --box-shadow: 0 8px 24px rgba(95, 217, 172, 0.35);
}

.fab-button:active {
  transform: scale(0.95);
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .iqubs-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 28px;
  }
}
</style>
