<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Signup</ion-title>
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
        <ion-item>
          <ion-label position="floating">Name</ion-label>
          <ion-input v-model="name" type="text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Phone</ion-label>
          <ion-input v-model="phone" type="tel"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-select v-model="gender" placeholder="Select Gender">
            <ion-select-option value="male">Male</ion-select-option>
            <ion-select-option value="female">Female</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Role</ion-label>
          <ion-radio-group v-model="role">
            <ion-item>
              <ion-label>Collector</ion-label>
              <ion-radio value="collector"></ion-radio>
            </ion-item>
            <ion-item>
              <ion-label>Member</ion-label>
              <ion-radio value="member"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-item>
      </ion-list>
      <ion-button expand="block" @click="signup" :disabled="!isFormValid"
        >Signup</ion-button
      >
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
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
  IonRadioGroup,
  IonRadio,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import ErrorDisplay from "../components/ErrorDisplay.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SignupPage",
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
    IonRadioGroup,
    IonRadio,
    IonSelect,
    IonSelectOption,
    ErrorDisplay,
  },
  setup() {
    const username = ref("");
    const password = ref("");
    const name = ref("");
    const phone = ref("");
    const gender = ref("");
    const role = ref("");
    const store = useStore();
    const router = useRouter();
    const errorMessage = ref(store.state.auth.error);

    const isFormValid = computed(() => {
      return (
        username.value !== "" &&
        password.value !== "" &&
        name.value !== "" &&
        phone.value !== "" &&
        gender.value !== "" &&
        role.value !== ""
      );
    });

    const signup = async () => {
      if (!isFormValid.value) {
        alert("Please fill in all required fields.");
        return;
      }

      try {
        const user = await store.dispatch("auth/signup", {
          username: username.value,
          password: password.value,
          name: name.value,
          phone: phone.value,
          gender: gender.value,
          role: role.value,
        });

        if (user.role === "collector") {
          router.push("/collector-dashboard");
        } else if (user.role === "member") {
          router.push("/member-dashboard");
        } else {
          router.push("/home"); // Default route if role is not defined
        }
      } catch (error) {
        errorMessage.value = error.message || "Signup failed.";
      }
    };

    return {
      username,
      password,
      name,
      phone,
      gender,
      role,
      signup,
      errorMessage,
      isFormValid,
    };
  },
});
</script>
