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

      <!-- Member Tab Bar -->
      <member-tab-bar></member-tab-bar>

      <!-- Main Content Area -->
      <div class="page-content">
        <!-- Join Iqub Circle Card -->
        <div class="join-iqub-card">
          <!-- Title -->
          <div class="card-title">
            Join Your Iqub Circle with the Unique Code sent Via SMS
          </div>

          <!-- Section Label -->
          <div class="section-label">Iqub Invitations</div>

          <!-- Input Field -->
          <ion-input
            v-model="uniqueCode"
            placeholder="Enter Unique Code"
            class="code-input"
            type="text"
          ></ion-input>

          <!-- Join Button -->
          <ion-button
            expand="block"
            class="join-button"
            @click="joinIqubCircle"
            :disabled="!uniqueCode || isLoading"
          >
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
            <span v-else>Join Iqub Circle</span>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonText,
  IonBadge,
  IonInput,
  IonButton,
  IonSpinner,
  menuController,
} from "@ionic/vue";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import MemberTabBar from "@/components/MemberTabBar.vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const notificationCount = ref(3);
const uniqueCode = ref("");
const isLoading = ref(false);

const openMenu = () => {
  console.log("Open menu clicked");
  menuController.open("app-menu");
};

const goToNotifications = () => {
  router.push("/notifications");
};

const joinIqubCircle = async () => {
  if (!uniqueCode.value.trim()) {
    return;
  }

  isLoading.value = true;
  try {
    // TODO: Replace with actual API call
    // Example API call structure:
    // const response = await apiService.post('/iqub/join', {
    //   code: uniqueCode.value.trim()
    // });

    console.log("Joining Iqub Circle with code:", uniqueCode.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // On success, you might want to:
    // 1. Show success message
    // 2. Redirect to member dashboard or my-iqubs page
    // 3. Refresh user data
    router.push("/member/my-iqubs");
  } catch (error) {
    console.error("Error joining Iqub Circle:", error);
    // TODO: Show error message to user
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
:root {
  --ion-color-wujo-primary: #014023;
  --ion-color-wujo-light-grey: #f2f2f2;
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

/* Member Tab Bar */
member-tab-bar {
  display: block;
  margin-bottom: 0;
}

/* Main Content Area */
.page-content {
  padding: 20px;
  background: white;
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 30px;
}

/* Join Iqub Circle Card */
.join-iqub-card {
  background: var(--ion-color-wujo-light-grey);
  border-radius: 10px;
  padding: 30px 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: normal;
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
  margin-bottom: 15px;
}

.code-input {
  --background: white;
  --padding-start: 15px;
  --padding-end: 15px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --border-radius: 8px;
  --border-width: 1px;
  --border-style: solid;
  --border-color: #ddd;
  margin-bottom: 20px;
  font-size: 16px;
}

.join-button {
  --background: var(--ion-color-wujo-primary);
  --background-activated: var(--ion-color-wujo-primary);
  --background-disabled: #ccc;
  --border-radius: 8px;
  --color: white;
  font-weight: bold;
  text-transform: none;
  height: 50px;
  margin-top: 10px;
}

.join-button:disabled {
  opacity: 0.6;
}
</style>
