# Notification System - Role-Based Architecture

## Overview

The Wujo notification system implements role-based access control (RBAC) to ensure users only receive notifications relevant to their role (Collector or Member). This specification defines the architecture, data structures, and filtering logic for the eventful alliance pattern.

## Notification Types

### Collector-Only Notifications
- **Payment Verification Request**: When a member submits payment proof
- **Lottery Schedule Alert**: Upcoming lottery draw notifications
- **Member Join Request**: New member wants to join collector's Iqub
- **Iqub Milestone**: Iqub reaches completion or special round

### Member-Only Notifications
- **Payment Reminder**: Upcoming payment due date
- **Payment Confirmation**: Payment was verified by collector
- **Lottery Win**: Member won the lottery draw
- **Iqub Invitation**: Invited to join a new Iqub

### Shared Notifications
- **System Updates**: App updates, maintenance notices
- **Account Security**: Login alerts, password changes
- **General Announcements**: Platform-wide news

## Data Structure

### TypeScript Interface

```typescript
interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string; // ISO 8601 format
  read: boolean;
  type: NotificationType;
  targetRoles: UserRole[]; // ['collector'] | ['member'] | ['collector', 'member']
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string; // Optional navigation target
  metadata?: {
    iqubId?: number;
    memberId?: number;
    paymentId?: number;
    [key: string]: any;
  };
}

type NotificationType =
  | 'payment_verification'
  | 'payment_reminder'
  | 'payment_confirmed'
  | 'lottery_scheduled'
  | 'lottery_win'
  | 'member_join_request'
  | 'iqub_invitation'
  | 'iqub_milestone'
  | 'system_update'
  | 'account_security'
  | 'general';

type UserRole = 'collector' | 'member';
```

## Role-Based Filtering Logic

### Filter Algorithm

```typescript
function filterNotificationsByRole(
  notifications: Notification[],
  userRole: UserRole
): Notification[] {
  return notifications.filter((notification) =>
    notification.targetRoles.includes(userRole)
  );
}
```

### Priority Sorting

```typescript
const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

function sortByPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // If same priority, sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
```

## Event Emission Pattern

The notification system uses a reactive composable pattern:

1. **Initialization**: Load existing notifications on mount
2. **Real-time Updates**: Listen for new notifications (future: WebSocket/SSE)
3. **Role Filtering**: Automatically filter based on current user role
4. **State Management**: Track read/unread status locally and sync with backend

## Integration Points

### With Vuex Auth Module
- Access current user role: `store.getters['auth/getUser']?.role`
- Listen for role changes (e.g., user switches account)

### With NotificationsPage.vue
- Use `useNotifications()` composable
- Display filtered, sorted notifications
- Handle mark-as-read interactions

### With SideMenu.vue
- Use `useNotifications()` composable
- Display unread badge count
- Provide quick access to notifications page

## Error Handling

- **No User**: If user is not authenticated, return empty array
- **Invalid Role**: Log warning and default to no notifications
- **API Failure**: Show cached notifications with warning banner
- **Network Offline**: Use locally cached notifications

## Future Enhancements

- Push notifications (FCM integration)
- Real-time updates via WebSocket
- Notification preferences (mute certain types)
- Batch operations (mark all as read)
- Notification history pagination
