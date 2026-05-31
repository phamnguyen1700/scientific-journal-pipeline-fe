import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/common/statusDot";
import type { CommonSize, CommonStatus } from "@/components/common/types";

const avatarSizes: Record<CommonSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-14 text-lg",
};

const avatarColors = [
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-red-100 text-red-700",
  "bg-cyan-100 text-cyan-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getColorIndex(value: string) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    avatarColors.length;
}

export function UserAvatar({
  name,
  size = "md",
  status,
  className,
}: {
  name: string;
  size?: CommonSize;
  status?: CommonStatus;
  className?: string;
}) {
  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          avatarSizes[size],
          avatarColors[getColorIndex(name)],
          className
        )}
      >
        {getInitials(name)}
      </span>
      {status && (
        <StatusDot
          status={status}
          className="absolute -bottom-0.5 -right-0.5 ring-2 ring-card"
        />
      )}
    </span>
  );
}
