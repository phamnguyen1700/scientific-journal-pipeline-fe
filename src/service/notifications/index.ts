import { apiEndpoints } from "@/config/apiEndpoints";
import { get, post, put } from "@/service/apiClient";
import type {
  AdminNotificationTriggerRequest,
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

export const triggerAdminNotificationService = ({
  eventType,
  paperId,
}: AdminNotificationTriggerRequest) => {
  const endpoint = {
    NewPaperInFollowedTopic:
      apiEndpoints.notifications.triggerNewPaperTopic,
    NewPaperInFollowedJournal:
      apiEndpoints.notifications.triggerNewPaperJournal,
    BookmarkedPaperUpdated:
      apiEndpoints.notifications.triggerBookmarkedPaperUpdated,
  }[eventType];

  return post<NotificationApiResponse<string>>(endpoint(paperId));
};

export const notificationService = {
  list: getNotificationsService,
  unreadCount: getUnreadNotificationCountService,
  markRead: markNotificationReadService,
  markAllRead: markAllNotificationsReadService,
  triggerAdmin: triggerAdminNotificationService,
};
