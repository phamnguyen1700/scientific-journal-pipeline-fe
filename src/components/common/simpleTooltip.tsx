"use client";

import type { ReactElement, ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function SimpleTooltip({
  content,
  position = "top",
  children,
}: {
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children as ReactElement} />
      <TooltipContent side={position}>{content}</TooltipContent>
    </Tooltip>
  );
}
