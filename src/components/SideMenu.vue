<template>
  <ion-menu content-id="main-content" menu-id="app-menu">
    <ion-header>
      <ion-toolbar :color="isIos ? 'wujo-primary' : 'wujo-primary'">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button @click="navigateTo('/collector/profile')">
          <ion-icon :icon="personCircleOutline"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-item>
        <ion-item button @click="navigateTo('/settings')">
          <ion-icon :icon="settingsOutline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-item>
        <ion-item button @click="handleLogout">
          <ion-icon :icon="logOutOutline"></ion-icon>
          <ion-label>Logout</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  menuController,
  isPlatform,
  useIonRouter,
} from "@ionic/vue";
import {
  personCircleOutline,
  settingsOutline,
  logOutOutline,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const ionRouter = useIonRouter(); // 2. Get the IonRouter instance

const store = useStore();
const isIos = isPlatform("ios");

const navigateTo = async (path: string) => {
  await menuController.close("app-menu");
  //   router.push(path);
  ionRouter.push(path, "forward", "none");
};

const handleLogout = async () => {
  await menuController.close("app-menu");
  // As per 04_state_management.md, dispatch the logout action
  await store.dispatch("auth/logout");
  // Redirect to login after logout
  //   router.replace("/login");
  ionRouter.push("/login", "forward", "none");
};
</script>

<style scoped>
ion-toolbar {
  --background: var(--ion-color-wujo-primary);
  --color: white;
}
</style>
