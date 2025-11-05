<template>
  <!-- Use a simple div with flexbox to contain the buttons -->
  <div class="member-tab-bar">
    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('dashboard') }"
      fill="clear"
      @click="goTo('/member/dashboard')"
    >
      Dashboard
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('my-iqubs') }"
      fill="clear"
      @click="goTo('/member/my-iqubs')"
    >
      IqubBook
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('discover') }"
      fill="clear"
      @click="goTo('/member/discover')"
    >
      Discover Page
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('profile') }"
      fill="clear"
      @click="goTo('/member/profile')"
    >
      Profile
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonButton } from "@ionic/vue";

// Get the current route and router instance
const route = useRoute();
const router = useRouter();

// Function to check if a tab is currently active based on the route path
const isActive = (tabName: string) => {
  // Check if the current route's path contains the tabName segment
  // Using startsWith allows matching child routes if any
  if (tabName === "dashboard") return route.path === "/member/dashboard"; // Exact match for dashboard
  if (tabName === "my-iqubs") return route.path.startsWith("/member/my-iqubs");
  if (tabName === "discover") return route.path.startsWith("/member/discover");
  if (tabName === "profile") return route.path.startsWith("/member/profile");

  return false;
};

// Function to navigate to the specified path
// Note: Using useRouter from vue-router for consistency with the rest of the codebase
// Ionic animations can be controlled via router configuration if needed
const goTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
/* Re-use color variables (ideally globally in variables.css) */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
}

.member-tab-bar {
  display: flex; /* Arrange buttons horizontally */
  width: 100%; /* Take full width */
  background: var(--ion-color-wujo-light-grey); /* Light grey background */
  /* Add some visual separation from the content above/below */
  border-bottom: 1px solid #ddd; /* Subtle border */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* Optional: add subtle shadow */
  padding: 0 5px; /* Add slight horizontal padding if needed */
}

.tab-button {
  flex: 1; /* Distribute space equally among buttons */
  --background: transparent; /* Default transparent background */
  --color: var(--ion-color-wujo-primary); /* Green text color */
  --padding-start: 0; /* Remove default button padding */
  --padding-end: 0;
  --padding-top: 10px; /* Vertical padding */
  --padding-bottom: 10px;
  font-size: 13px; /* Adjust font size */
  font-weight: normal; /* Normal weight for inactive */
  text-transform: capitalize; /* Capitalize text */
  height: auto; /* Let height be determined by padding */
  border-radius: 18px; /* Rounded corners for rectangular tabs */
  border: 1px solid #006a52; /* Green border */
  --background-hover: rgba(0, 106, 82, 0.05); /* Light green hover effect */
  --background-focused: rgba(0, 106, 82, 0.08); /* Light green focus effect */
  --ripple-color: rgba(0, 106, 82, 0.1); /* Green ripple effect */
  margin-top: 10px;
  margin-bottom: 20px;
}

/* Style for the active tab button */
.tab-button-active {
  background: var(--ion-color-wujo-primary); /* Dark green background */
  --color: white; /* White text color */
  font-weight: bold; /* Bold weight for active tab */
  /* Remove hover/focus effects on the active tab */
  --background-hover: var(--ion-color-wujo-primary);
  --background-focused: var(--ion-color-wujo-primary);
  --ripple-color: white;
  border-radius: 18px; /* Rounded corners for rectangular tabs */
  border: none;
}
</style>
