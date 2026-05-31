import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Divider({
  label,
  className,
}: {
  label?: ReactNode;
  className?: string;
}) {
  if (!label) {
    return <div className={cn("h-px w-full bg-border", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
