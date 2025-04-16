<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>My Iqubs</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div v-if="iqubsStatus === 'loading'" class="loading-indicator">
        <IonSpinner name="dots" />
      </div>
      <div v-else-if="iqubsStatus === 'error'" class="error-message">
        <p>Error: {{ iqubsError }}</p>
      </div>
      <IonList v-else>
        <IonItem
          v-for="iqub in myIqubs"
          :key="iqub.id"
          button
          @click="() => router.push(`/iqub/${iqub.id}`)"
        >
          <IonLabel>{{ iqub.name }}</IonLabel>
          <IonText>
            <template v-slot:end>Total: {{ iqub.total_collected }}</template>
          </IonText>
          <IonText>
            <template v-slot:end>Progress: {{ iqub.hosted_lottery }}</template>
          </IonText>
        </IonItem>
      </IonList>
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
  IonSpinner,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { Iqub } from "@/types"; // Adjust the path as needed

const store = useStore();
const router = useRouter();

const myIqubs = computed<Iqub[]>(() => store.getters["iqubs/getMyIqubsList"]);
const iqubsStatus = computed<string>(() => store.state.iqubs.status);
const iqubsError = computed<string | null>(() => store.state.iqubs.error);

onMounted(() => {
  if (myIqubs.value.length === 0) {
    store.dispatch("iqubs/fetchMyIqubs");
  }
});
</script>

<style scoped>
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.error-message {
  color: red;
  padding: 20px;
}
</style>
