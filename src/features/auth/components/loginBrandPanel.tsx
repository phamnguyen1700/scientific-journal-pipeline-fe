import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoginFeatureItem = {
  label: string;
  icon: ReactNode;
};

export type LoginStatItem = {
  value: string;
  label: string;
};

export function LoginBrandPanel({
  features,
  stats,
  mode = "desktop",
}: {
  features: LoginFeatureItem[];
  stats: LoginStatItem[];
  mode?: "desktop" | "mobile";
}) {
  return (
    <section
      className={cn(
        "auth-promo",
        mode === "desktop"
          ? "auth-promo-desktop"
          : "auth-promo-mobile"
      )}
    >
      <div className="auth-brand">
        <div className="auth-brand-mark">
          <FlaskConical size={20} className="text-white" />
        </div>
        <div>
          <p className="auth-brand-name">SciTrend</p>
          <p className="auth-brand-caption">Publication Analytics Platform</p>
        </div>
      </div>

      <div
        className={cn(
          "auth-promo-content",
          mode === "desktop"
            ? "auth-promo-content-desktop"
            : "auth-promo-content-mobile"
        )}
      >
        <h1
          className={cn(
            "auth-promo-title",
            mode === "desktop"
              ? "auth-promo-title-desktop"
              : "auth-promo-title-mobile"
          )}
        >
          Track Scientific
          <br />
          <span className="auth-promo-title-accent">
            Publication Trends
          </span>
        </h1>
        <p className="auth-promo-description">
          Discover emerging research topics, analyze journal trends, and
          visualize academic data - all in one intelligent platform.
        </p>

        <div className="auth-promo-feature-list">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="auth-promo-feature-pill"
            >
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "auth-stats",
          mode === "desktop"
            ? "auth-stats-desktop"
            : "hidden"
        )}
      >
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="auth-stat-value">{stat.value}</p>
            <p className="auth-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
