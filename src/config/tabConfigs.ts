// src/config/tabConfigs.ts
import {
  gridOutline,
  walletOutline,
  addCircleOutline,
  personOutline,
  homeOutline,
  bookOutline,
  searchOutline,
} from "ionicons/icons";
import { TabItemConfig, UserRole } from "@/types";

// Collector Tab Configuration
const collectorTabs: TabItemConfig[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: gridOutline,
    route: "/collector/dashboard",
    roles: ["collector"],
  },
  {
    name: "my-iqubs",
    label: "My Iqubs",
    icon: walletOutline,
    route: "/collector/my-iqubs",
    roles: ["collector"],
  },
  {
    name: "create-iqub",
    label: "Create",
    icon: addCircleOutline,
    route: "/collector/create-iqub",
    roles: ["collector"],
  },
  {
    name: "profile",
    label: "Profile",
    icon: personOutline,
    route: "/collector/profile",
    roles: ["collector"],
  },
];

// Member Tab Configuration
const memberTabs: TabItemConfig[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: homeOutline,
    route: "/member/dashboard",
    roles: ["member"],
  },
  {
    name: "iqub-book",
    label: "IqubBook",
    icon: bookOutline,
    route: "/member/my-iqubs",
    roles: ["member"],
  },
  {
    name: "discover",
    label: "Discover",
    icon: searchOutline,
    route: "/member/discover",
    roles: ["member"],
  },
  {
    name: "profile",
    label: "Profile",
    icon: personOutline,
    route: "/member/profile",
    roles: ["member"],
    // Optional: Add notification badge to profile tab
    // badge: () => {
    //   const { unreadCount } = useNotifications();
    //   return unreadCount.value;
    // },
  },
];

// Tab configuration map
const tabConfigurations: Record<UserRole, TabItemConfig[]> = {
  collector: collectorTabs,
  member: memberTabs,
};

/**
 * Get tabs for a specific user role
 * @param role - User role (collector or member)
 * @returns Array of tab configurations for the specified role
 */
export function getTabsForRole(role: UserRole | null): TabItemConfig[] {
  if (!role) return [];
  return tabConfigurations[role] || [];
}

/**
 * Get all available tab configurations
 * @returns Record of all tab configurations by role
 */
export function getAllTabConfigs(): Record<UserRole, TabItemConfig[]> {
  return tabConfigurations;
}
