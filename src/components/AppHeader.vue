<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="logo-container">
        <ion-img :src="logo" class="logo" alt="Wujo Logo"></ion-img>
      </ion-title>
      <ion-buttons slot="end">
        <ion-button>
          <ion-img :src="profile" class="profile-image" alt="User Profile" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonButtons,
  IonButton,
} from "@ionic/vue";
import logo from "@/assets/img/wujo-logo.png";
import profile from "@/assets/img/profile.png";
</script>

<style scoped>
ion-toolbar {
  --background: var(
    --ion-color-primary,
    #ffffff
  ); /* Example: Use a primary color or white */
  --color: var(
    --ion-text-color,
    #000000
  ); /* Example: Use a text color or black */
}

ion-title.logo-container {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.logo {
  max-height: 40px; /* Adjust as needed */
  margin-right: 10px;
}

.profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.profile-image {
  padding-right: 10px;
}
</style>
