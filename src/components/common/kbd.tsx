import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      data-slot="kbd"
      className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-card px-1.5 font-mono text-[11px] font-medium text-muted-foreground shadow-sm"
    >
      {children}
    </kbd>
  );
}
