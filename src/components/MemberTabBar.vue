<template>
  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="joined-iqubs" href="/member/joined-iqubs">
        <ion-icon :icon="peopleOutline" />
        <ion-label>Joined Iqubs</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" href="/member/profile">
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
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { peopleOutline, personCircleOutline } from "ionicons/icons";
</script>
