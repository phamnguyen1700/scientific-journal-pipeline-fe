import { cn } from "@/lib/utils";

type ProgressColor = "primary" | "success" | "warning" | "danger";

export function ProgressBar({
  value,
  color = "primary",
  size = "md",
  label,
  showLabel = false,
}: {
  value: number;
  color?: ProgressColor;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
}) {
  const colors: Record<ProgressColor, string> = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  };
  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1.5">
      {(label || showLabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showLabel && (
            <span className="text-muted-foreground">{clamped}%</span>
          )}
        </div>
      )}
      <div className={cn("overflow-hidden rounded-full bg-muted", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-all", colors[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
