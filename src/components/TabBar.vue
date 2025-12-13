<template>
  <div class="wujo-tab-bar">
    <button
      v-for="tab in visibleTabs"
      :key="tab.name"
      class="tab-button"
      :class="{ 'tab-button-active': isActiveTab(tab.name) }"
      @click="handleTabClick(tab)"
    >
      <div class="tab-content">
        <div class="tab-icon-wrapper">
          <ion-icon :icon="tab.icon" class="tab-icon" />
          <span v-if="tab.badge && tab.badge() > 0" class="tab-badge">
            {{ tab.badge() > 99 ? "99+" : tab.badge() }}
          </span>
        </div>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
      <div v-if="isActiveTab(tab.name)" class="active-indicator" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonIcon } from "@ionic/vue";
import { useRoleAccess } from "@/composables";
import { getTabsForRole } from "@/config/tabConfigs";
import { TabItemConfig } from "@/types";

// Get current route and router
const route = useRoute();
const router = useRouter();

// Get user role from composable
const { currentRole } = useRoleAccess();

// Get tabs for current role
const visibleTabs = computed<TabItemConfig[]>(() => {
  return getTabsForRole(currentRole.value as UserRole | null);
});

/**
 * Check if a tab is currently active based on route path
 * Uses smart matching to highlight tabs even on child routes
 */
const isActiveTab = (tabName: string): boolean => {
  const currentPath = route.path;

  switch (tabName) {
    case "dashboard":
      // Exact match for dashboard (both collector and member)
      return currentPath.endsWith("/dashboard");

    case "my-iqubs":
    case "iqub-book":
      // Match /my-iqubs and any iqub detail pages
      return (
        currentPath.includes("/my-iqubs") ||
        currentPath.includes("/iqub/") ||
        currentPath.includes("/iqub-book")
      );

    case "create-iqub":
      return currentPath.includes("/create-iqub");

    case "discover":
      return currentPath.includes("/discover");

    case "profile":
      return currentPath.includes("/profile");

    default:
      return false;
  }
};

/**
 * Handle tab click - navigate to tab route
 * @param tab - Tab configuration object
 */
const handleTabClick = (tab: TabItemConfig) => {
  // Navigate to tab route
  router.push(tab.route);
};
</script>

<style scoped>
/* Tab Bar Container - Following Wujo UI/UX Guidelines */
.wujo-tab-bar {
  /* Fixed positioning at bottom (thumb zone) */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  /* Layout */
  display: flex;
  gap: 8px;
  padding: 8px 12px;

  /* Wujo brand colors */
  background: var(--ion-color-white-smoke, #f2f2f2);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  /* Safe area for iPhone notch/home indicator */
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

/* Tab Button */
.tab-button {
  /* Flexbox layout */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Styling */
  background: transparent;
  border: none;
  border-radius: 12px;
  height: 56px;
  /* Wujo standard touch target */
  cursor: pointer;
  position: relative;

  /* Smooth transitions - Wujo timing function */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px;

  /* Remove tap highlight on mobile */
  -webkit-tap-highlight-color: transparent;
}

/* Active (pressed) state - scale animation */
.tab-button:active {
  transform: scale(0.95);
}

/* Tab Content Container */
.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 1;
}

/* Icon Wrapper (for badge positioning) */
.tab-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tab Icon */
.tab-icon {
  font-size: 24px;
  color: var(--ion-color-dark-green, #014023);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tab Label */
.tab-label {
  font-size: 12px;
  /* Caption size from Wujo guidelines */
  font-weight: 400;
  /* Regular weight */
  line-height: 1.2;
  color: var(--ion-color-dark-green, #014023);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

/* Active Tab Styling - Wujo aquamarine */
.tab-button-active {
  background: var(--ion-color-medium-aquamarine, #5fd9ac);
}

.tab-button-active .tab-icon {
  color: var(--ion-color-dark-green, #014023);
}

.tab-button-active .tab-label {
  color: var(--ion-color-dark-green, #014023);
  font-weight: 600;
  /* SemiBold for active state */
}

/* Active Indicator (underline) */
.active-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: var(--ion-color-dark-green, #014023);
  border-radius: 2px 2px 0 0;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide in animation for active indicator */
@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    width: 32px;
    opacity: 1;
  }
}

/* Badge Notification Styling */
.tab-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--ion-color-danger, #eb445a);
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* Hover effect for desktop */
@media (hover: hover) {
  .tab-button:hover:not(.tab-button-active) {
    background: rgba(95, 217, 172, 0.1);
    /* Light aquamarine hover */
  }
}

/* Responsive adjustments for small screens */
@media (max-height: 667px) {
  .tab-icon {
    font-size: 22px;
  }

  .tab-label {
    font-size: 11px;
  }

  .wujo-tab-bar {
    padding: 6px 10px;
  }

  .tab-button {
    height: 52px;
  }
}
</style>
