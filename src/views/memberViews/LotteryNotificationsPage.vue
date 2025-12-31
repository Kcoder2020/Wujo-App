<template>
  <ion-page>
    <ion-content :fullscreen="true" class="lottery-notifications-content">
      <!-- Custom Brand Header -->
      <div class="page-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </button>
        <div class="header-content">
          <h1 class="header-title">Lottery Results</h1>
          <p class="header-subtitle" v-if="lotteries.length > 0">
            {{ lotteries.length }} new result{{
              lotteries.length !== 1 ? "s" : ""
            }}
          </p>
        </div>
        <div class="header-icon-wrapper">
          <ion-icon :icon="ticketOutline" class="header-icon"></ion-icon>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="content-section">
        <div class="loading-state">
          <div class="skeleton-card" v-for="i in 4" :key="i"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="content-section">
        <div class="error-state">
          <div class="error-icon-wrapper">
            <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
          </div>
          <h3 class="error-title">Unable to Load Results</h3>
          <p class="error-message">{{ errorMessage }}</p>
          <ion-button @click="handleRetry" class="retry-button">
            <template #start>
              <ion-icon :icon="refreshOutline"></ion-icon>
            </template>
            Try Again
          </ion-button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="lotteries.length === 0" class="content-section">
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <ion-icon
              :icon="checkmarkCircleOutline"
              class="empty-icon"
            ></ion-icon>
          </div>
          <h3 class="empty-title">All Caught Up!</h3>
          <p class="empty-message">
            No new lottery results to view. Check back after the next lottery
            draw.
          </p>
          <ion-button @click="goToDashboard" class="back-to-dashboard-btn">
            <template #start>
              <ion-icon :icon="homeOutline"></ion-icon>
            </template>
            Back to Dashboard
          </ion-button>
        </div>
      </div>

      <!-- Lottery List -->
      <div v-else class="content-section">
        <div class="lottery-list">
          <LotteryNotificationCard
            v-for="lottery in lotteries"
            :key="lottery.lottery_id"
            :lottery="lottery"
            @select="handleLotterySelect"
          />
        </div>
      </div>

      <!-- Member Lottery Modal -->
      <MemberLotteryModal
        :is-open="isModalOpen"
        :lottery-id="selectedLotteryId"
        @close="handleModalClose"
        @viewed="handleLotteryViewed"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  alertCircleOutline,
  refreshOutline,
  ticketOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  homeOutline,
} from "ionicons/icons";
import LotteryNotificationCard from "@/components/LotteryNotificationCard.vue";
import MemberLotteryModal from "@/components/MemberLotteryModal.vue";

const router = useRouter();
const store = useStore();

// Local state
const isModalOpen = ref(false);
const selectedLotteryId = ref<string | null>(null);

// Computed properties
const lotteries = computed(() => store.getters["member/unviewedLotteries"]);
const isLoading = computed(
  () => store.getters["member/lotteryNotificationsStatus"] === "loading"
);
const hasError = computed(
  () => store.getters["member/lotteryNotificationsStatus"] === "error"
);
const errorMessage = computed(
  () =>
    store.getters["member/lotteryNotificationsError"] || "Something went wrong"
);

// Methods
const goBack = () => {
  router.back();
};

const handleLotterySelect = (lotteryId: string) => {
  selectedLotteryId.value = lotteryId;
  isModalOpen.value = true;
};

const handleModalClose = () => {
  isModalOpen.value = false;
  selectedLotteryId.value = null;
};

const handleLotteryViewed = () => {
  // Refresh the list after viewing
  store.dispatch("member/fetchUnviewedLotteries");
  store.dispatch("member/fetchNotificationCount");
};

const handleRetry = () => {
  store.dispatch("member/fetchUnviewedLotteries");
};

const goToDashboard = () => {
  router.push("/member/dashboard");
};

// Lifecycle
onMounted(() => {
  store.dispatch("member/fetchUnviewedLotteries");
});
</script>

<style scoped>
.lottery-notifications-content {
  --background: var(--ion-color-light, #f4f5f8);
}

/* Custom Brand Header */
.page-header {
  background: linear-gradient(
    135deg,
    #014023 0%,
    #012d19 50%,
    rgba(95, 217, 172, 0.1) 100%
  );
  padding: 20px;
  padding-top: calc(20px + var(--ion-safe-area-top, 0px));
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 0 0 24px 24px;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.back-button:active {
  transform: scale(0.95);
}

.back-button ion-icon {
  font-size: 22px;
  color: white;
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 13px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
  margin: 4px 0 0 0;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(95, 217, 172, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon {
  font-size: 24px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

/* Content Section */
.content-section {
  padding: 20px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 88px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
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

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}

.error-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(220, 53, 69, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 40px;
  color: #dc3545;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 8px 0;
}

.error-message {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  max-width: 280px;
}

.retry-button {
  --background: var(--ion-color-dark-green, #014023);
  --border-radius: 12px;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.2) 0%,
    rgba(1, 64, 35, 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 50px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.empty-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-dark-green, #014023);
  margin: 0 0 8px 0;
}

.empty-message {
  font-size: 15px;
  color: #666;
  margin: 0 0 28px 0;
  max-width: 280px;
  line-height: 1.5;
}

.back-to-dashboard-btn {
  --background: var(--ion-color-medium-aquamarine, #5fd9ac);
  --color: var(--ion-color-dark-green, #014023);
  --border-radius: 14px;
  font-weight: 600;
  height: 48px;
}

/* Lottery List */
.lottery-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-card {
    animation: none;
    background: #e0e0e0;
  }

  .back-button:active {
    transform: none;
  }
}
</style>
