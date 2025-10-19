<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="wujo-primary">
        <ion-buttons>
          <ion-back-button
            default-href="/collector/dashboard"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Notifications</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list v-if="notifications.length > 0">
        <ion-item
          v-for="notification in notifications"
          :key="notification.id"
          @click="goToNotificationDetail(notification)"
          button
          lines="full"
          :class="{ 'notification-unread': !notification.read }"
        >
          <ion-icon
            :icon="getIcon(notification.type)"
            color="wujo-primary"
          ></ion-icon>
          <ion-label>
            <h2>{{ notification.title }}</h2>
            <p>{{ notification.message }}</p>
            <p class="timestamp">{{ notification.timestamp }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="empty-state">
        <ion-icon :icon="notificationsOffOutline" class="empty-icon"></ion-icon>
        <ion-text>
          <h3>No Notifications</h3>
          <p>You're all caught up!</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonText,
  useIonRouter,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { cashOutline, notificationsOffOutline } from "ionicons/icons";

// Define a type for our notification object
interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "payment_verification" | "general";
  detailsLink?: string; // The route to navigate to
}

const router = useRouter();
const ionRouter = useIonRouter(); // 2. Get the IonRouter instance

// Placeholder data as requested
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: "Payment Verification Required",
    message:
      "You have received a payment from Abebe Kebede for your Nimani Iqub for round 5.",
    timestamp: "8410 hours ago",
    read: false,
    type: "payment_verification",
    detailsLink: "/collector/payment-verify/123", // Example link
  },
  {
    id: 2,
    title: "Payment Verification Required",
    message: "Proof of payment submitted by John Doe needs verification.",
    timestamp: "8410 hours ago",
    read: true,
    type: "payment_verification",
    detailsLink: "/collector/payment-verify/124", // Example link
  },
]);

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "payment_verification":
      return cashOutline;
    default:
      return notificationsOffOutline;
  }
};

const goToNotificationDetail = (notification: Notification) => {
  if (notification.detailsLink) {
    // Mark as read when clicked (in a real app, you'd update state)
    notification.read = true;
    // router.push(notification.detailsLink);
    ionRouter.push(notification.detailsLink, "forward", "none");
  } else {
    console.log("No detail view for this notification.");
  }
};
</script>

<style scoped>
/* Using brand colors from your design system */
ion-toolbar {
  --background: var(--ion-color-wujo-primary);
  --color: white;
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
}

.notification-unread ion-label h2 {
  font-weight: bold;
  color: var(--ion-color-wujo-dark-grey);
}

ion-label h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
}

ion-label p {
  font-size: 0.9rem;
  color: var(--ion-color-wujo-text-grey);
  white-space: normal;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: var(--ion-color-wujo-text-grey);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
</style>
