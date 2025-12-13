// src/composables/useNotifications.ts
import { ref, computed } from "vue";
import { Notification, UserRole } from "@/types";
import { useRoleAccess } from "./useRoleAccess";

/**
 * Composable for notification management with role-based filtering
 * Provides reactive notification state and filtering utilities
 */
export function useNotifications() {
  const { currentRole } = useRoleAccess();

  // Reactive state
  const notifications = ref<Notification[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Filter notifications based on current user role
   */
  const filteredNotifications = computed<Notification[]>(() => {
    if (!currentRole.value) return [];

    return notifications.value.filter((notification) =>
      notification.targetRoles.includes(currentRole.value as UserRole)
    );
  });

  /**
   * Get unread notifications count
   */
  const unreadCount = computed<number>(() => {
    return filteredNotifications.value.filter((n) => !n.read).length;
  });

  /**
   * Get notifications sorted by priority and timestamp
   */
  const sortedNotifications = computed<Notification[]>(() => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

    return [...filteredNotifications.value].sort((a, b) => {
      // First sort by priority
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  });

  /**
   * Group notifications by type
   */
  const groupedByType = computed<Record<string, Notification[]>>(() => {
    return filteredNotifications.value.reduce((groups, notification) => {
      const type = notification.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  });

  /**
   * Fetch notifications from backend (or use mock data for now)
   */
  async function fetchNotifications(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await axios.get('/notifications');
      // notifications.value = response.data;

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      notifications.value = getMockNotifications();
    } catch (e: any) {
      error.value = e.message || "Failed to fetch notifications";
      console.error("Error fetching notifications:", e);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mark a notification as read
   */
  async function markAsRead(notificationId: number): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // await axios.patch(`/notifications/${notificationId}/read`);

      // Update local state
      const notification = notifications.value.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.read = true;
      }
    } catch (e: any) {
      console.error("Error marking notification as read:", e);
      throw e;
    }
  }

  /**
   * Mark all notifications as read
   */
  async function markAllAsRead(): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // await axios.patch('/notifications/read-all');

      // Update local state
      notifications.value.forEach((n) => {
        n.read = true;
      });
    } catch (e: any) {
      console.error("Error marking all notifications as read:", e);
      throw e;
    }
  }

  /**
   * Delete a notification
   */
  async function deleteNotification(notificationId: number): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // await axios.delete(`/notifications/${notificationId}`);

      // Update local state
      notifications.value = notifications.value.filter(
        (n) => n.id !== notificationId
      );
    } catch (e: any) {
      console.error("Error deleting notification:", e);
      throw e;
    }
  }

  /**
   * Mock data generator for development
   */
  function getMockNotifications(): Notification[] {
    return [
      {
        id: 1,
        title: "Payment Verification Required",
        message:
          "You have received a payment from Abebe Kebede for your Nimani Iqub for round 5.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        type: "payment_verification",
        targetRoles: ["collector"],
        priority: "high",
        actionUrl: "/collector/payment-verify/123",
        metadata: {
          iqubId: 1,
          memberId: 5,
          paymentId: 123,
        },
      },
      {
        id: 2,
        title: "Payment Reminder",
        message: "Your payment for Damay Iqub is due in 2 days (Round 6)",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: false,
        type: "payment_reminder",
        targetRoles: ["member"],
        priority: "medium",
        actionUrl: "/member/my-iqubs",
        metadata: {
          iqubId: 1,
        },
      },
      {
        id: 3,
        title: "Lottery Scheduled",
        message:
          "The next lottery draw for Nimani Iqub is scheduled for tomorrow at 2 PM",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        read: true,
        type: "lottery_scheduled",
        targetRoles: ["collector"],
        priority: "medium",
        actionUrl: "/collector/my-iqubs",
        metadata: {
          iqubId: 2,
        },
      },
      {
        id: 4,
        title: "Payment Confirmed",
        message: "Your payment for round 5 has been verified by the collector",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: true,
        type: "payment_confirmed",
        targetRoles: ["member"],
        priority: "low",
        actionUrl: "/member/my-iqubs",
        metadata: {
          iqubId: 1,
        },
      },
      {
        id: 5,
        title: "System Update",
        message: "Wujo has been updated to version 2.1 with new features!",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        read: false,
        type: "system_update",
        targetRoles: ["collector", "member"],
        priority: "low",
        metadata: {},
      },
    ];
  }

  return {
    // State
    notifications,
    isLoading,
    error,

    // Computed
    filteredNotifications,
    sortedNotifications,
    unreadCount,
    groupedByType,

    // Methods
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
