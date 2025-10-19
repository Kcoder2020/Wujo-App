<template>
  <ion-app>
    <!-- The SideMenu component we created previously -->
    <SideMenu />

    <!-- The main content area. The menu will slide over this. -->
    <ion-router-outlet id="main-content">
      <!-- Your existing error displays can be managed here or within page layouts -->
      <div v-if="!isOnline">
        <ErrorDisplay
          :message="'No internet connection. Please check your network settings.'"
        />
      </div>
      <div v-if="syncError">
        <ErrorDisplay :message="syncError" />
      </div>
    </ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { isOnline } from "./services/networkService";
import ErrorDisplay from "./components/ErrorDisplay.vue";
import SideMenu from "@/components/SideMenu.vue"; // Make sure SideMenu.vue exists

const store = useStore();

// The initial redirect logic from your 'created' hook should ideally be moved
// to your router's navigation guards to prevent re-triggering on every hot-reload.
// For example, in your router/index.ts file.

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "SYNC_ERROR") {
        store.commit("iqubs/setSyncError", event.data.payload);
      } else if (event.data.type === "SYNC_SUCCESS") {
        store.commit("iqubs/setSyncError", null);
      }
    });
  }
});

const syncError = computed(() => store.getters["iqubs/syncError"]);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.router-link-active {
  color: red;
}
</style>
