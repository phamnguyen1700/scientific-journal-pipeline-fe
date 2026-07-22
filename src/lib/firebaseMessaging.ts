"use client";

import { env } from "@/config/env";
import type {
  ClientNotification,
  FcmNotificationData,
} from "@/types/notifications";

type FirebaseAppModule = typeof import("firebase/app");
type FirebaseMessagingModule = typeof import("firebase/messaging");
type Messaging = import("firebase/messaging").Messaging;
type MessagePayload = import("firebase/messaging").MessagePayload;

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

let messagingPromise: Promise<Messaging | null> | null = null;

export function isFirebaseMessagingConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      env.firebase.vapidKey,
  );
}

export async function getFirebaseMessagingToken() {
  if (!canUseMessaging()) return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") return null;

  const { getToken } = await import("firebase/messaging");
  const serviceWorkerRegistration = await window.navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  return getToken(messaging, {
    vapidKey: env.firebase.vapidKey,
    serviceWorkerRegistration,
  });
}

export async function subscribeToForegroundNotifications(
  onNotification: (notification: ClientNotification) => void,
) {
  if (!canUseMessaging()) return () => undefined;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => undefined;

  const { onMessage } = await import("firebase/messaging");
  return onMessage(messaging, (payload) => {
    onNotification(normalizeMessagePayload(payload));
  });
}

function canUseMessaging() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in window.navigator &&
    isFirebaseMessagingConfigured()
  );
}

async function getFirebaseMessaging() {
  if (!messagingPromise) {
    messagingPromise = initializeFirebaseMessaging();
  }

  return messagingPromise;
}

async function initializeFirebaseMessaging() {
  const [{ getApps, initializeApp }, { getMessaging, isSupported }] =
    (await Promise.all([
      import("firebase/app"),
      import("firebase/messaging"),
    ])) as [FirebaseAppModule, FirebaseMessagingModule];

  if (!(await isSupported())) return null;

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getMessaging(app);
}

async function ensureNotificationPermission() {
  if (window.Notification.permission === "granted") {
    return "granted";
  }

  if (window.Notification.permission === "denied") {
    return "denied";
  }

  return window.Notification.requestPermission();
}

function normalizeMessagePayload(payload: MessagePayload): ClientNotification {
  return {
    title: payload.notification?.title ?? notificationTitleFromData(payload.data),
    body: payload.notification?.body ?? notificationBodyFromData(payload.data),
    data: (payload.data ?? {}) as FcmNotificationData,
  };
}

function notificationTitleFromData(data?: Record<string, string>) {
  if (data?.eventType === "BookmarkedPaperUpdated") {
    return "Bookmarked paper updated";
  }

  if (data?.eventType === "NewPaperInFollowedJournal") {
    return "New paper in followed journal";
  }

  if (data?.eventType === "NewPaperInFollowedTopic") {
    return "New paper in followed topic";
  }

  return "New notification";
}

function notificationBodyFromData(data?: Record<string, string>) {
  if (data?.paperId) return "Click to view the related paper.";
  if (data?.journalId) return "Click to view the related journal.";
  if (data?.topicId) return "Click to view the related topic.";

  return "You have a new research update.";
}
