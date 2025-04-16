<template>
  <IonPage>
    <IonToast
      :is-open="showToast.value"
      :message="toastMessage.value"
      :color="toastColor.value"
      duration="3000"
      @onIonToastDidDismiss="showToast.value = false"
    ></IonToast>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Iqub Details</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent :fullscreen="true">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Iqub Details </IonTitle>
        </IonToolbar>
      </IonHeader>
      <div v-if="status === 'loading' || !currentIqub">
        <IonSpinner name="dots" />
      </div>

      <IonList v-if="currentIqub">
        <IonItem>
          <IonLabel>Name</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.name }}</template>
          </IonText>
        </IonItem>
        <IonItem>
          <IonLabel>Saving Pattern</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.saving_pattern }}</template>
          </IonText>
        </IonItem>
        <IonItem>
          <IonLabel>Saving Amount</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.saving_amount }}</template>
          </IonText>
        </IonItem>
        <IonItem>
          <IonLabel>Credit Pattern</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.credit_pattern }}</template>
          </IonText>
        </IonItem>
        <IonItem>
          <IonLabel>Credit Amount</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.credit_amount }}</template>
          </IonText>
        </IonItem>
        <IonItem>
          <IonLabel>Members Count</IonLabel>
          <IonText>
            <template v-slot:end>{{ currentIqub.members_count }}</template>
          </IonText>
        </IonItem>
      </IonList>
      <IonText
        v-if="currentIqub && currentIqub.lottery_winner"
        style="margin-top: 10px; margin-left: 16px"
      >
        Lottery Winner: {{ currentIqub.lottery_winner }}
      </IonText>
      <IonText v-else style="margin-top: 10px; margin-left: 16px">
        No winner yet
      </IonText>
      <IonList
        v-if="
          currentIqub && currentIqub.members && currentIqub.members.length > 0
        "
      >
        <IonItem v-for="member in currentIqub.members" :key="member.id">
          <IonLabel> {{ member.name }} - {{ member.phone }} </IonLabel>
        </IonItem>
      </IonList>
      <IonText v-else>No members available.</IonText>
      <div v-if="currentIqub" style="margin-top: 20px">
        <IonButton @click="startLottery" :disabled="isInitiating">{{
          isInitiating ? "Initiating..." : "Start Lottery"
        }}</IonButton>
      </div>
      <div style="display: flex; align-items: center; margin-top: 10px">
        <IonDatetime
          v-model="nextLotteryDate"
          display-format="YYYY-MM-DD"
          picker-format="YYYY-MM-DD"
          :value="currentIqub?.next_lottery_date"
          min="2024-01-01"
        ></IonDatetime>
        <IonButton
          @click="setNextLotteryDate"
          :disabled="isSettingDate"
          style="margin-left: 10px"
        >
          {{ isSettingDate ? "Setting..." : "Set Next Lottery Date" }}
        </IonButton>
      </div>

      <div v-if="status === 'error'">
        <IonText color="danger">Error: {{ error }}</IonText>
      </div>

      <div v-if="currentIqub">
        <IonButton @click="openModal">Add Member</IonButton>
      </div>

      <IonModal v-model="isModalOpen">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Member</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <IonItem>
            <IonLabel position="floating">Phone Number</IonLabel>
            <IonInput v-model="phoneNumber" type="tel"></IonInput>
          </IonItem>
          <IonText v-if="phoneError" color="danger">{{ phoneError }}</IonText>
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
            "
          >
            <IonButton color="light" @click="closeModal">Cancel</IonButton>
            <IonButton @click="addMember" :disabled="isAdding">{{
              isAdding ? "Adding..." : "Add"
            }}</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
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
  IonText,
  IonButton,
  IonModal,
  IonInput,
  IonSpinner,
  IonToast,
  IonDatetime,
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import { Iqub } from "../types";

const isModalOpen = ref(false);
const phoneNumber = ref("");
const phoneError = ref("");
const isAdding = ref(false);
const store = useStore();
const route = useRoute();
const iqubId = computed(() => Number(route.params.id));
const initiateLotteryError = computed(
  () => store.state.iqubs.initiateLotteryError
);
const currentIqub = computed(() => store.state.iqubs.currentIqub);
const addMemberError = computed(() => store.state.iqubs.addMemberError);
const { status, error } = store.state.iqubs;
const isInitiating = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastColor = ref("success");
const nextLotteryDate = ref("");
const isSettingDate = ref(false);

const setNextLotteryDateError = computed(
  () => store.state.iqubs.setNextLotteryDateError
);
onMounted(async () => {
  await store.dispatch("iqubs/fetchIqubDetails", iqubId.value);
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  phoneNumber.value = "";
  phoneError.value = "";
};

const addMember = async () => {
  phoneError.value = "";
  if (!phoneNumber.value) {
    phoneError.value = "Phone number is required";
    return;
  }
  isAdding.value = true;
  try {
    await store.dispatch("iqubs/addMemberToIqub", {
      iqubId: iqubId.value,
      phone: phoneNumber.value,
    });
    if (addMemberError.value) {
      // Check for error after dispatch
      phoneError.value = addMemberError.value;
    } else {
      closeModal();
      // Optionally, show a success message here later
      await store.dispatch("iqubs/fetchIqubDetails", iqubId.value); // Refresh Iqub details
    }
  } catch (error: any) {
    phoneError.value = error.message || "Failed to add member";
  } finally {
    isAdding.value = false;
  }
};

const startLottery = async () => {
  isInitiating.value = true;
  try {
    await store.dispatch("iqubs/initiateLottery", iqubId.value);
    showToast.value = true;
    if (initiateLotteryError.value) {
      toastMessage.value = initiateLotteryError.value;
      toastColor.value = "danger";
    } else {
      toastMessage.value =
        "Lottery initiated successfully. Winner will be notified.";
      toastColor.value = "success";
      await store.dispatch("iqubs/fetchIqubDetails", iqubId.value); // Refresh Iqub details
    }
  } catch (error: any) {
    toastMessage.value = error.message || "Failed to initiate lottery"; // Keep this for unexpected errors
    toastColor.value = "danger";
  } finally {
    isInitiating.value = false;
  }
};

const setNextLotteryDate = async () => {
  if (!nextLotteryDate.value) {
    showToast.value = true;
    toastMessage.value = "Please select a date.";
    toastColor.value = "danger";
    return;
  }
  isSettingDate.value = true;
  try {
    await store.dispatch("iqubs/setNextLotteryDate", {
      iqubId: iqubId.value,
      nextLotteryDate: nextLotteryDate.value,
    });
    if (setNextLotteryDateError.value) {
      toastMessage.value = setNextLotteryDateError.value;
      toastColor.value = "danger";
    } else {
      toastMessage.value = "Next lottery date set successfully.";
      toastColor.value = "success";
      await store.dispatch("iqubs/fetchIqubDetails", iqubId.value); // Refresh Iqub details
    }
    showToast.value = true;
  } catch (error: any) {
    showToast.value = true;
    toastMessage.value = error.message || "Failed to set next lottery date"; // Keep this for unexpected errors

    toastColor.value = "danger";
  } finally {
    isSettingDate.value = false;
  }
};
</script>
