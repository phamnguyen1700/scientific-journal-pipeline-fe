import { cn } from "@/lib/utils";
import type { CommonSize } from "@/components/common/types";

export function Spinner({
  size = "sm",
  className,
}: {
  size?: Exclude<CommonSize, "xl">;
  className?: string;
}) {
  const sizes = {
    xs: "size-3 border",
    sm: "size-4 border-2",
    md: "size-5 border-2",
    lg: "size-6 border-2",
  };

  return (
    <span
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-r-transparent",
        sizes[size],
        className
      )}
    />
  );
}
