"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TagColor } from "@/types/common";

const tagColors: Record<TagColor, string> = {
  purple: "bg-purple-100 text-purple-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-slate-100 text-slate-700",
  cyan: "bg-cyan-100 text-cyan-800",
};

export function Tag({
  color = "purple",
  icon,
  onRemove,
  className,
  children,
}: {
  color?: TagColor;
  icon?: ReactNode;
  onRemove?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium",
        tagColors[color],
        className
      )}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-70 hover:bg-black/10 hover:opacity-100"
          aria-label="Remove tag"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
