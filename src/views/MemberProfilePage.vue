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

      <!-- Main Content Area for Profile -->
      <div class="profile-content">
        <!-- Loading Indicator -->
        <div v-if="!memberProfileData" class="loading-indicator">
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading profile...</ion-text>
        </div>

        <!-- Profile Card Container (Visible when profile data is available) -->
        <div v-else-if="memberProfileData" class="profile-card">
          <!-- Profile Image -->
          <div class="profile-image-container">
            <img
              :src="
                memberProfileData.avatar_url || 'https://picsum.photos/200/300'
              "
              alt="Profile Picture"
              class="profile-image"
            />
          </div>

          <!-- Name -->
          <ion-text class="profile-name">{{
            memberProfileData.name || "N/A"
          }}</ion-text>

          <!-- Phone Number -->
          <ion-text class="profile-phone">{{
            memberProfileData.phone || "N/A"
          }}</ion-text>

          <!-- Edit Profile Button -->
          <ion-button
            expand="block"
            class="edit-profile-button"
            @click="editProfile"
          >
            Edit Profile
          </ion-button>

          <!-- Summary Stats Row -->
          <div class="stats-row">
            <div class="stat-item">
              <ion-text class="stat-value">{{
                memberProfileData.iqub_joined_count || "10"
              }}</ion-text>
              <ion-text class="stat-label">Iqub Joined</ion-text>
            </div>
            <div class="stat-item">
              <ion-text class="stat-value">{{
                memberProfileData.lotteries_won_count || "10"
              }}</ion-text>
              <ion-text class="stat-label">Lotteries Won</ion-text>
            </div>
            <div class="stat-item">
              <ion-text class="stat-value">{{
                memberProfileData.total_saved || "10,000"
              }}</ion-text>
              <ion-text class="stat-label">Total Saved (ETB)</ion-text>
            </div>
            <div class="stat-item">
              <ion-text class="stat-value">{{
                memberProfileData.active_iqubs || "10"
              }}</ion-text>
              <ion-text class="stat-label">Active Iqubs</ion-text>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonIcon,
  IonBadge,
  IonButton,
  IonSpinner,
  menuController,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";

// Import Icons
import { menuOutline, notificationsOutline } from "ionicons/icons";

// Import MemberTabBar component
import MemberTabBar from "@/components/MemberTabBar.vue";

const store = useStore();
const router = useRouter();

const notificationCount = ref(3);

// --- Profile Data (from Member store) ---
const memberProfileData = computed(() => {
  const profile = store.getters["member/profile"];
  // If profile data exists, return it with member-specific stats
  if (profile) {
    return {
      name: profile.name || "Thomas Doe",
      phone: profile.phone || "+2519346232",
      avatar_url: profile.avatar_url || null,
      iqub_joined_count: profile.iqub_joined_count || "10",
      lotteries_won_count: profile.lotteries_won_count || "10",
      total_saved: profile.total_saved || "10,000",
      active_iqubs: profile.active_iqubs || "10",
    };
  }
  // Return sample data for development if no profile is loaded yet
  return {
    name: "Thomas Doe",
    phone: "+2519346232",
    avatar_url: null,
    iqub_joined_count: "10",
    lotteries_won_count: "10",
    total_saved: "10,000",
    active_iqubs: "10",
  };
});

// Fetch member profile on component mount
onMounted(() => {
  store.dispatch("member/fetchMemberProfile");
});

// --- Event Handlers for Top Bar ---
const openMenu = () => {
  console.log("Open menu clicked");
  menuController.open("app-menu");
};

const goToNotifications = () => {
  router.push("/notifications");
};

// --- Profile Actions ---
const editProfile = () => {
  console.log("Edit Profile button clicked");
  // Implement navigation to an Edit Profile page or open a modal
  // router.push('/member/profile/edit');
};
</script>

<style scoped>
/* Re-use color variables */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  display: block;
}

/* --- Top Bar Styles --- */
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

/* --- Member Tab Bar Styles --- */
member-tab-bar {
  display: block;
  margin-bottom: 20px;
}

/* --- Main Profile Content Area --- */
.profile-content {
  padding: 0 20px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Loading Indicator --- */
.loading-indicator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
  width: 100%;
}

.loading-indicator ion-spinner {
  width: 30px;
  height: 30px;
  --color: var(--ion-color-wujo-primary);
}

/* --- Profile Card Container (The main white block) --- */
.profile-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 0; /* Top padding is larger, bottom 0 before stats row */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 400px;
}

/* --- Profile Image --- */
.profile-image-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--ion-color-wujo-light-grey);
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--ion-color-wujo-primary);
}

.profile-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- Name and Phone --- */
.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 5px;
}

.profile-phone {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 20px;
}

/* --- Edit Profile Button --- */
.edit-profile-button {
  --background: var(--ion-color-wujo-primary);
  --background-activated: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  height: 45px;
  width: 100%;
  margin-bottom: 30px;
}

/* --- Summary Stats Row --- */
.stats-row {
  background: var(--ion-color-wujo-light-grey);
  padding: 15px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 3px;
}

.stat-label {
  font-size: 12px;
  color: var(--ion-color-wujo-text-grey);
  text-align: center;
  line-height: 1.3;
}
</style>
