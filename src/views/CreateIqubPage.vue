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
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToast,
} from "@ionic/vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, number } from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Iqub } from "@/types"; // Adjust path as needed

const store = useStore();
const router = useRouter();

const validationSchema = toTypedSchema(
  object({
    name: string().required("Name is required"),
    saving_pattern: string().required("Saving Pattern is required"),
    saving_amount: number()
      .required("Saving Amount is required")
      .positive("Saving Amount must be positive"),
    credit_pattern: string().required("Credit Pattern is required"),
    credit_amount: number()
      .required("Credit Amount is required")
      .positive("Credit Amount must be positive"),
    members_count: number()
      .required("Members Count is required")
      .positive("Members Count must be positive")
      .integer("Members Count must be an integer")
      .min(2, "Members Count must be at least 2"),
  })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    saving_pattern: "1",
    credit_pattern: "1",
  },
});

const submit = handleSubmit(async (values) => {
  try {
    await store.dispatch("iqubs/createIqub", values);
    await IonToast.create({
      message: "Iqub created successfully!",
      duration: 2000,
      position: "top",
      color: "success",
    }).then((toast) => toast.present());
    router.push("/collector/my-iqubs");
  } catch (error: any) {
    await IonToast.create({
      message: error.response?.data?.message || "Failed to create Iqub.",
      duration: 2000,
      position: "top",
      color: "danger",
    }).then((toast) => toast.present());
  }
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Create Iqub</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <Field name="name" as="IonInput" type="text" />
          <ErrorMessage name="name" as="IonText" class="error-message" />
        </IonItem>
        <IonItem>
          <IonLabel>Saving Pattern</IonLabel>
          <Field name="saving_pattern" as="IonSelect" interface="popover">
            <IonSelectOption value="1">Weekly</IonSelectOption>
            <IonSelectOption value="2">Daily</IonSelectOption>
            <IonSelectOption value="3">Monthly</IonSelectOption>
          </Field>
          <ErrorMessage
            name="saving_pattern"
            as="IonText"
            class="error-message"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Saving Amount</IonLabel>
          <Field name="saving_amount" as="IonInput" type="number" />
          <ErrorMessage
            name="saving_amount"
            as="IonText"
            class="error-message"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Credit Pattern</IonLabel>
          <Field name="credit_pattern" as="IonSelect" interface="popover">
            <IonSelectOption value="1">Weekly</IonSelectOption>
            <IonSelectOption value="2">Daily</IonSelectOption>
            <IonSelectOption value="3">Monthly</IonSelectOption>
          </Field>
          <ErrorMessage
            name="credit_pattern"
            as="IonText"
            class="error-message"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Credit Amount</IonLabel>
          <Field name="credit_amount" as="IonInput" type="number" />
          <ErrorMessage
            name="credit_amount"
            as="IonText"
            class="error-message"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Members Count</IonLabel>
          <Field name="members_count" as="IonInput" type="number" />
          <ErrorMessage
            name="members_count"
            as="IonText"
            class="error-message"
          />
        </IonItem>
      </IonList>
      <IonButton expand="block" :disabled="isSubmitting" @click="submit">
        <template v-if="isSubmitting">Creating...</template>
        <template v-else>Create Iqub</template>
      </IonButton>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.error-message {
  color: var(--ion-color-danger);
  font-size: 0.8em;
}
</style>
