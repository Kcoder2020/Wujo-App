<template>
  <ion-menu content-id="main-content" menu-id="app-menu">
    <ion-content class="menu-content" :fullscreen="true">
      <!-- Premium Header with Logo and User Profile -->
      <div class="menu-header">
        <div class="header-background"></div>
        <div class="header-content">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-glow"></div>
            <img :src="wujoLogo" alt="Wujo" class="menu-logo" />
          </div>

          <!-- User Profile -->
          <div class="user-profile">
            <div class="avatar-container">
              <div class="avatar-ring"></div>
              <ion-avatar>
                <ion-icon
                  :icon="personCircleOutline"
                  class="avatar-icon"
                ></ion-icon>
              </ion-avatar>
            </div>
            <div class="profile-info">
              <h3 class="user-name">{{ user?.name || "Welcome" }}</h3>
              <div class="role-badge" :class="roleClass">
                <ion-icon :icon="roleIcon" class="role-icon"></ion-icon>
                <span>{{ roleDisplayName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative wave -->
        <svg
          class="header-wave"
          viewBox="0 0 400 30"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C100,10 300,10 400,30 L400,30 L0,30 Z"
            fill="var(--ion-color-white-smoke, #f5f5f5)"
          />
        </svg>
      </div>

      <!-- Menu Items -->
      <div class="menu-items-container">
        <ion-list class="menu-list">
          <template v-for="(item, index) in visibleMenuItems" :key="index">
            <!-- Section Divider -->
            <div v-if="item.divider" class="section-divider">
              <div class="divider-line"></div>
              <span v-if="item.label" class="divider-label">{{
                item.label
              }}</span>
              <div class="divider-line"></div>
            </div>

            <!-- Menu Item -->
            <ion-item
              v-else-if="item.label !== 'Logout'"
              button
              @click="navigateTo(item)"
              :detail="false"
              class="menu-item"
              :class="{ 'active-item': isActiveRoute(item.route) }"
              :style="{ '--animation-delay': `${index * 0.05}s` }"
            >
              <template #start>
                <div class="icon-container">
                  <ion-icon :icon="item.icon" class="menu-icon"></ion-icon>
                </div>
              </template>
              <ion-label class="menu-label">{{ item.label }}</ion-label>
              <template #end>
                <ion-badge
                  v-if="item.badge && item.badge() > 0"
                  class="notification-badge"
                >
                  {{ item.badge() > 99 ? "99+" : item.badge() }}
                </ion-badge>
                <ion-icon
                  v-else
                  :icon="chevronForwardOutline"
                  class="chevron-icon"
                ></ion-icon>
              </template>
            </ion-item>
          </template>
        </ion-list>

        <!-- Logout Button - Special Section -->
        <div class="logout-section">
          <button class="logout-button" @click="handleLogout">
            <ion-icon :icon="logOutOutline" class="logout-icon"></ion-icon>
            <span>Sign Out</span>
          </button>
        </div>

        <!-- App Version -->
        <div class="app-version">
          <span>Wujo v1.0.0</span>
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonAvatar,
  IonBadge,
  menuController,
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
  chevronForwardOutline,
  shieldCheckmarkOutline,
  personOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useRoleAccess, useNotifications } from "@/composables";
import { MenuItemConfig } from "@/types";
import wujoLogo from "@/assets/img/icon2.svg";

const ionRouter = useIonRouter();
const store = useStore();
const route = useRoute();

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
    label: "Account",
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
    icon: personOutline,
    route: null,
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
  let roleSpecificItems: MenuItemConfig[] = [];
  if (isCollector.value) {
    roleSpecificItems = collectorMenuItems;
  } else if (isMember.value) {
    roleSpecificItems = memberMenuItems;
  }

  return [...roleSpecificItems, ...sharedMenuItems];
});

// Check if route is active
const isActiveRoute = (itemRoute: string | null | undefined): boolean => {
  if (!itemRoute) return false;
  return route.path === itemRoute || route.path.startsWith(itemRoute + "/");
};

// Resolve route dynamically
const resolveRoute = (item: MenuItemConfig): string => {
  if (item.route) return item.route;

  if (item.label === "Profile") {
    return profileRoute.value;
  }

  return "/";
};

// Navigate to route
const navigateTo = async (item: MenuItemConfig) => {
  await menuController.close("app-menu");
  const resolvedRoute = resolveRoute(item);
  ionRouter.push(resolvedRoute);
};

// Handle logout
const handleLogout = async () => {
  await menuController.close("app-menu");
  await store.dispatch("auth/logout");
  ionRouter.push("/login");
};

// Get role display name, class, and icon
const roleDisplayName = computed(() => {
  if (isCollector.value) return "Collector";
  if (isMember.value) return "Member";
  return "User";
});

const roleClass = computed(() => {
  if (isCollector.value) return "role-collector";
  if (isMember.value) return "role-member";
  return "role-default";
});

