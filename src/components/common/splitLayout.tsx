import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SplitLayout({
  sidebar,
  children,
  sidebarClassName,
  className,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[16rem_1fr]", className)}>
      <aside className={cn("min-w-0", sidebarClassName)}>{sidebar}</aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
