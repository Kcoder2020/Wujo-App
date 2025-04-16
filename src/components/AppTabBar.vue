<template>
  <ion-tab-bar v-if="isLoggedIn" slot="bottom">
    <template v-if="currentUser?.role === 'collector'">
      <ion-tab-button tab="my-iqubs" :href="'/collector/my-iqubs'">
        <ion-icon :icon="listOutline" />
        <ion-label>My Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="create-iqub" :href="'/collector/create-iqub'">
        <ion-icon :icon="addCircleOutline" />
        <ion-label>Create Iqub</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" :href="'/profile'">
        <ion-icon :icon="personOutline" />
        <ion-label>Profile</ion-label>
      </ion-tab-button>
    </template>

    <template v-else-if="currentUser?.role === 'member'">
      <ion-tab-button tab="joined-iqubs" :href="'/member/joined-iqubs'">
        <ion-icon :icon="listOutline" />
        <ion-label>Joined Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" :href="'/profile'">
        <ion-icon :icon="personOutline" />
        <ion-label>Profile</ion-label>
      </ion-tab-button>
    </template>
  </ion-tab-bar>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/vue";
import { listOutline, addCircleOutline, personOutline } from "ionicons/icons";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const currentUser = computed(() => store.getters["auth/currentUser"]);
const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);
</script>
