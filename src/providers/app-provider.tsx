"use client";

import type { ReactNode } from "react";
import { NotificationRuntime } from "@/features/notifications/notificationRuntime";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        {children}
        <NotificationRuntime />
        <ToastProvider />
      </TooltipProvider>
    </QueryProvider>
  );
}
