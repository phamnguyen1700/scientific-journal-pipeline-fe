"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type MobileBottomNavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

export function MobileBottomNavbar({
  items,
  pathname,
}: {
  items: MobileBottomNavItem[];
  pathname: string;
}) {
  return (
    <nav className="mobile-bottom-navbar" aria-label="Mobile navigation">
      <div
        className="mobile-bottom-navbar-inner"
        style={
          {
            "--mobile-nav-count": items.length,
          } as React.CSSProperties
        }
      >
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "mobile-bottom-navbar-item",
                isActive && "mobile-bottom-navbar-item-active",
              )}
            >
              <Icon className="size-5" />
              <span className="mobile-bottom-navbar-dot" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
