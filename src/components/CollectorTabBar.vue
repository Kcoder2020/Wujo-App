<template>
  <!-- Use a simple div with flexbox to contain the buttons -->
  <div class="collector-tab-bar">
    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('dashboard') }"
      fill="clear"
      @click="goTo('/collector/dashboard')"
    >
      Dashboard
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('create-iqub') }"
      fill="clear"
      @click="goTo('/collector/create-iqub')"
    >
      Create Iqub
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('my-iqubs') }"
      fill="clear"
      @click="goTo('/collector/my-iqubs')"
    >
      My Iqub
    </ion-button>

    <ion-button
      class="tab-button"
      :class="{ 'tab-button-active': isActive('collector-profile') }"
      fill="clear"
      @click="goTo('/collector/profile')"
    >
      Profile
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { IonButton, useIonRouter, createAnimation } from "@ionic/vue"; // 1. Import createAnimation
import { useStore } from "vuex";

// Get the current route and router instance
const route = useRoute();
const ionRouter = useIonRouter();
const store = useStore();

// 2. Define an empty animation builder
const noAnimation = () => {
  return createAnimation();
};

// Function to check if a tab is currently active based on the route path
const isActive = (tabName: string) => {
  // Check if the current route's path contains the tabName segment
  // This is a simple check; you might need a more exact match
  // depending on your routing structure (e.g., route.path === '/collector-dashboard')
  // Using startsWith allows matching child routes if any (e.g. /my-iqubs/details/123)
  if (tabName === "dashboard") return route.path === "/collector/dashboard"; // Exact match for dashboard
  if (tabName === "create-iqub")
    return route.path.startsWith("/collector/create-iqub");
  if (tabName === "my-iqubs")
    return (
      route.path.startsWith("/collector/my-iqubs") ||
      route.path.startsWith("/iqub") ||
      route.path.startsWith("/collector/iqub-book")
    );
  if (tabName === "collector-profile")
    return route.path.startsWith("/collector/profile");

  return false;
};

// Function to navigate to the specified path
const goTo = (path: string) => {
  // 3. Use ionRouter.push with the empty animation
  // The 'direction' doesn't matter visually when the animation is empty.
  ionRouter.push(path, "forward", noAnimation);
};
</script>

<style scoped>
/* Re-use color variables (ideally globally in variables.css) */
:root {
  --ion-color-wujo-primary: #006a52; /* Dark green */
  --ion-color-wujo-light-grey: #f0f2f5; /* Light grey background */
}

.collector-tab-bar {
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
  border-radius: 18px; /* No rounded corners for rectangular tabs */
  border: 1px solid #006a52; /* Remove default hover/active effects if they don't match */
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
  border-radius: 18px; /* No rounded corners for rectangular tabs */
  border: none;
}
</style>
