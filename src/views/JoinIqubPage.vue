<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar -->
      <div class="top-bar">
        <ion-icon
          :icon="arrowBackOutline"
          class="menu-icon"
          @click="goBack"
        ></ion-icon>
        <ion-text class="page-title">Join Iqub</ion-text>
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

      <div class="page-content">
        <ion-text class="page-heading"><h2>Join Iqub</h2></ion-text>
        <p>Enter the unique code to join an Iqub.</p>
        <!-- Add form for joining Iqub here -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonContent, IonIcon, IonText, IonBadge } from "@ionic/vue";
import { arrowBackOutline, notificationsOutline } from "ionicons/icons";

const router = useRouter();
const notificationCount = ref(3);

const goBack = () => {
  router.back();
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
  --background: var(--ion-color-wujo-light-grey);
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
}

.page-heading {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
</style>
