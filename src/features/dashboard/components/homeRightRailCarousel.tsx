"use client";

import type { ReactNode } from "react";

import { VerticalLoopCarousel } from "@/features/dashboard/components/verticalLoopCarousel";

type HomeRightRailCarouselProps = {
  children: ReactNode;
};

export function HomeRightRailCarousel({
  children,
}: HomeRightRailCarouselProps) {
  return (
    <VerticalLoopCarousel
      ariaLabel="Dashboard highlights"
      className="home-right-carousel"
      itemClassName="home-right-carousel-item"
      mode="step"
      stepIntervalMs={4200}
    >
      {children}
    </VerticalLoopCarousel>
  );
}
