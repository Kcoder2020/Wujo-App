<template>
  <ion-menu content-id="main-content" menu-id="app-menu">
    <ion-header>
      <ion-toolbar :color="isIos ? 'wujo-primary' : 'wujo-primary'">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- User Profile Section -->
      <div class="menu-profile">
        <ion-avatar>
          <ion-icon :icon="personCircleOutline" class="avatar-icon"></ion-icon>
        </ion-avatar>
        <div class="profile-info">
          <h4>{{ user?.name || "User" }}</h4>
          <ion-chip :color="roleColor">
            <ion-label>{{ roleDisplayName }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Menu Items -->
      <ion-list>
        <template v-for="(item, index) in visibleMenuItems" :key="index">
          <!-- Divider -->
          <div v-if="item.divider" class="menu-divider"></div>

          <!-- Menu Item -->
          <ion-item
            v-else-if="item.label !== 'Logout'"
            button
            @click="navigateTo(item)"
            :detail="false"
          >
            <template #start>
              <ion-icon :icon="item.icon"></ion-icon>
            </template>
            <ion-label>{{ item.label }}</ion-label>
            <template #end>
              <ion-badge v-if="item.badge && item.badge() > 0" color="danger">
                {{ item.badge() }}
              </ion-badge>
            </template>
          </ion-item>
        </template>

        <!-- Logout (special handling) -->
        <ion-item
          button
          @click="handleLogout"
          :detail="false"
          class="logout-item"
        >
          <template #start>
            <ion-icon :icon="logOutOutline"></ion-icon>
          </template>
          <ion-label>Logout</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
  IonAvatar,
  IonChip,
  IonBadge,
  menuController,
  isPlatform,
  useIonRouter,
} from "@ionic/vue";
import {
  personCircleOutline,
  settingsOutline,
  logOutOutline,
  notificationsOutline,
  gridOutline,
  walletOutline,
  addCircleOutline,
  homeOutline,
  peopleOutline,
  compassOutline,
  enterOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import { useRoleAccess, useNotifications } from "@/composables";
import { MenuItemConfig } from "@/types";

const ionRouter = useIonRouter();
const store = useStore();
const isIos = isPlatform("ios");

// Use composables
const { isCollector, isMember, user, profileRoute } = useRoleAccess();
const { unreadCount } = useNotifications();

// Collector menu items
const collectorMenuItems: MenuItemConfig[] = [
  {
    label: "Dashboard",
    icon: gridOutline,
    route: "/collector/dashboard",
    roles: ["collector"],
  },
  {
    label: "My Iqubs",
    icon: walletOutline,
    route: "/collector/my-iqubs",
    roles: ["collector"],
  },
  {
    label: "Create Iqub",
    icon: addCircleOutline,
    route: "/collector/create-iqub",
    roles: ["collector"],
  },
];

// Member menu items
const memberMenuItems: MenuItemConfig[] = [
  {
    label: "Dashboard",
    icon: homeOutline,
    route: "/member/dashboard",
    roles: ["member"],
  },
  {
    label: "Joined Iqubs",
    icon: peopleOutline,
    route: "/member/my-iqubs",
    roles: ["member"],
  },
  {
    label: "Discover",
    icon: compassOutline,
    route: "/member/discover",
    roles: ["member"],
  },
  {
    label: "Join Iqub",
    icon: enterOutline,
    route: "/member/join-iqub",
    roles: ["member"],
  },
];

// Shared menu items
const sharedMenuItems: MenuItemConfig[] = [
  {
    divider: true,
  },
  {
    label: "Notifications",
    icon: notificationsOutline,
    route: "/notifications",
    roles: ["collector", "member"],
    badge: () => unreadCount.value,
  },
  {
    label: "Profile",
    icon: personCircleOutline,
    route: null, // Will be resolved dynamically
    roles: ["collector", "member"],
  },
  {
    label: "Settings",
    icon: settingsOutline,
    route: "/settings",
    roles: ["collector", "member"],
  },
];

// Compute visible menu items based on role
const visibleMenuItems = computed<MenuItemConfig[]>(() => {
  const roleSpecificItems = isCollector.value
    ? collectorMenuItems
    : isMember.value
    ? memberMenuItems
    : [];

  return [...roleSpecificItems, ...sharedMenuItems];
});

// Resolve route dynamically
const resolveRoute = (item: MenuItemConfig): string => {
  if (item.route) return item.route;

  // Dynamic routes based on role
  if (item.label === "Profile") {
    return profileRoute.value;
  }

  return "/";
};

// Navigate to route
const navigateTo = async (item: MenuItemConfig) => {
  await menuController.close("app-menu");
  const route = resolveRoute(item);
  ionRouter.push(route);
};

// Handle logout
const handleLogout = async () => {
  await menuController.close("app-menu");
  await store.dispatch("auth/logout");
  ionRouter.push("/login");
};

// Get role display name and color
const roleDisplayName = computed(() => {
  return isCollector.value ? "Collector" : isMember.value ? "Member" : "User";
});

const roleColor = computed(() => {
  return isCollector.value ? "primary" : "secondary";
});
</script>

<style scoped>
ion-toolbar {
  --background: var(--ion-color-dark-green);
  --color: white;
}

ion-content {
  --background: var(--ion-color-wujo-light-grey);
}

/* Profile Section */
.menu-profile {
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green) 0%,
    var(--ion-color-dark-green-shade, #013019) 100%
  );
  padding: 24px 16px;
  margin: -16px -16px 16px -16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-profile ion-avatar {
  width: 56px;
  height: 56px;
  border: 3px solid var(--ion-color-medium-aquamarine);
  background: var(--ion-color-dark-green-tint, #1a5a3a);
}

.avatar-icon {
  font-size: 56px;
  color: var(--ion-color-medium-aquamarine);
}

.profile-info {
  flex: 1;
  color: white;
}

.profile-info h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.profile-info ion-chip {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
  font-weight: 600;
  font-size: 0.75rem;
  height: 24px;
  padding: 0 8px;
}

/* Menu Items */
ion-list {
  background: transparent;
  padding: 0;
}

ion-item {
  --background: white;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --border-radius: 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

ion-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ion-item ion-icon[slot="start"] {
  font-size: 24px;
  margin-right: 16px;
  color: var(--ion-color-dark-green);
}

ion-item ion-label {
  font-weight: 600;
  color: var(--ion-color-wujo-dark-grey);
}

ion-item ion-badge {
  font-weight: 700;
  font-size: 0.75rem;
}

/* Menu Divider */
.menu-divider {
  height: 1px;
  background: var(--ion-color-medium-aquamarine);
  opacity: 0.2;
  margin: 16px 0;
}

/* Logout Item - Special Styling */
.logout-item {
  --background: transparent;
  border: 2px solid var(--ion-color-danger);
  margin-top: 16px;
}

.logout-item ion-icon {
  color: var(--ion-color-danger);
}

.logout-item ion-label {
  color: var(--ion-color-danger);
  font-weight: 700;
}

.logout-item:hover {
  --background: rgba(var(--ion-color-danger-rgb), 0.1);
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

ion-item {
  animation: slideInLeft 0.3s ease-out;
}

/* Responsive Adjustments */
@media (max-height: 667px) {
  .menu-profile {
    padding: 16px;
  }

  .menu-profile ion-avatar {
    width: 48px;
    height: 48px;
  }

  .avatar-icon {
    font-size: 48px;
  }
}
</style>
