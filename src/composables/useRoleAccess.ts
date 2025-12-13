// src/composables/useRoleAccess.ts
import { computed } from "vue";
import { useStore } from "vuex";
import { User } from "@/types";

/**
 * Composable for role-based access control
 * Provides utilities to check user permissions and role
 */
export function useRoleAccess() {
  const store = useStore();

  // Get current user from Vuex store
  const user = computed<User | null>(() => store.getters["auth/getUser"]);

  // Get current user role
  const currentRole = computed<string | null>(() => user.value?.role || null);

  // Check if user is logged in
  const isAuthenticated = computed<boolean>(
    () => store.getters["auth/isLoggedIn"]
  );

  // Convenience computed properties
  const isCollector = computed<boolean>(
    () => currentRole.value === "collector"
  );
  const isMember = computed<boolean>(() => currentRole.value === "member");

  /**
   * Check if current user has a specific role
   * @param role - Single role or array of roles to check
   * @returns true if user has the role, false otherwise
   */
  function hasRole(role: string | string[]): boolean {
    if (!currentRole.value) return false;

    if (Array.isArray(role)) {
      return role.includes(currentRole.value);
    }

    return currentRole.value === role;
  }

  /**
   * Check if current user can access a resource requiring specific roles
   * @param requiredRoles - Array of roles that can access the resource
   * @returns true if user can access, false otherwise
   */
  function canAccess(requiredRoles: string[]): boolean {
    if (!isAuthenticated.value) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;

    return hasRole(requiredRoles);
  }

  /**
   * Get role-specific route
   * @param basePath - Base path without role prefix
   * @returns Full path with role prefix
   */
  function getRoleRoute(basePath: string): string {
    if (!currentRole.value) return basePath;
    return `/${currentRole.value}${basePath}`;
  }

  /**
   * Get dashboard route for current user role
   * @returns Dashboard route based on role
   */
  const dashboardRoute = computed<string>(() => {
    if (isCollector.value) return "/collector/dashboard";
    if (isMember.value) return "/member/dashboard";
    return "/";
  });

  /**
   * Get profile route for current user role
   * @returns Profile route based on role
   */
  const profileRoute = computed<string>(() => {
    if (isCollector.value) return "/collector/profile";
    if (isMember.value) return "/member/profile";
    return "/";
  });

  return {
    // Computed properties
    user,
    currentRole,
    isAuthenticated,
    isCollector,
    isMember,
    dashboardRoute,
    profileRoute,

    // Methods
    hasRole,
    canAccess,
    getRoleRoute,
  };
}
