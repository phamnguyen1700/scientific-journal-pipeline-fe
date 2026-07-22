"use client";

import { Bell, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { useUpdateDeviceToken } from "@/hooks/user";
import {
  getFirebaseMessagingToken,
  isFirebaseMessagingConfigured,
  subscribeToForegroundNotifications,
} from "@/lib/firebaseMessaging";
import { useAuthStore } from "@/store/auth";
import type {
  ClientNotification,
  FcmNotificationData,
} from "@/types/notifications";

export function NotificationRuntime() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: updateDeviceToken } = useUpdateDeviceToken();

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !isFirebaseMessagingConfigured()) {
      return;
    }

    let cancelled = false;

    void getFirebaseMessagingToken()
      .then((deviceToken) => {
        if (!deviceToken || cancelled) return;
        updateDeviceToken({ deviceToken });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, updateDeviceToken]);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !isFirebaseMessagingConfigured()) {
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | undefined;

    void subscribeToForegroundNotifications((notification) => {
      showNotificationToast(notification, (href) => router.push(href));
    }).then((nextUnsubscribe) => {
      if (!active) {
        nextUnsubscribe();
        return;
      }

      unsubscribe = nextUnsubscribe;
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [hasHydrated, isAuthenticated, router]);

  return null;
}

function showNotificationToast(
  notification: ClientNotification,
  navigate: (href: string) => void,
) {
  const href = getNotificationHref(notification.data);

  toast.custom(
    (toastInstance) => (
      <button
        className="notification-toast"
        data-carousel-ignore-drag
        onClick={() => {
          toast.dismiss(toastInstance.id);
          if (href) navigate(href);
        }}
        type="button"
      >
        <span className="notification-toast-icon">
          <Bell size={20} />
        </span>
        <span className="notification-toast-content">
          <span className="notification-toast-title">{notification.title}</span>
          <span className="notification-toast-body">{notification.body}</span>
        </span>
        {href ? (
          <ExternalLink className="notification-toast-action" size={16} />
        ) : null}
      </button>
    ),
    { duration: 7000 },
  );
}

function getNotificationHref(data: FcmNotificationData) {
  if (data.paperId) return `/dashboard/papers/${data.paperId}`;
  if (data.journalId) return `/dashboard/journals/${data.journalId}`;
  if (data.topicId) return `/dashboard/topics/${data.topicId}`;

  return "/dashboard/notifications";
}
