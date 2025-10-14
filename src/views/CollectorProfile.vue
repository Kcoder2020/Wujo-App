<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar (Reused component/structure) -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <ion-text class="page-title">HI Collector</ion-text>
        <div class="notification-container">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
            @click="goToNotifications"
          ></ion-icon>
          <ion-badge color="danger" class="notification-badge">3</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar (Integrated) -->
      <!-- Ensure 'profile' is the correct active-tab value matching your CollectorTabBar component -->
      <collector-tab-bar active-tab="collector-profile"></collector-tab-bar>

      <!-- Main Content Area for Profile -->
      <div class="profile-content">
        <!-- Loading Indicator -->
        <!-- You might want a specific status/error for profile data if fetched separately -->
        <!-- For simplicity, let's assume profile data is part of the main auth state -->
        <div v-if="!collectorProfileData" class="loading-indicator">
          <ion-spinner name="dots" color="wujo-primary" />
          <ion-text>Loading profile...</ion-text>
        </div>
        <!-- Error Message (if fetching profile data) -->
        <!-- <div v-else-if="profileError" class="error-message"> -->
        <!--   <p>Error loading profile: {{ profileError }}</p> -->
        <!--    <ion-button @click="retryFetchProfile">Retry</ion-button> -->
        <!-- </div> -->

        <!-- Profile Card Container (Visible when profile data is available) -->
        <div v-else-if="collectorProfileData" class="profile-card">
          <!-- Profile Image -->
          <div class="profile-image-container">
            <!-- Use ion-avatar or img for the profile picture -->
            <img
              :src="collectorProfileData.avatar_url || defaultProfileImage"
              alt="Profile Picture"
              class="profile-image"
            />
            <!-- If using ion-avatar: <ion-avatar><img :src="..." /></ion-avatar> -->
          </div>

          <!-- Name -->
          <ion-text class="profile-name">{{
            collectorProfileData.name || "N/A"
          }}</ion-text>

          <!-- Phone Number -->
          <ion-text class="profile-phone">{{
            collectorProfileData.phone || "N/A"
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
          <!-- This row has a distinct background -->
          <div class="stats-row">
            <div class="stat-item">
              <ion-text class="stat-value">{{
                collectorProfileData.joined_iqubs[0].total_collected || "0"
              }}</ion-text>
              <ion-text class="stat-label">Total Collected</ion-text>
            </div>
            <div class="stat-item">
              <!-- Assuming 'iqub_joined_count' or similar exists -->
              <ion-text class="stat-value">{{
                collectorProfileData.joined_iqubs[0].members_count || "0"
              }}</ion-text>
              <ion-text class="stat-label">Iqub Joined members</ion-text>
            </div>
            <div class="stat-item">
              <!-- Assuming 'lottery_won_count' or similar exists -->
              <ion-text class="stat-value">{{
                collectorProfileData.joined_iqubs[0].members_count || "0"
              }}</ion-text>
              <ion-text class="stat-label">Lottey Won</ion-text>
            </div>
            <div class="stat-item">
              <!-- Assuming 'finished_iqub_count' or similar exists -->
              <ion-text class="stat-value">{{
                collectorProfileData.joined_iqubs[0].members_count || "0"
              }}</ion-text>
              <ion-text class="stat-label">Finished Iqub</ion-text>
            </div>
          </div>
          <!-- Edit Profile Button -->
          <ion-button
            expand="block"
            class="logout-profile-button"
            @click="logoutProfile"
          >
            Logout
          </ion-button>
        </div>
        <!-- Handle case where profile data is success but null/empty -->
        <!-- <div v-else-if="profileStatus === 'success' && !collectorProfileData" class="empty-state"> -->
        <!--    <ion-text>Profile data not available.</ion-text> -->
        <!-- </div> -->
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
  IonSpinner, // For loading indicator
  // IonAvatar, // If using ion-avatar for image
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue"; // Import ref

// Import Icons
import { menuOutline, notificationsOutline } from "ionicons/icons";

// Import CollectorTabBar component
import CollectorTabBar from "@/components/CollectorTabBar.vue";

// Import a default profile image if needed
import defaultProfileImage from "@/assets/img/profile.jpeg"; // Assuming you have a default profile image in assets/img

const store = useStore();
const router = useRouter();

// --- Profile Data (Assuming it's in the Auth store) ---
// You should verify where your user/profile data is stored after login.
// It's commonly part of the auth module state (e.g., state.auth.user).
// Let's assume your auth module has a getter or state property like `user`
// which contains the profile data for the logged-in user.
// ADJUST THIS COMPUTED PROPERTY based on your actual store structure:
const collectorProfileData = computed(() => store.getters["auth/getUser"]); // Example: assuming an auth module with a getUser getter
// OR if stored directly in state:
// const collectorProfileData = computed(() => store.state.auth.user);

// Assuming your profile data object has properties like:
// { id, name, phone, avatar_url, total_saved, iqub_joined_count, lottery_won_count, finished_iqub_count }

// If profile data needs a separate fetch, you'd add state/actions/getters to the auth module
// or a dedicated profile module, and use those here.
// Example state/getters if separate:
// const profileStatus = computed(() => store.state.profile.status); // Assuming dedicated profile module
// const profileError = computed(() => store.state.profile.error);

// --- Data Fetching (if profile data needs a separate fetch) ---
// onMounted(() => {
//    // Assuming you have an action like 'auth/fetchUserProfile' or 'profile/fetchProfile'
//    // Check if user data is already loaded or if fetch is needed
//    if (!collectorProfileData.value && (profileStatus.value === 'idle' || profileStatus.value === 'error')) {
//        store.dispatch("auth/fetchUserProfile"); // Or "profile/fetchProfile"
//    }
// });
// const retryFetchProfile = () => { store.dispatch("auth/fetchUserProfile"); }; // Retry function for error state

// --- Event Handlers for Top Bar (Reused) ---
const openMenu = () => {
  console.log("Open menu clicked"); /* Implement menu logic */
};
const goToNotifications = () => {
  console.log("Notifications icon clicked"); /* Navigate */
};

// --- Profile Actions ---
const editProfile = () => {
  console.log("Edit Profile button clicked");
  // Implement navigation to an Edit Profile page or open a modal
  // router.push('/collector/profile/edit'); // Example navigation
};
const logoutProfile = () => {
  console.log("Edit Profile button clicked");
  // Implement navigation to an Edit Profile page or open a modal
  store.dispatch("auth/logout");
  router.push("/login"); // Example navigation
};
</script>

<style scoped>
/* Re-use color variables (ideally globally in variables.css) */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
  --ion-color-wujo-grey: #dcdcdc; /* Grey for borders */
  --ion-color-wujo-text-grey: #555; /* Text grey */
  --ion-color-wujo-dark-grey: #333; /* Darker text for values/titles */
  --ion-color-wujo-red: #eb445a; /* Red color (less likely needed here) */
  --ion-color-wujo-green-border: rgba(
    0,
    106,
    82,
    0.3
  ); /* Lighter green for borders */
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0; /* Remove default padding */
  --padding-end: 0;
  display: block;
}

/* --- Top Bar Styles (Reused) --- */
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

/* --- Collector Tab Bar Styles (Reference) --- */
collector-tab-bar {
  display: block;
  margin-bottom: 20px; /* Space below the tab bar */
}

/* --- Main Profile Content Area --- */
.profile-content {
  padding: 0 20px; /* Horizontal padding */
  padding-bottom: 40px; /* Bottom padding */
  /* Center the content if it's narrower than the screen */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
}

/* --- Loading, Error, Empty States (Reused) --- */
.loading-indicator,
.error-message,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
  width: 100%;
}
.error-message p,
.empty-state ion-text {
  color: var(--ion-color-wujo-text-grey);
  margin-top: 10px;
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
  align-items: center; /* Center content horizontally */
  text-align: center;
  width: 100%; /* Take full width within parent padding */
  max-width: 400px; /* Limit max width for a card-like appearance */
}

