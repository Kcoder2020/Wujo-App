# SideMenu - Role-Based Access Control

## Overview

The SideMenu component dynamically renders menu items based on the authenticated user's role. This specification defines the menu structure, permission checking patterns, and visual state management for role-based navigation.

## Menu Structure

### Collector Menu Items

```typescript
const collectorMenuItems: MenuItemConfig[] = [
  {
    label: 'Dashboard',
    icon: 'grid-outline',
    route: '/collector/dashboard',
    roles: ['collector'],
  },
  {
    label: 'My Iqubs',
    icon: 'wallet-outline',
    route: '/collector/my-iqubs',
    roles: ['collector'],
  },
  {
    label: 'Create Iqub',
    icon: 'add-circle-outline',
    route: '/collector/create-iqub',
    roles: ['collector'],
  },
  {
    label: 'Payment Verifications',
    icon: 'checkmark-done-outline',
    route: '/collector/payment-verify',
    roles: ['collector'],
    badge: () => pendingVerificationsCount.value, // Dynamic badge
  },
];
```

### Member Menu Items

```typescript
const memberMenuItems: MenuItemConfig[] = [
  {
    label: 'Dashboard',
    icon: 'home-outline',
    route: '/member/dashboard',
    roles: ['member'],
  },
  {
    label: 'Joined Iqubs',
    icon: 'people-outline',
    route: '/member/my-iqubs',
    roles: ['member'],
  },
  {
    label: 'Discover',
    icon: 'compass-outline',
    route: '/member/discover',
    roles: ['member'],
  },
  {
    label: 'Join Iqub',
    icon: 'enter-outline',
    route: '/member/join-iqub',
    roles: ['member'],
  },
];
```

### Shared Menu Items

```typescript
const sharedMenuItems: MenuItemConfig[] = [
  {
    divider: true, // Visual separator
  },
  {
    label: 'Notifications',
    icon: 'notifications-outline',
    route: '/notifications',
    roles: ['collector', 'member'],
    badge: () => unreadNotificationsCount.value, // Dynamic badge
  },
  {
    label: 'Profile',
    icon: 'person-outline',
    route: null, // Determined by role at runtime
    roles: ['collector', 'member'],
  },
  {
    label: 'Settings',
    icon: 'settings-outline',
    route: '/settings',
    roles: ['collector', 'member'],
  },
  {
    label: 'Logout',
    icon: 'log-out-outline',
    action: 'logout', // Special action instead of route
    roles: ['collector', 'member'],
  },
];
```

## TypeScript Interfaces

```typescript
interface MenuItemConfig {
  label?: string;
  icon?: string;
  route?: string | null;
  roles: UserRole[];
  badge?: () => number; // Reactive badge count function
  action?: string; // For special actions like logout
  divider?: boolean; // For visual separators
}

interface MenuSection {
  title?: string; // Optional section title
  items: MenuItemConfig[];
}
```

## Permission Checking Pattern

### Render Logic

```typescript
// In SideMenu.vue setup()
const { currentRole, hasRole } = useRoleAccess();

const visibleMenuItems = computed(() => {
  const roleSpecificItems = currentRole.value === 'collector' 
    ? collectorMenuItems 
    : memberMenuItems;
  
  return [...roleSpecificItems, ...sharedMenuItems].filter((item) =>
    item.divider || hasRole(item.roles)
  );
});
```

### Dynamic Route Resolution

```typescript
function resolveRoute(item: MenuItemConfig): string {
  if (item.route) return item.route;
  
  // Dynamic routes based on role
  if (item.label === 'Profile') {
    return currentRole.value === 'collector' 
      ? '/collector/profile' 
      : '/member/profile';
  }
  
  return '/';
}
```

## Visual State Management

### User Profile Section

Display at the top of the menu:

```vue
<div class="menu-profile">
  <ion-avatar>
    <img :src="userAvatar || defaultAvatar" />
  </ion-avatar>
  <div class="profile-info">
    <h4>{{ userName }}</h4>
    <ion-chip :color="roleColor">
      <ion-label>{{ roleLabel }}</ion-label>
    </ion-chip>
  </div>
</div>
```

### Badge Indicators

```vue
<ion-item 
  v-for="item in visibleMenuItems" 
  :key="item.label"
  @click="navigateOrAction(item)">
  <ion-icon :icon="item.icon" slot="start"></ion-icon>
  <ion-label>{{ item.label }}</ion-label>
  <!-- Dynamic badge -->
  <ion-badge 
    v-if="item.badge && item.badge() > 0" 
    color="danger"
    slot="end">
    {{ item.badge() }}
  </ion-badge>
</ion-item>
```

### Role Indicator

Visual distinction for current role:

```typescript
const roleColor = computed(() => 
  currentRole.value === 'collector' ? 'primary' : 'secondary'
);

const roleLabel = computed(() => 
  currentRole.value === 'collector' ? 'Collector' : 'Member'
);
```

## Navigation Guards

### Menu Item Click Handler

```typescript
async function navigateOrAction(item: MenuItemConfig) {
  await menuController.close('app-menu');
  
  if (item.action === 'logout') {
    await handleLogout();
  } else {
    const route = resolveRoute(item);
    ionRouter.push(route, 'forward', 'none');
  }
}
```

### Logout Handler

```typescript
async function handleLogout() {
  await store.dispatch('auth/logout');
  ionRouter.push('/login', 'forward', 'none');
}
```

## Styling Guidelines

### Wujo Brand Colors

```css
.menu-profile {
  background: linear-gradient(135deg, 
    var(--ion-color-dark-green) 0%, 
    var(--ion-color-dark-green-shade) 100%);
  padding: 20px;
  color: white;
}

ion-chip[color="primary"] {
  --background: var(--ion-color-medium-aquamarine);
  --color: var(--ion-color-dark-green);
}

ion-badge[color="danger"] {
  --background: #ff4444;
  font-weight: bold;
}
```

### Animations

```css
@keyframes slideInLeft {
  from { 
    opacity: 0; 
    transform: translateX(-30px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

.menu-item {
  animation: slideInLeft 0.3s ease-out;
}
```

## Accessibility

- Use semantic HTML and ARIA labels
- Ensure keyboard navigation works
- Provide screen reader descriptions for icons
- Maintain sufficient color contrast (WCAG AA)

## Error Handling

- **No User Role**: Hide menu items, show error state
- **Invalid Role**: Log warning, default to shared items only
- **Navigation Failure**: Show toast notification
