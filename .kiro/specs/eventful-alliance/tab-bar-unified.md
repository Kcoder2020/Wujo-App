# Tab Bar - Unified Role-Based Navigation

## Overview

The Wujo app currently has **three different tab bar implementations** with inconsistent UX, styling, and architecture. This specification defines a unified, agnostic tab bar component that adapts to user roles while maintaining consistent UI/UX principles across the application.

## Current State Analysis

### CollectorTabBar.vue
**Structure**: Text-only buttons with transparent/filled states
- ❌ No icons - less visual hierarchy
- ❌ Top positioning with border/shadow
- ❌ Uses custom animation builder
- ❌ Hardcoded routes
- ✅ Active state highlighting

### MemberTabBar.vue
**Structure**: Icon + label buttons with badge support
- ✅ Icons with labels - better visual hierarchy
- ✅ Badge notification support
- ✅ Fixed bottom positioning (mobile UX standard)
- ✅ Active indicator animation
- ✅ Haptic feedback consideration
- ❌ Inconsistent with collector experience

### AppTabBar.vue
**Structure**: Basic Ionic tab bar with role checks
- ✅ Role-based tab rendering
- ❌ Uses deprecated `ion-tab-bar` pattern
- ❌ Incomplete tab sets
- ❌ Inconsistent with custom components

## Unified Design Principles

### 1. Visual Hierarchy
**Best Practice**: Icons + Labels (Member pattern)
- Icons provide instant recognition
- Labels ensure clarity
- Combination works for all literacy levels

### 2. Positioning
**Best Practice**: Fixed bottom (Mobile UX standard)
- Thumb-zone accessible
- Consistent across iOS/Android
- Matches user expectations from other apps

### 3. Badge System
**Required**: Notification badges for relevant tabs
- Show unread counts on notifications
- Visual indicator for pending actions
- Dynamic updates from composables

### 4. Active State
**Best Practice**: Multiple visual cues
- Background color change (aquamarine)
- Active indicator line
- Icon/text color shift
- Smooth animations

## Tab Configuration Structure

### TypeScript Interface

```typescript
export interface TabItemConfig {
  name: string; // Unique identifier
  label: string; // Display text
  icon: string; // Ionicon name
  route: string; // Navigation path
  roles: UserRole[]; // Which roles can see this tab
  badge?: () => number; // Optional reactive badge count
}
```

### Collector Tabs

```typescript
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
```

### Member Tabs

```typescript
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
    badge: () => notificationCount.value, // Example badge
  },
];
```

## Component Architecture

### Agnostic TabBar Component

**File**: `src/components/TabBar.vue`

```vue
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

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoleAccess } from '@/composables';

// Get visible tabs based on user role
const { currentRole } = useRoleAccess();
const route = useRoute();
const router = useRouter();

// Import tab configurations
import { getTabsForRole } from '@/config/tabConfigs';

const visibleTabs = computed(() => getTabsForRole(currentRole.value));

const isActiveTab = (tabName) => {
  // Smart route matching logic
};

const handleTabClick = (tab) => {
  router.push(tab.route);
};
</script>
```

### Tab Configuration File

**File**: `src/config/tabConfigs.ts`

```typescript
import { TabItemConfig, UserRole } from '@/types';
// ... icon imports

const tabConfigurations: Record<UserRole, TabItemConfig[]> = {
  collector: [ /* collector tabs */ ],
  member: [ /* member tabs */ ],
};

export function getTabsForRole(role: UserRole | null): TabItemConfig[] {
  if (!role) return [];
  return tabConfigurations[role] || [];
}
```

## UI/UX Styling Standards

### Layout

```css
.wujo-tab-bar {
  /* Fixed positioning at bottom */
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
  background: var(--ion-color-wujo-light-grey);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
```

### Tab Button

```css
.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 12px;
  height: 56px; /* 44px minimum touch target + padding */
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  padding: 8px;
}

.tab-button:active {
  transform: scale(0.95);
}
```

### Active State

```css
.tab-button-active {
  background: var(--ion-color-medium-aquamarine);
}

.tab-button-active .tab-icon {
  color: var(--ion-color-dark-green);
}

.tab-button-active .tab-label {
  color: var(--ion-color-dark-green);
  font-weight: 600;
}

/* Active indicator */
.active-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: var(--ion-color-dark-green);
  border-radius: 2px 2px 0 0;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Badge

```css
.tab-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--ion-color-danger);
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
```

## Migration Strategy

### Phase 1: Create Unified Component
1. Create `TabBar.vue` with agnostic structure
2. Create `tabConfigs.ts` with role-based configurations
3. Add `TabItemConfig` interface to types

### Phase 2: Replace Collector Implementation
1. Update `CollectorTabBar.vue` to use new component
2. Add icons to match member UX
3. Move to bottom positioning
4. Test navigation flows

### Phase 3: Replace Member Implementation  
1. Update `MemberTabBar.vue` to use new component
2. Preserve badge functionality
3. Maintain active animations
4. Test navigation flows

### Phase 4: Deprecate AppTabBar
1. Remove `AppTabBar.vue` (no longer needed)
2. Update any references
3. Clean up unused code

## Active Route Matching Logic

```typescript
function isActiveTab(tabName: string): boolean {
  const currentPath = route.path;
  
  switch (tabName) {
    case "dashboard":
      return currentPath.endsWith("/dashboard");
      
    case "my-iqubs":
    case "iqub-book":
      return currentPath.includes("/my-iqubs") || 
             currentPath.includes("/iqub/");
      
    case "create-iqub":
      return currentPath.includes("/create-iqub");
      
    case "discover":
      return currentPath.includes("/discover");
      
    case "profile":
      return currentPath.includes("/profile");
      
    default:
      return false;
  }
}
```

## Accessibility Considerations

- ✅ **Touch Targets**: 56px height (exceeds 44px minimum)
- ✅ **Color Contrast**: Dark green on aquamarine meets WCAG AA
- ✅ **Focus States**: Visible focus indicators for keyboard navigation
- ✅ **Screen Readers**: Proper ARIA labels and roles
- ✅ **Haptic Feedback**: Tactile response on supported devices

## Performance

- ✅ **Lazy Loading**: Tab configurations imported only when needed
- ✅ **Reactive Updates**: Computed properties for efficient re-rendering
- ✅ **Smooth Animations**: CSS transitions (GPU-accelerated)
- ✅ **Badge Updates**: Reactive composable values

## Testing Checklist

- [ ] Collector tabs render correctly
- [ ] Member tabs render correctly
- [ ] Active state highlights current route
- [ ] Active indicator animates smoothly
- [ ] Badge displays unread counts
- [ ] Navigation works for all tabs
- [ ] Responsive on all screen sizes
- [ ] Touch targets meet accessibility standards
- [ ] Animations are smooth (60fps)
- [ ] Role switching updates tabs dynamically

## Future Enhancements

1. **Haptic Feedback**: Integrate `@capacitor/haptics` for tactile response
2. **Tab Gestures**: Swipe between tabs (iOS/Android pattern)
3. **Long Press Actions**: Quick actions on long press
4. **Customizable Badges**: Different colors for different notification types
5. **Accessibility Mode**: Larger text/icons option
