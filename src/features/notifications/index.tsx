"use client";

import { useMemo, useState } from "react";

import { NotificationFilters, NotificationItem, NotificationsHeader } from "@/features/notifications/components";
import type { NotificationFilter, UserNotification } from "@/types/notifications";

const initialNotifications: UserNotification[] = [
  { id: 1, kind: "paper", title: "New papers in Large Language Models", description: "12 new publications match your followed topic, including research on scientific reasoning agents.", time: "12 minutes ago", read: false },
  { id: 2, kind: "citation", title: "Citation alert", description: 'A paper you bookmarked, "Protein Structure Prediction with AlphaFold 3", reached 392 citations.', time: "1 hour ago", read: false },
  { id: 3, kind: "keyword", title: 'Keyword alert: "federated learning"', description: "Publication activity increased by 18% this week. 24 new papers are available.", time: "3 hours ago", read: false },
  { id: 4, kind: "journal", title: "Nature Machine Intelligence update", description: "The journal published a new issue with 8 articles related to your research interests.", time: "Yesterday", read: true },
  { id: 5, kind: "paper", title: "New papers in Climate Modeling", description: "7 new publications were indexed for your followed topic.", time: "Yesterday", read: true },
  { id: 6, kind: "journal", title: "Cell journal update", description: "A new genomics collection is now available with 14 selected papers.", time: "2 days ago", read: true },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const unreadCount = notifications.filter((item) => !item.read).length;
  const visibleNotifications = useMemo(() => notifications.filter((item) => filter === "all" || (filter === "unread" ? !item.read : item.kind === filter)), [filter, notifications]);

  return (
    <div className="library-page">
      <NotificationsHeader unreadCount={unreadCount} onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))} />
      <NotificationFilters active={filter} onChange={setFilter} />
      <section className="notifications-list">
        {visibleNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onRead={(id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item))} />)}
      </section>
    </div>
  );
}
