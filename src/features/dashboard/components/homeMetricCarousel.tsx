import type { LucideIcon } from "lucide-react";

import { VerticalLoopCarousel } from "@/features/dashboard/components/verticalLoopCarousel";

type HomeMetricCarouselItem = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export function HomeMetricCarousel({
  items,
}: {
  items: HomeMetricCarouselItem[];
}) {
  return (
    <VerticalLoopCarousel
      ariaLabel="Research totals"
      className="home-metric-carousel"
      mode="step"
      stepIntervalMs={3600}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div className="home-metric-chip" key={item.label}>
            <span>
              <Icon className="size-7" strokeWidth={1.8} />
            </span>
            <div>
              <strong>{formatMetricValue(item.value)}</strong>
              <p>{item.label}</p>
            </div>
          </div>
        );
      })}
    </VerticalLoopCarousel>
  );
}

function formatMetricValue(value: number) {
  return value.toLocaleString();
}
