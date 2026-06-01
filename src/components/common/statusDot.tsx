import { cn } from "@/lib/utils";
import type { CommonStatus } from "@/types/common";

const statusStyles: Record<CommonStatus, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  pending: "bg-blue-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
};

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
