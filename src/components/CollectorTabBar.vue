<template>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="my-iqubs" href="/collector/my-iqubs">
        <ion-icon :icon="listOutline" />
        <ion-label>My Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="create-iqub" href="/collector/create-iqub">
        <ion-icon :icon="addCircleOutline" />
        <ion-label>Create Iqub</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" href="/collector/profile">
        <ion-icon :icon="personCircleOutline" />
        <ion-label>Profile</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import {
  listOutline,
  addCircleOutline,
  personCircleOutline,
} from "ionicons/icons";
</script>
