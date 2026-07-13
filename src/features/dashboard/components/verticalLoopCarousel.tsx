"use client";

import {
  Children,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type VerticalLoopCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  groupClassName?: string;
  itemClassName?: string;
  mode?: "continuous" | "step";
  stepIntervalMs?: number;
  trackClassName?: string;
};

export function VerticalLoopCarousel({
  ariaLabel,
  children,
  className,
  groupClassName,
  itemClassName,
  mode = "continuous",
  stepIntervalMs = 3200,
  trackClassName,
}: VerticalLoopCarouselProps) {
  const items = Children.toArray(children);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSize, setStepSize] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [axis, setAxis] = useState<"x" | "y">("y");
  const carouselRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const itemCount = items.length;
  const renderedGroups = mode === "step" ? 2 : 2;

  useEffect(() => {
    if (mode !== "step") return;

    const updateMetrics = () => {
      const firstItem = firstItemRef.current;
      const carousel = carouselRef.current;
      if (!firstItem || !carousel) return;

      const nextAxis = window.matchMedia("(max-width: 767px)").matches ? "x" : "y";
      const group = firstItem.parentElement;
      const groupStyles = group ? window.getComputedStyle(group) : null;
      const gap = groupStyles ? Number.parseFloat(groupStyles.gap || "0") : 0;
      const rect = firstItem.getBoundingClientRect();

      setAxis(nextAxis);
      setStepSize((nextAxis === "x" ? rect.width : rect.height) + gap);
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [mode, itemCount]);

  useEffect(() => {
    if (mode !== "step" || itemCount <= 1) return;

    const interval = window.setInterval(() => {
      setStepIndex((current) => current + 1);
    }, stepIntervalMs);

    return () => window.clearInterval(interval);
  }, [itemCount, mode, stepIntervalMs]);

  useEffect(() => {
    if (mode !== "step" || itemCount === 0 || stepIndex !== itemCount) return;

    const reset = window.setTimeout(() => {
      setIsResetting(true);
      setStepIndex(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsResetting(false));
      });
    }, 680);

    return () => window.clearTimeout(reset);
  }, [itemCount, mode, stepIndex]);

  const trackStyle = useMemo<CSSProperties>(() => {
    if (mode !== "step") return {};

    const offset = -(stepIndex * stepSize);
    return {
      transform: axis === "x" ? `translateX(${offset}px)` : `translateY(${offset}px)`,
      transition: isResetting ? "none" : "transform 640ms cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }, [axis, isResetting, mode, stepIndex, stepSize]);

  return (
    <div
      ref={carouselRef}
      aria-label={ariaLabel}
      className={cn("home-loop-carousel", className)}
      data-loop-mode={mode}
    >
      <div
        className={cn("home-loop-carousel-track", trackClassName)}
        style={trackStyle}
      >
        {Array.from({ length: renderedGroups }).map((_, groupIndex) => (
          <LoopGroup
            ariaHidden={groupIndex > 0}
            firstItemRef={groupIndex === 0 ? firstItemRef : undefined}
            groupClassName={groupClassName}
            itemClassName={itemClassName}
            items={items}
            key={groupIndex}
          />
        ))}
      </div>
    </div>
  );
}

function LoopGroup({
  ariaHidden,
  firstItemRef,
  groupClassName,
  itemClassName,
  items,
}: {
  ariaHidden?: boolean;
  firstItemRef?: React.RefObject<HTMLDivElement | null>;
  groupClassName?: string;
  itemClassName?: string;
  items: ReactNode[];
}) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn("home-loop-carousel-group", groupClassName)}
    >
      {items.map((item, index) => (
        <div
          className={cn("home-loop-carousel-item", itemClassName)}
          key={index}
          ref={index === 0 ? firstItemRef : undefined}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
