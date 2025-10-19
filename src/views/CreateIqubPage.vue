<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Custom Top Bar -->
      <div class="top-bar">
        <ion-icon
          :icon="menuOutline"
          class="menu-icon"
          @click="openMenu"
        ></ion-icon>
        <ion-text class="page-title">HI Collector</ion-text>
        <div class="notification-container" @click="goToNotifications">
          <ion-icon
            :icon="notificationsOutline"
            class="notification-icon"
          ></ion-icon>
          <ion-badge color="danger" class="notification-badge">3</ion-badge>
        </div>
      </div>

      <!-- Collector Tab Bar -->
      <collector-tab-bar active-tab="create-iqub"></collector-tab-bar>

      <!-- Main Form Content Area -->
      <div class="form-content">
        <ion-text class="page-heading"><h2>Create Iqub</h2></ion-text>

        <form @submit.prevent="submit" class="create-iqub-form">
          <!-- Iqub Name -->
          <div class="form-group">
            <ion-label>Iqub Name</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="name" v-slot="{ field }">
                <ion-input
                  v-bind="field"
                  type="text"
                  placeholder="e.g., Nimani Family Iqub"
                ></ion-input>
              </Field>
            </ion-item>
            <ErrorMessage name="name" as="div" class="error-message" />
          </div>

          <!-- Saving Amount -->
          <div class="form-group">
            <ion-label>Saving Amount</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="saving_amount" v-slot="{ field }">
                <ion-input
                  v-bind="field"
                  type="number"
                  placeholder="e.g., 500"
                ></ion-input>
              </Field>
            </ion-item>
            <ErrorMessage name="saving_amount" as="div" class="error-message" />
          </div>

          <!-- Saving Pattern -->
          <div class="form-group">
            <ion-label>Saving Pattern</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="saving_pattern" v-slot="{ field }">
                <ion-select
                  v-bind="field"
                  interface="action-sheet"
                  placeholder="Select Pattern"
                >
                  <ion-select-option value="1">Weekly</ion-select-option>
                  <ion-select-option value="2">Daily</ion-select-option>
                  <ion-select-option value="3">Monthly</ion-select-option>
                </ion-select>
              </Field>
            </ion-item>
            <ErrorMessage
              name="saving_pattern"
              as="div"
              class="error-message"
            />
          </div>

          <!-- Credit Amount -->
          <div class="form-group">
            <ion-label>Credit Amount</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="credit_amount" v-slot="{ field }">
                <ion-input
                  v-bind="field"
                  type="number"
                  placeholder="e.g., 10000"
                ></ion-input>
              </Field>
            </ion-item>
            <ErrorMessage name="credit_amount" as="div" class="error-message" />
          </div>

          <!-- Credit Pattern -->
          <div class="form-group">
            <ion-label>Credit Pattern</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="credit_pattern" v-slot="{ field }">
                <ion-select
                  v-bind="field"
                  interface="action-sheet"
                  placeholder="Select Pattern"
                >
                  <ion-select-option value="1">Weekly</ion-select-option>
                  <ion-select-option value="2">Daily</ion-select-option>
                  <ion-select-option value="3">Monthly</ion-select-option>
                </ion-select>
              </Field>
            </ion-item>
            <ErrorMessage
              name="credit_pattern"
              as="div"
              class="error-message"
            />
          </div>

          <!-- Members Count -->
          <div class="form-group">
            <ion-label>Number of Members</ion-label>
            <ion-item class="form-field" lines="none">
              <Field name="members_count" v-slot="{ field }">
                <ion-input
                  v-bind="field"
                  type="number"
                  placeholder="e.g., 20"
                ></ion-input>
              </Field>
            </ion-item>
            <ErrorMessage name="members_count" as="div" class="error-message" />
          </div>

          <!-- Confirm Button -->
          <ion-button
            expand="block"
            type="submit"
            class="primary-confirm-button"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Confirm</span>
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToast,
  IonIcon,
  IonBadge,
  menuController,
  useIonRouter,
  createAnimation,
  IonList,
  IonItem,
} from "@ionic/vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, number } from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import { useStore } from "vuex";
import { menuOutline, notificationsOutline } from "ionicons/icons";
import CollectorTabBar from "@/components/CollectorTabBar.vue";

