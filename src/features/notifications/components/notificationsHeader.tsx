import { CheckCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function NotificationsHeader({ unreadCount, onMarkAllRead }: { unreadCount: number; onMarkAllRead: () => void }) {
  return (
    <div className="notifications-header">
      <div>
        <h1 className="library-page-title">Notifications</h1>
        <p className="library-page-description">{unreadCount} unread research updates</p>
      </div>
      <Button type="button" variant="outline" onClick={onMarkAllRead} disabled={!unreadCount}><CheckCheck />Mark all as read</Button>
    </div>
  );
}
