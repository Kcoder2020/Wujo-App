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
      <!-- Pull to Refresh -->
      <template #fixed>
        <ion-refresher @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
      </template>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Loading notifications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
        <p>{{ error }}</p>
      </div>

      <!-- Notification List -->
      <ion-list v-else-if="sortedNotifications.length > 0">
        <ion-item
          v-for="notification in sortedNotifications"
          :key="notification.id"
          @click="goToNotificationDetail(notification)"
          button
          lines="full"
          :class="{ 'notification-unread': !notification.read }"
        >
          <template #start>
            <ion-icon
              :icon="getIcon(notification.type)"
              :color="getPriorityColor(notification.priority)"
            ></ion-icon>
          </template>
          <ion-label>
            <h2>{{ notification.title }}</h2>
            <p>{{ notification.message }}</p>
            <p class="timestamp">
              {{ formatTimestamp(notification.timestamp) }}
            </p>
          </ion-label>
          <template #end>
            <div class="notification-end">
              <ion-badge
                v-if="
                  notification.priority === 'urgent' ||
                  notification.priority === 'high'
                "
                :color="getPriorityColor(notification.priority)"
                class="priority-badge"
              >
                {{ notification.priority }}
              </ion-badge>
              <ion-icon :icon="chevronForwardOutline" color="medium"></ion-icon>
            </div>
          </template>
        </ion-item>
      </ion-list>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <ion-icon :icon="notificationsOffOutline" class="empty-icon"></ion-icon>
        <ion-text>
          <h3>{{ getEmptyStateMessage().title }}</h3>
          <p>{{ getEmptyStateMessage().message }}</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
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
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonRouter,
} from "@ionic/vue";
import {
  cashOutline,
  notificationsOffOutline,
  alertCircleOutline,
  trophyOutline,
  timeOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import { useNotifications } from "@/composables";
import { useRoleAccess } from "@/composables/useRoleAccess";
import { Notification, NotificationType } from "@/types";

const ionRouter = useIonRouter();
const { currentRole } = useRoleAccess();

// Use the notifications composable
const {
  sortedNotifications,
  isLoading,
  error,
  fetchNotifications,
  markAsRead,
} = useNotifications();

// Fetch notifications on mount
onMounted(() => {
  fetchNotifications();
});

// Get icon based on notification type
const getIcon = (type: NotificationType) => {
  const iconMap: Record<NotificationType, string> = {
    payment_verification: cashOutline,
    payment_reminder: timeOutline,
    payment_confirmed: checkmarkCircleOutline,
    lottery_scheduled: alertCircleOutline,
    lottery_win: trophyOutline,
    member_join_request: informationCircleOutline,
    iqub_invitation: informationCircleOutline,
    iqub_milestone: trophyOutline,
    system_update: informationCircleOutline,
    account_security: alertCircleOutline,
    general: informationCircleOutline,
  };

  return iconMap[type] || notificationsOffOutline;
};

// Get color based on notification priority
const getPriorityColor = (priority: Notification["priority"]) => {
  const colorMap = {
    urgent: "danger",
    high: "warning",
    medium: "primary",
    low: "medium",
  };
  return colorMap[priority];
};

// Navigate to notification detail
const goToNotificationDetail = async (notification: Notification) => {
  // Mark as read
  await markAsRead(notification.id);

  // Navigate if actionUrl exists
  if (notification.actionUrl) {
    ionRouter.push(notification.actionUrl);
  }
};

// Handle pull-to-refresh
const handleRefresh = async (event: CustomEvent) => {
  await fetchNotifications();
  (event.target as any)?.complete();
};

// Get empty state message based on role
const getEmptyStateMessage = () => {
  if (currentRole.value === "collector") {
    return {
      title: "No Notifications",
      message: "You'll see payment verifications and Iqub updates here",
    };
  } else if (currentRole.value === "member") {
    return {
      title: "No Notifications",
      message: "You'll see payment reminders and Iqub invitations here",
    };
  } else {
    return {
      title: "No Notifications",
      message: "You're all caught up!",
    };
  }
};

// Format timestamp to human-readable string
const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  // For older notifications, return formatted date
  return notificationDate.toLocaleDateString();
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: var(--ion-color-wujo-text-grey);
}

.loading-state p {
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: var(--ion-color-danger);
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Notification Item */
.notification-unread {
  --background: white;
  border-left: 4px solid var(--ion-color-medium-aquamarine);
}

.notification-unread ion-label h2 {
  font-weight: 700;
  color: var(--ion-color-dark-green);
}

ion-item {
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

ion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ion-label h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 4px;
}

ion-label p {
  font-size: 0.9rem;
  color: var(--ion-color-wujo-text-grey);
  white-space: normal;
  line-height: 1.4;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
  margin-top: 8px;
  font-style: italic;
}

/* Notification End Slot */
.notification-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.priority-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  text-align: center;
  color: var(--ion-color-wujo-text-grey);
  padding: 2rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ion-color-wujo-dark-grey);
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  line-height: 1.5;
  max-width: 300px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

ion-item {
  animation: fadeIn 0.3s ease-out;
}

/* Pull to Refresh Customization */
ion-refresher {
  --color: var(--ion-color-medium-aquamarine);
}
</style>
