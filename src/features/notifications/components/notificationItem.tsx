import { Bell, BookOpen, Quote, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserNotification } from "@/types/notifications";

const icons = { paper: BookOpen, citation: Quote, keyword: Tag, journal: Bell };

export function NotificationItem({ notification, onRead }: { notification: UserNotification; onRead: (id: number) => void }) {
  const Icon = icons[notification.kind];
  return (
    <button type="button" className={cn("notification-item", !notification.read && "notification-item-unread")} onClick={() => onRead(notification.id)}>
      <span className={cn("notification-icon", `notification-icon-${notification.kind}`)}><Icon /></span>
      <span className="min-w-0 flex-1 text-left">
        <span className="notification-item-heading"><strong>{notification.title}</strong>{!notification.read && <i />}</span>
        <span className="notification-item-description">{notification.description}</span>
        <span className="notification-item-time">{notification.time}</span>
      </span>
    </button>
  );
}
