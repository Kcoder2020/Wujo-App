<template>
  <div v-if="errorMessage" class="error-display">
    <ion-alert
      trigger="error-alert"
      :message="errorMessage"
      :buttons="[{ text: 'Dismiss', role: 'cancel' }]"
    ></ion-alert>
    <ion-button id="error-alert" expand="block" color="danger"
      >Show Error</ion-button
    >
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { IonAlert, IonButton } from "@ionic/vue";

export default defineComponent({
  name: "ErrorDisplay",
  components: { IonAlert, IonButton },
  props: {
    errorMessage: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped>
.error-display {
  color: red;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid red;
  border-radius: 5px;
}
</style>
