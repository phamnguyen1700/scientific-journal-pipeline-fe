"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function SidebarProvider({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function Sidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-dvh flex-col shrink-0 overflow-hidden bg-card border-r border-border transition-all duration-200",
        className,
      )}
      style={{ width: open ? 232 : 72 }}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center gap-3 border-b border-border px-4",
        !open && "justify-center px-3",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-3 py-4 space-y-4", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shrink-0 border-t border-border p-3", className)}
      {...props}
    />
  );
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-0.5", className)} {...props} />;
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <div
      className={cn(
        "text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)} {...props} />;
}

export function SidebarMenuButton({
  className,
  isActive,
  title,
  href,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  asChild?: boolean;
  title?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const { open } = useSidebar();

  const buttonClass = cn(
    "flex min-h-11 w-full items-center rounded-lg transition-colors",
    open ? "gap-2.5 px-3 py-2" : "justify-center px-0 py-2.5",
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "text-foreground hover:bg-muted",
    className,
  );

  if (href) {
    const linkProps = props as Omit<React.ComponentProps<typeof Link>, "href">;

    return (
      <Link
        {...linkProps}
        href={href}
        title={!open ? title : undefined}
        className={buttonClass}
      >
        <span
          className={cn(
            "flex items-center",
            open ? "gap-2.5" : "justify-center",
          )}
        >
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      title={!open ? title : undefined}
      className={buttonClass}
      {...props}
    >
      <span
        className={cn("flex items-center", open ? "gap-2.5" : "justify-center")}
      >
        {children}
      </span>
    </button>
  );
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open);
      }}
      className={cn(
        "text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}
