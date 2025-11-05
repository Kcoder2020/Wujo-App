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
          <div class="iqub-cards-container">
            <!-- Joined Iqub 1 -->
            <div class="iqub-card">
              <ion-text class="card-title">Joined Iqub 1</ion-text>
              <ion-text class="card-amount"
                >Total Iqub Amount: {{ iqubs[0].totalAmount }}</ion-text
              >
              <ion-text class="card-saved"
                >So far Saved Amount :{{ iqubs[0].savedAmount }}</ion-text
              >
              <ion-text
                class="card-status"
                :class="{
                  'status-normal': iqubs[0].statusColor === 'normal',
                  'status-green': iqubs[0].statusColor === 'green',
                  'status-red': iqubs[0].statusColor === 'red',
                }"
              >
                Status {{ iqubs[0].status }}
              </ion-text>
            </div>

            <!-- Joined Iqub 2 -->
            <div class="iqub-card">
              <ion-text class="card-title">Joined Iqub 2</ion-text>
              <ion-text class="card-amount"
                >Total Iqub Amount: {{ iqubs[1].totalAmount }}</ion-text
              >
              <ion-text class="card-saved"
                >So far Saved Amount :{{ iqubs[1].savedAmount }}</ion-text
              >
              <ion-text
                class="card-status"
                :class="{
                  'status-normal': iqubs[1].statusColor === 'normal',
                  'status-green': iqubs[1].statusColor === 'green',
                  'status-red': iqubs[1].statusColor === 'red',
                }"
              >
                Status {{ iqubs[1].status }}
              </ion-text>
            </div>

            <!-- Joined Iqub 3 -->
            <div class="iqub-card">
              <ion-text class="card-title">Joined Iqub 3</ion-text>
              <ion-text class="card-amount"
                >Total Iqub Amount: {{ iqubs[2].totalAmount }}</ion-text
              >
              <ion-text class="card-saved"
                >So far Saved Amount :{{ iqubs[2].savedAmount }}</ion-text
              >
              <ion-text
                class="card-status"
                :class="{
                  'status-normal': iqubs[2].statusColor === 'normal',
                  'status-green': iqubs[2].statusColor === 'green',
                  'status-red': iqubs[2].statusColor === 'red',
                }"
              >
                Status {{ iqubs[2].status }}
              </ion-text>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonPage, IonContent, IonIcon, IonText, IonBadge } from "@ionic/vue";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";

const notificationCount = ref(3);

// Sample data for Iqubs - replace with actual data from store/API
const iqubs = ref([
  {
    id: 1,
    totalAmount: "40,5000ETB",
    savedAmount: "10,000 ETB",
    status: "8/10",
    statusColor: "normal", // normal, green, or red
  },
  {
    id: 2,
    totalAmount: "50,000ETB",
    savedAmount: "45,000 ETB",
    status: "9/10",
    statusColor: "green", // green for good progress
  },
  {
    id: 3,
    totalAmount: "30,000ETB",
    savedAmount: "15,000 ETB",
    status: "5/10",
    statusColor: "red", // red for low progress
  },
]);

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
</style>
