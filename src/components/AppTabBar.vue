<template v-slot:bottom>
  <ion-tab-bar v-if="isLoggedIn">
    <template v-if="currentUser?.role === 'collector'">
      <ion-tab-button tab="my-iqubs" @click="navigate('/collector/my-iqubs')">
        <ion-icon :icon="listOutline" />
        <ion-label>My Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button
        tab="create-iqub"
        @click="navigate('/collector/create-iqub')"
      >
        <ion-icon :icon="addCircleOutline" />
        <ion-label>Create Iqub</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" @click="navigate('/profile')">
        <ion-icon :icon="personOutline" />
        <ion-label>Profile</ion-label>
      </ion-tab-button>
    </template>

    <template v-else-if="currentUser?.role === 'member'">
      <ion-tab-button
        tab="joined-iqubs"
        @click="navigate('/member/joined-iqubs')"
      >
        <ion-icon :icon="listOutline" />
        <ion-label>Joined Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" @click="navigate('/profile')">
        <ion-icon :icon="personOutline" />
        <ion-label>Profile</ion-label>
      </ion-tab-button>
    </template>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  useIonRouter,
} from "@ionic/vue";
import { listOutline, addCircleOutline, personOutline } from "ionicons/icons";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const ionRouter = useIonRouter();
const currentUser = computed(() => store.getters["auth/currentUser"]);
const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);

const navigate = (path: string) => {
  // Use 'root' for tab navigation to provide a native-like experience
  // where each tab has its own navigation stack.
  // Use 'none' to disable the animation.
  ionRouter.navigate(path, "root", "none");
};
</script>
