import { CheckCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function NotificationsHeader({ unreadCount, onMarkAllRead, saving = false }: { unreadCount: number; onMarkAllRead: () => void; saving?: boolean }) {
  return (
    <div className="notifications-header">
      <div>
        <h1 className="library-page-title">Notifications</h1>
        <p className="library-page-description">{unreadCount} unread research updates</p>
      </div>
      <Button type="button" variant="outline" onClick={onMarkAllRead} disabled={!unreadCount || saving}><CheckCheck />Mark all as read</Button>
    </div>
  );
}
