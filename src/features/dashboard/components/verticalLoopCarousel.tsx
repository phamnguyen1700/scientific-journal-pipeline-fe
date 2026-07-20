"use client";

import {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
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
  mode = "step",
  stepIntervalMs = 3200,
  trackClassName,
}: VerticalLoopCarouselProps) {
  const items = Children.toArray(children);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSize, setStepSize] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [axis, setAxis] = useState<"x" | "y">("y");
  const carouselRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const itemCount = items.length;

  useLayoutEffect(() => {
    if (mode !== "step") return;

    const updateMetrics = () => {
      const firstItem = firstItemRef.current;
      if (!firstItem) return;

      const nextAxis = window.matchMedia("(max-width: 767px)").matches ? "x" : "y";
      const group = firstItem.parentElement;
      const groupStyles = group ? window.getComputedStyle(group) : null;
      const gap = groupStyles ? Number.parseFloat(groupStyles.gap || "0") : 0;
      const rect = firstItem.getBoundingClientRect();
      const nextStepSize = (nextAxis === "x" ? rect.width : rect.height) + gap;

      setAxis(nextAxis);
      if (nextStepSize > 0) {
        setStepSize(nextStepSize);
        setStepIndex(0);
      }
    };

    const frame = window.requestAnimationFrame(updateMetrics);
    const observer = new ResizeObserver(updateMetrics);
    if (firstItemRef.current) observer.observe(firstItemRef.current);
    if (carouselRef.current) observer.observe(carouselRef.current);

    window.addEventListener("resize", updateMetrics);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [mode, itemCount]);

  useEffect(() => {
    if (mode !== "step" || itemCount <= 1 || stepSize <= 0 || isDragging) {
      return;
    }

    const interval = window.setInterval(() => {
      setStepIndex((current) => current + 1);
    }, stepIntervalMs);

    return () => window.clearInterval(interval);
  }, [isDragging, itemCount, mode, stepIntervalMs, stepSize]);

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

    const offset = -(stepIndex * stepSize) + dragOffset;
    return {
      transform: axis === "x" ? `translateX(${offset}px)` : `translateY(${offset}px)`,
      transition: isResetting || isDragging
        ? "none"
        : "transform 640ms cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }, [axis, dragOffset, isDragging, isResetting, mode, stepIndex, stepSize]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (mode !== "step" || itemCount <= 1 || stepSize <= 0) return;
    if (isInteractiveCarouselTarget(event.target)) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = axis === "x" ? event.clientX : event.clientY;
    dragStartIndexRef.current = stepIndex;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const currentPosition = axis === "x" ? event.clientX : event.clientY;
    setDragOffset(currentPosition - dragStartRef.current);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    event.currentTarget.releasePointerCapture(event.pointerId);

    const threshold = Math.min(stepSize * 0.28, 90);
    let nextIndex = dragStartIndexRef.current;

    if (dragOffset <= -threshold) {
      nextIndex = dragStartIndexRef.current + 1;
    } else if (dragOffset >= threshold) {
      nextIndex = dragStartIndexRef.current - 1;
    }

    setIsDragging(false);
    setDragOffset(0);

    if (nextIndex < 0) {
      setIsResetting(true);
      setStepIndex(itemCount);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsResetting(false);
          setStepIndex(itemCount - 1);
        });
      });
      return;
    }

    setStepIndex(nextIndex);
  };

  return (
    <div
      ref={carouselRef}
      aria-label={ariaLabel}
      className={cn("home-loop-carousel", className)}
      data-loop-mode={mode}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      <div
        className={cn("home-loop-carousel-track", trackClassName)}
        style={trackStyle}
      >
        <LoopGroup
          firstItemRef={firstItemRef}
          groupClassName={groupClassName}
          itemClassName={itemClassName}
          items={items}
        />
        <LoopGroup
          ariaHidden
          groupClassName={groupClassName}
          itemClassName={itemClassName}
          items={items}
        />
      </div>
    </div>
  );
}

function isInteractiveCarouselTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      "a, button, input, textarea, select, [role='button'], [data-carousel-ignore-drag]",
    ),
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
