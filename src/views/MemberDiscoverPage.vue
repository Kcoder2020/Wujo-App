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
        <!-- Headline -->
        <div class="headline-section">
          <h2 class="headline-text">
            Discover the exclusive packages designed to enhance your Iqub
            experience
          </h2>
        </div>

        <!-- Welcome Message -->
        <div class="welcome-section">
          <p class="welcome-text">
            Welcome to Wujo Packages where you explore our On-Demand and In-Kind
            Iqubs, designed to meet your unique needs and interests.
          </p>
        </div>

        <!-- Discover Packages Section -->
        <div class="discover-packages-section">
          <!-- Section Header -->
          <div class="discover-packages-header">
            <ion-text class="discover-packages-title"
              >Discover Packages</ion-text
            >
          </div>

          <!-- Package Categories -->
          <div class="package-categories">
            <!-- Wujo's Inkind Card -->
            <div class="package-category-card">
              <ion-text class="category-title">Wujo's Inkind</ion-text>
            </div>

            <!-- Wujo Invest Card -->
            <div class="package-category-card">
              <ion-text class="category-title">Wujo Invest</ion-text>
            </div>
          </div>
        </div>

        <!-- Wujo In-Kind Section -->
        <div class="package-section">
          <div class="section-header">
            <ion-text class="section-title">Wujo In-Kind</ion-text>
          </div>
          <div class="packages-grid">
            <div
              v-for="packageItem in inKindPackages"
              :key="packageItem.id"
              class="package-card"
            >
              <ion-text class="package-name">{{ packageItem.name }}</ion-text>
              <div class="package-details">
                <ion-text class="package-amount"
                  >Get: {{ packageItem.getAmount }}</ion-text
                >
                <ion-text class="package-saving"
                  >Saving: {{ packageItem.savingAmount }}</ion-text
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Wujo Invest Section -->
        <div class="package-section">
          <div class="section-header">
            <ion-text class="section-title">Wujo Invest</ion-text>
          </div>
          <div class="packages-grid">
            <div
              v-for="packageItem in investPackages"
              :key="packageItem.id"
              class="package-card"
            >
              <ion-text class="package-name">{{ packageItem.name }}</ion-text>
              <div class="package-details">
                <ion-text class="package-amount"
                  >Get: {{ packageItem.getAmount }}</ion-text
                >
                <ion-text class="package-saving"
                  >Saving: {{ packageItem.savingAmount }}</ion-text
                >
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
import { IonPage, IonContent, IonIcon, IonText, IonBadge } from "@ionic/vue";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";

const notificationCount = ref(3);

// Sample data for In-Kind packages
const inKindPackages = ref([
  {
    id: 1,
    name: "In-Kind Package 1",
    getAmount: "50,000 ETB",
    savingAmount: "5,000 ETB",
  },
  {
    id: 2,
    name: "In-Kind Package 2",
    getAmount: "75,000 ETB",
    savingAmount: "7,500 ETB",
  },
  {
    id: 3,
    name: "In-Kind Package 3",
    getAmount: "100,000 ETB",
    savingAmount: "10,000 ETB",
  },
]);

// Sample data for Invest packages
const investPackages = ref([
  {
    id: 1,
    name: "Invest Package 1",
    getAmount: "200,000 ETB",
    savingAmount: "20,000 ETB",
  },
  {
    id: 2,
    name: "Invest Package 2",
    getAmount: "300,000 ETB",
    savingAmount: "30,000 ETB",
  },
  {
    id: 3,
    name: "Invest Package 3",
    getAmount: "500,000 ETB",
    savingAmount: "50,000 ETB",
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

/* Headline Section */
.headline-section {
  text-align: center;
  margin-bottom: 20px;
  padding-top: 20px;
}

.headline-text {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-primary);
  margin: 0;
  line-height: 1.4;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-text {
  font-size: 14px;
  color: var(--ion-color-wujo-primary);
  line-height: 1.6;
  margin: 0;
}

/* Discover Packages Section */
.discover-packages-section {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.discover-packages-header {
  background: var(--ion-color-wujo-primary);
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.discover-packages-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.package-categories {
  background: var(--ion-color-wujo-light-grey);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.package-category-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-primary);
}

/* Package Sections (In-Kind and Invest) */
.package-section {
  margin-top: 30px;
}

.section-header {
  background: var(--ion-color-wujo-primary);
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  text-align: center;
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.packages-grid {
  background: var(--ion-color-wujo-light-grey);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 0 0 8px 8px;
}

.package-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.package-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-primary);
  display: block;
  margin-bottom: 15px;
}

.package-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.package-amount,
.package-saving {
  font-size: 14px;
  color: #555;
  display: block;
}
</style>
