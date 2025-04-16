<template>
  <div v-if="!isOnline">
    <ErrorDisplay
      :message="'No internet connection. Please check your network settings.'"
    />
  </div>
  <div v-if="syncError">
    <ErrorDisplay :message="syncError" />
  </div>
  <router-view />
</template>

<script>
import { isOnline } from "./services/networkService";
import ErrorDisplay from "./components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { onMounted } from "vue";

export default {
  components: {
    ErrorDisplay,
  },
  created() {
    // Redirect to onboarding by default
    this.$router.push("/onboarding");
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "SYNC_ERROR") {
          store.commit("iqubs/setSyncError", event.data.payload);
        } else if (event.data.type === "SYNC_SUCCESS") {
          store.commit("iqubs/setSyncError", null);
        }
      });
    });

    return {
      isOnline,
      syncError: () => store.getters["iqubs/syncError"],
    };
  },
};
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
