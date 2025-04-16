<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <button @click="syncData">Sync Data</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: SyncManager;
}

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
  methods: {
    syncData() {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then((registration: ServiceWorkerRegistration) => {
            const registrationWithSync =
              registration as ServiceWorkerRegistrationWithSync;
            return registrationWithSync.sync.register("sync-iqubs");
          })
          .then(() => {
            console.log("Sync registered!");
          })
          .catch((error: any) => {
            console.log("Sync registration failed:", error);
          });
      } else {
        console.log("SyncManager not supported!");
      }
    },
  },
});
</script>
