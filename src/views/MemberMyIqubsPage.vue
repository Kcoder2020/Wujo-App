<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <ion-text class="page-title">HI Iquber</ion-text>
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

      <member-tab-bar></member-tab-bar>

      <div class="page-content">
        <!-- Welcome Text -->
        <div class="welcome-section">
          <p class="welcome-text">
            Welcome to your Digital Iqub Book where you can easily access and
            track your progress and find an exciting world of lottery events
          </p>
        </div>

        <!-- Iquber IqubBook Section -->
        <div class="iqub-book-section">
          <!-- Header Banner -->
          <div class="iqub-book-header">
            <ion-text class="iqub-book-title">Iquber IqubBook</ion-text>
          </div>

          <!-- Iqub Cards -->
          <div v-if="iqubs.length" class="iqub-cards-container">
            <div v-for="iqub in iqubs" :key="iqub.id" class="iqub-card">
              <ion-text class="card-title">{{
                iqub.name || `Iqub #${iqub.id}`
              }}</ion-text>
              <ion-text class="card-amount">
                Saving Amount: {{ formatAmount(iqub.saving_amount) }}
              </ion-text>
              <ion-text class="card-saved">
                Joined Members:
                {{ iqub.joined_members ?? iqub.members_count ?? "N/A" }}
              </ion-text>
              <ion-text class="card-status" :class="statusClass(iqub.status)">
                Status {{ iqub.status ?? "N/A" }}
              </ion-text>
            </div>
          </div>
          <ion-text v-else class="empty-state">
            You have not joined any Iqubs yet.
          </ion-text>
        </div>

        <div class="response-section">
          <ion-text class="response-title">Latest Server Response</ion-text>
          <pre class="response-pre">{{ formattedResponse }}</pre>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IonPage, IonContent, IonIcon, IonText, IonBadge } from "@ionic/vue";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import { useStore } from "vuex";
import MemberTabBar from "@/components/MemberTabBar.vue";

const store = useStore();
const notificationCount = ref(3);

const iqubs = computed(() => store.getters["iqubs/iqubs"] || []);
const fetchStatus = computed(() => store.getters["iqubs/status"]);
const fetchError = computed(() => store.getters["iqubs/error"]);

const responsePayload = computed(() => ({
  status: fetchStatus.value,
  error: fetchError.value,
  data: iqubs.value,
}));

const formattedResponse = computed(() =>
  JSON.stringify(responsePayload.value, null, 2)
);

const statusClass = (status?: string) => {
  if (!status) {
    return "status-normal";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("complete") || normalized.includes("success")) {
    return "status-green";
  }
  if (normalized.includes("pending") || normalized.includes("progress")) {
    return "status-normal";
  }
  return "status-red";
};

const formatAmount = (value?: string | number) => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return typeof value === "number" ? `${value} ETB` : value;
};

onMounted(() => {
  store.dispatch("iqubs/fetchMemberIqubs");
});

const openMenu = () => {
  console.log("Open menu clicked");
};

const goToNotifications = () => {
  console.log("Notifications icon clicked");
};
</script>

<style scoped>
:root {
  --ion-color-wujo-primary: #006a52;
  --ion-color-wujo-light-grey: #f0f2f5;
}

ion-content {
  --background: white;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block;
}

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

.page-content {
  padding: 20px;
  background: white;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.welcome-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

/* Iqub Book Section */
.iqub-book-section {
  margin-top: 20px;
  text-align: center;
}

.iqub-book-header {
  background: var(--ion-color-wujo-primary);
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
  text-align: center;
}

.iqub-book-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* Iqub Cards Container */
.iqub-cards-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 0;
  text-align: center;
}

.iqub-card {
  background: #f0f2f5; /* Light grey background */
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.card-amount {
  font-size: 14px;
  color: #555;
}

.card-saved {
  font-size: 14px;
  color: #555;
}

.card-status {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
}

/* Status Colors */
.status-normal {
  color: #333; /* Dark/black color */
}

.status-green {
  color: #006a52; /* Green color */
}

.status-red {
  color: #eb445a; /* Red color */
}

.empty-state {
  display: block;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.response-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fb;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.response-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 10px;
}

.response-pre {
  background: #1e1e1e;
  color: #e8e8e8;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  overflow-x: auto;
  line-height: 1.4;
}
</style>
