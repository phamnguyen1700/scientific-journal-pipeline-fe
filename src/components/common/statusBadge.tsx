import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/common/statusDot";
import type { CommonStatus } from "@/types/common";

const statusLabels: Record<CommonStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  error: "Error",
  warning: "Warning",
};

export function StatusBadge({
  status,
  label,
}: {
  status: CommonStatus;
  label?: string;
}) {
  const textStyles: Record<CommonStatus, string> = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-slate-100 text-slate-700",
    pending: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-xs font-medium",
        textStyles[status]
      )}
    >
      <StatusDot status={status} />
      {label ?? statusLabels[status]}
    </span>
  );
}
