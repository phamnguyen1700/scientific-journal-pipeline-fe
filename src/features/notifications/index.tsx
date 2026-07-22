"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { NotificationFilters, NotificationItem, NotificationsHeader } from "@/features/notifications/components";
import {
  getNotificationErrorMessage,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/notifications";
import type {
  NotificationEventType,
  NotificationFilter,
  NotificationHistoryItem,
  NotificationKind,
  UserNotification,
} from "@/types/notifications";

export function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const notifications = useMemo(
    () => (notificationsQuery.data ?? []).map(mapHistoryNotification),
    [notificationsQuery.data],
  );
  const unreadCount =
    unreadCountQuery.data ?? notifications.filter((item) => !item.read).length;
  const visibleNotifications = useMemo(() => notifications.filter((item) => filter === "all" || (filter === "unread" ? !item.read : item.kind === filter)), [filter, notifications]);
  const error = getNotificationErrorMessage(notificationsQuery.error);

  return (
    <div className="library-page">
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllReadMutation.mutate()}
        saving={markAllReadMutation.isPending}
      />
      <NotificationFilters active={filter} onChange={setFilter} />
      <section className="notifications-list">
        {notificationsQuery.isPending ? (
          <div className="paper-search-empty">Loading notifications...</div>
        ) : error ? (
          <div className="paper-search-empty">{error}</div>
        ) : visibleNotifications.length ? (
          visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={() => {
                if (!notification.read) {
                  markReadMutation.mutate(notification.id);
                }

                router.push(getNotificationHref(notification));
              }}
            />
          ))
        ) : (
          <div className="paper-search-empty">No notifications found.</div>
        )}
      </section>
    </div>
  );
}

function mapHistoryNotification(item: NotificationHistoryItem): UserNotification {
  return {
    id: item.notificationId,
    kind: getNotificationKind(item.eventType),
    title: item.title,
    description: item.body,
    time: formatNotificationTime(item.createdAt),
    read: item.isRead,
    paperId: item.paperId,
    topicId: item.topicId,
    journalId: item.journalId,
    eventType: item.eventType,
  };
}

function getNotificationKind(eventType: NotificationEventType): NotificationKind {
  if (eventType === "NewPaperInFollowedJournal") return "journal";
  if (eventType === "BookmarkedPaperUpdated") return "paper";
  if (eventType === "NewPaperInFollowedTopic") return "paper";

  return "paper";
}

function getNotificationHref(notification: UserNotification) {
  if (notification.paperId) return `/dashboard/papers/${notification.paperId}`;
  if (notification.journalId) return `/dashboard/journals/${notification.journalId}`;
  if (notification.topicId) return `/dashboard/topics/${notification.topicId}`;

  return "/dashboard/notifications";
}

function formatNotificationTime(value: string) {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return value;

  const diffMs = Date.now() - createdAt.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);
}
