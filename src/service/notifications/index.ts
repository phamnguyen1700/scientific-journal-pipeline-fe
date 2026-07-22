import { apiEndpoints } from "@/config/apiEndpoints";
import { get, put } from "@/service/apiClient";
import type {
  NotificationApiResponse,
  NotificationHistoryItem,
} from "@/types/notifications";

export const getNotificationsService = () =>
  get<NotificationApiResponse<NotificationHistoryItem[]>>(
    apiEndpoints.notifications.list,
  );

export const getUnreadNotificationCountService = () =>
  get<NotificationApiResponse<number>>(apiEndpoints.notifications.unreadCount);

export const markNotificationReadService = (id: string) =>
  put<NotificationApiResponse<string>>(apiEndpoints.notifications.markRead(id));

export const markAllNotificationsReadService = () =>
  put<NotificationApiResponse<string>>(apiEndpoints.notifications.markAllRead);

export const notificationService = {
  list: getNotificationsService,
  unreadCount: getUnreadNotificationCountService,
  markRead: markNotificationReadService,
  markAllRead: markAllNotificationsReadService,
};
