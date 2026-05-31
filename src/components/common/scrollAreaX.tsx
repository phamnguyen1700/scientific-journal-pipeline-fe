import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ScrollAreaX({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      {children}
    </div>
  );
}
