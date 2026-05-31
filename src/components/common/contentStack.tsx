import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ContentStack({
  gap = "md",
  className,
  children,
}: {
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children: ReactNode;
}) {
  const gaps = {
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-10",
  };

  return <div className={cn(gaps[gap], className)}>{children}</div>;
}
