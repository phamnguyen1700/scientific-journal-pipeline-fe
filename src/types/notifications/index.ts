export type NotificationKind = "paper" | "citation" | "keyword" | "journal";

export type NotificationFilter = "all" | "unread" | NotificationKind;

export type UserNotification = {
  id: number;
  kind: NotificationKind;
  title: string;
  description: string;
  time: string;
  read: boolean;
};