const roleIcon = computed(() => {
  return isCollector.value ? shieldCheckmarkOutline : personOutline;
});
</script>

<style scoped>
/* ===== Menu Content ===== */
.menu-content {
  --background: var(--ion-color-white-smoke, #f5f5f5);
}

/* ===== Premium Header ===== */
.menu-header {
  position: relative;
  padding-bottom: 20px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 20px;
  background: linear-gradient(
    135deg,
    var(--ion-color-dark-green, #014023) 0%,
    #012d19 60%,
    #011a0f 100%
  );
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 24px 20px 32px;
  padding-top: calc(24px + var(--ion-safe-area-top, 0px));
}

/* Logo Section */
.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.logo-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    rgba(95, 217, 172, 0.3) 0%,
    rgba(95, 217, 172, 0) 70%
  );
  border-radius: 50%;
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

.menu-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  position: relative;
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--ion-color-medium-aquamarine, #5fd9ac);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.user-profile ion-avatar {
  width: 52px;
  height: 52px;
  background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.2) 0%,
    rgba(95, 217, 172, 0.1) 100%
  );
}

.avatar-icon {
  font-size: 52px;
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.profile-info {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.role-collector {
  background: linear-gradient(
    135deg,
    var(--ion-color-medium-aquamarine, #5fd9ac) 0%,
    #4bc99a 100%
  );
  color: var(--ion-color-dark-green, #014023);
  box-shadow: 0 4px 12px rgba(95, 217, 172, 0.4);
}

.role-badge.role-member {
  background: linear-gradient(135deg, #6c8eff 0%, #5a7de8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 142, 255, 0.4);
}

.role-badge.role-default {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.role-icon {
  font-size: 14px;
}

/* Header Wave */
.header-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  z-index: 1;
}

/* ===== Menu Items Container ===== */
.menu-items-container {
  padding: 8px 16px 24px;
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 220px);
}

.menu-list {
  background: transparent;
  padding: 0;
  flex: 1;
}

/* Section Divider */
.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 12px;
  padding: 0 4px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(1, 64, 35, 0.15) 50%,
    transparent 100%
  );
}

.divider-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--ion-color-medium, #92949c);
}

/* Menu Item */
.menu-item {
  --background: white;
  --padding-start: 16px;
  --padding-end: 12px;
  --inner-padding-end: 0;
  --min-height: 56px;
  --border-radius: 14px;
  margin-bottom: 8px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.4s ease-out backwards;
  animation-delay: var(--animation-delay, 0s);
}

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

.menu-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-item.active-item {
  --background: linear-gradient(
    135deg,
    rgba(95, 217, 172, 0.15) 0%,
    rgba(95, 217, 172, 0.08) 100%
  );
  border-left: 3px solid var(--ion-color-medium-aquamarine, #5fd9ac);
}

.menu-item.active-item .menu-icon {
  color: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.menu-item.active-item .menu-label {
  color: var(--ion-color-dark-green, #014023);
  font-weight: 700;
}

/* Icon Container */
.icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-white-smoke, #f5f5f5);
  border-radius: 12px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.menu-item:hover .icon-container {
  background: rgba(95, 217, 172, 0.15);
}

.menu-item.active-item .icon-container {
  background: rgba(95, 217, 172, 0.2);
}

.menu-icon {
  font-size: 22px;
  color: var(--ion-color-dark-green, #014023);
  transition: color 0.3s ease;
}

.menu-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--ion-color-dark-green, #014023);
}

.chevron-icon {
  font-size: 18px;
  color: var(--ion-color-medium, #92949c);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.menu-item:hover .chevron-icon {
  opacity: 1;
  transform: translateX(4px);
}

/* Notification Badge */
.notification-badge {
  --background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  --color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* ===== Logout Section ===== */
.logout-section {
  margin-top: auto;
  padding-top: 16px;
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: transparent;
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 14px;
  color: #ef4444;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.logout-button:active {
  transform: scale(0.98);
}

.logout-icon {
  font-size: 20px;
}

/* ===== App Version ===== */
.app-version {
  text-align: center;
  padding: 16px 0 8px;
}

.app-version span {
  font-size: 11px;
  color: var(--ion-color-medium, #92949c);
  letter-spacing: 0.5px;
}

/* ===== Responsive ===== */
@media (max-height: 667px) {
  .header-content {
    padding: 16px 16px 24px;
  }

  .menu-logo {
    width: 48px;
    height: 48px;
  }

  .user-profile ion-avatar {
    width: 44px;
    height: 44px;
  }

  .avatar-icon {
    font-size: 44px;
  }

  .user-name {
    font-size: 16px;
  }

  .menu-item {
    --min-height: 52px;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .logo-glow,
  .menu-logo,
  .avatar-ring,
  .notification-badge {
    animation: none;
  }

  .menu-item {
    animation: none;
  }

  .menu-item,
  .logout-button,
  .chevron-icon {
    transition: none;
  }
}
</style>
