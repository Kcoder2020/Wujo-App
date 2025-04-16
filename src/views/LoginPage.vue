<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <error-display :error-message="errorMessage" />
      <ion-list>
        <ion-item>
          <ion-label position="floating">Username</ion-label>
          <ion-input v-model="username" type="text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="block" @click="login">Login</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginPage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    ErrorDisplay,
  },
  setup() {
    const username = ref("");
    const password = ref("");
    const store = useStore();
    const router = useRouter();
    const errorMessage = ref(store.state.auth.error);

    const login = async () => {
      try {
        const user = await store.dispatch("auth/login", {
          username: username.value,
          password: password.value,
        });

        if (user.role === "collector") {
          router.push("/collector-dashboard");
        } else if (user.role === "member") {
          router.push("/member-dashboard");
        } else {
          router.push("/home"); // Default route if role is not defined
        }
      } catch (error) {
        errorMessage.value = store.state.auth.error;
      }
    };

    return {
      username,
      password,
      login,
      errorMessage,
    };
  },
});
</script>
