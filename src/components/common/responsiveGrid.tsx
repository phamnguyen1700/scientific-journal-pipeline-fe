import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ResponsiveGrid({
  columns = 3,
  className,
  children,
}: {
  columns?: 2 | 3 | 4;
  className?: string;
  children: ReactNode;
}) {
  const columnsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", columnsClass[columns], className)}>
      {children}
    </div>
  );
}
