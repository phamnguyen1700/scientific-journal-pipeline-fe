import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background py-6 text-foreground sm:py-8 lg:py-10",
        className
      )}
    >
      {children}
    </main>
  );
}
