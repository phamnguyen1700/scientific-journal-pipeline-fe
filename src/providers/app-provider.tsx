"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { RoleProvider } from "@/providers/role-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </QueryProvider>
    </RoleProvider>
  );
}
