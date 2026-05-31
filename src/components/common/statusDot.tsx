import { cn } from "@/lib/utils";
import type { CommonStatus } from "@/components/common/types";
import { statusStyles } from "@/components/common/types";

export function StatusDot({
  status,
  pulse = false,
  className,
}: {
  status: CommonStatus;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        statusStyles[status],
        pulse && "animate-pulse",
        className
      )}
    />
  );
}
