export type NotificationKind = "paper" | "citation" | "keyword" | "journal";

export type NotificationFilter = "all" | "unread" | NotificationKind;

export type UserNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  time: string;
  read: boolean;
  paperId?: string | null;
  topicId?: string | null;
  journalId?: string | null;
  eventType?: NotificationEventType | null;
};

export type NotificationEventType =
  | "NewPaperInFollowedTopic"
  | "NewPaperInFollowedJournal"
  | "BookmarkedPaperUpdated"
  | string;

export type AdminNotificationTriggerType =
  | "NewPaperInFollowedTopic"
  | "NewPaperInFollowedJournal"
  | "BookmarkedPaperUpdated";

export type AdminNotificationTriggerRequest = {
  eventType: AdminNotificationTriggerType;
  paperId: string;
};

export type FcmNotificationData = {
  paperId?: string;
  topicId?: string;
  journalId?: string;
  eventType?: NotificationEventType;
  [key: string]: string | undefined;
};

export type ClientNotification = {
  title: string;
  body: string;
  data: FcmNotificationData;
};

export type NotificationApiResponse<T> = {
  succeeded: boolean;
  result: T | null;
  errors: string[];
};

export type NotificationHistoryItem = {
  notificationId: string;
  userId: string;
  title: string;
  body: string;
  eventType: NotificationEventType;
  paperId?: string | null;
  topicId?: string | null;
  journalId?: string | null;
  isRead: boolean;
  createdAt: string;
};
