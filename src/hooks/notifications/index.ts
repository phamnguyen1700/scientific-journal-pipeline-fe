"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsService,
  getUnreadNotificationCountService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "@/service/notifications";
import type { NotificationApiResponse } from "@/types/notifications";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationQueryKeys.all, "list"] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: async () =>
      unwrapNotificationResponse(
        await getNotificationsService(),
        "Unable to load notifications.",
      ),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () =>
      unwrapNotificationResponse(
        await getUnreadNotificationCountService(),
        "Unable to load unread notifications.",
      ),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationReadService,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsReadService,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function getNotificationErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the notification service.";
}

function invalidateNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
}

function unwrapNotificationResponse<T>(
  response: NotificationApiResponse<T>,
  fallbackMessage: string,
): T {
  if (!response.succeeded || response.result === null) {
    throw new Error(response.errors.join(", ") || fallbackMessage);
  }

  return response.result;
}