/* --- Profile Image --- */
.profile-image-container {
  width: 100px; /* Container size */
  height: 100px;
  border-radius: 50%; /* Make it circular */
  background: var(
    --ion-color-wujo-light-grey
  ); /* Background if image doesn't fill */
  overflow: hidden; /* Clip image to circle */
  margin-bottom: 20px; /* Space below image */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--ion-color-wujo-primary); /* Green border */
}

.profile-image {
  display: block; /* Ensure it's a block element */
  width: 100%; /* Make image fill container */
  height: 100%; /* Make image fill container */
  object-fit: cover; /* Cover the area, cropping if necessary */
}

/* --- Name and Phone --- */
.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 5px; /* Space below name */
}

.profile-phone {
  font-size: 15px;
  color: var(--ion-color-wujo-text-grey);
  margin-bottom: 20px; /* Space below phone before button */
}

/* --- Edit Profile Button --- */
.edit-profile-button {
  --background: var(--ion-color-wujo-primary); /* Green background */
  --background-activated: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  height: 45px; /* Adjust height */
  width: 100%; /* Take full width within card padding */
  margin-bottom: 30px; /* Space below button before stats */
}

.logout-profile-button {
  --background: #ff0000; /* Green background */
  --background-activated: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  height: 45px; /* Adjust height */
  width: 100%; /* Take full width within card padding */
  margin-bottom: 30px; /* Space below button before stats */
}

/* --- Summary Stats Row --- */
.stats-row {
  background: var(--ion-color-wujo-light-grey); /* Light grey background */
  padding: 15px 10px; /* Vertical and horizontal padding */
  border-bottom-left-radius: 10px; /* Match card radius */
  border-bottom-right-radius: 10px;
  width: 100%; /* Span full width of the card */
  display: grid; /* Use grid for flexible layout */
  grid-template-columns: repeat(
    auto-fit,
    minmax(80px, 1fr)
  ); /* Responsive columns */
  gap: 10px; /* Space between stats items */
  text-align: center; /* Center text within grid cells */
}

.stat-item {
  display: flex;
  flex-direction: column; /* Stack value and label */
  align-items: center; /* Center content */
  padding: 0 5px; /* Add some internal padding */
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 3px; /* Space below value */
}

.stat-label {
  font-size: 12px;
  color: var(--ion-color-wujo-text-grey);
}
</style>
