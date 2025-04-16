<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Collector Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label>My Iqubs</ion-label>
          <ion-router-link router-link="/collector/my-iqubs" />
        </ion-item>
        <ion-item>
          <ion-label>Create Iqub</ion-label>
          <ion-router-link router-link="/collector/create-iqub" />
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRouterLink,
} from "@ionic/vue";
</script>