const store = useStore();
const ionRouter = useIonRouter();

// --- Animation Builders ---
const noAnimation = () => createAnimation();

const slideInFromRightAnimation = (baseEl: HTMLElement, opts: any) => {
  const rootAnimation = createAnimation()
    .addElement(opts.enteringEl)
    .duration(300)
    .easing("ease-in-out");
  const enteringAnimation = createAnimation()
    .addElement(opts.enteringEl)
    .fromTo("transform", "translateX(100%)", "translateX(0)");
  const leavingAnimation = createAnimation()
    .addElement(opts.leavingEl)
    .fromTo("opacity", "1", "0.5");
  rootAnimation.addAnimation([enteringAnimation, leavingAnimation]);
  return rootAnimation;
};

// --- Validation & Form Handling ---
const validationSchema = toTypedSchema(
  object({
    name: string().required("Name is required"),
    saving_pattern: string().required("Saving Pattern is required"),
    saving_amount: number()
      .required("Saving Amount is required")
      .positive()
      .typeError("Must be a valid number"),
    credit_pattern: string().required("Credit Pattern is required"),
    credit_amount: number()
      .required("Credit Amount is required")
      .positive()
      .typeError("Must be a valid number"),
    members_count: number()
      .required("Members Count is required")
      .positive()
      .integer()
      .min(2)
      .typeError("Must be a valid number"),
  })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
  initialValues: { saving_pattern: "1", credit_pattern: "1" },
});

const submit = handleSubmit(async (values) => {
  try {
    const data = {
      ...values,
      credit_amount: String(values.credit_amount),
      credit_pattern: Number(values.credit_pattern),
      members_count: String(values.members_count),
      saving_amount: String(values.saving_amount),
      saving_pattern: Number(values.saving_pattern),
    };
    await store.dispatch("iqubs/createIqub", data);
    const toast = await IonToast.create({
      message: "Iqub created successfully!",
      duration: 2000,
      position: "top",
      color: "success",
    });
    await toast.present();
    ionRouter.push("/collector/my-iqubs", "forward", noAnimation);
  } catch (error: any) {
    const toast = await IonToast.create({
      message: error.response?.data?.message || "Failed to create Iqub.",
      duration: 3000,
      position: "top",
      color: "danger",
    });
    await toast.present();
  }
});

// --- Event Handlers ---
const openMenu = () => menuController.open("app-menu");
const goToNotifications = () =>
  ionRouter.push("/notifications", "forward", slideInFromRightAnimation);
</script>

<style scoped>
/* Using brand colors from your design system */
:root {
  --ion-color-wujo-primary: #006a52;
  --ion-color-wujo-light-grey: #f0f2f5;
  --ion-color-wujo-text-grey: #555;
  --ion-color-wujo-dark-grey: #333;
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
}

/* --- Top Bar & Tab Bar --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--ion-color-wujo-primary);
  color: white;
}
.menu-icon,
.notification-icon {
  font-size: 24px;
  cursor: pointer;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
}
.notification-container {
  position: relative;
  cursor: pointer;
}
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
}
collector-tab-bar {
  display: block;
  margin-bottom: 1rem;
}

/* --- Form UX/UI Overhaul --- */
.form-content {
  padding: 0 1rem 1rem;
}

.page-heading {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group ion-label {
  display: block;
  color: var(--ion-color-wujo-text-grey);
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

ion-list {
  background: transparent;
  padding: 0;
}

.form-field {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* ACTIVE STATE: This is the key for better UX */
.form-field.ion-focused {
  border-color: var(--ion-color-wujo-primary);
  box-shadow: 0 0 0 2px rgba(0, 106, 82, 0.2);
}

.form-field ion-input,
.form-field ion-select {
  --padding-start: 12px;
  font-size: 1rem;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 0.8rem;
  padding-left: 4px;
  margin-top: 4px;
}

.primary-confirm-button {
  --background: var(--ion-color-wujo-primary);
  --border-radius: 12px;
  font-weight: bold;
  text-transform: none;
  height: 50px;
  margin-top: 1.5rem;
}
</style>
