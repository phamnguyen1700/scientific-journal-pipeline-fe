"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, AppSidebar, SidebarInset } from "./sidebar";
import { Navbar } from "./navbar";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  
  // Check if we're on an auth page (login, signup, etc.)
  const isAuthPage = pathname.includes("/login") || pathname.includes("/signup") || pathname === "/";

  // If on auth page, render without sidebar
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Otherwise render with sidebar and navbar
  // Role is loaded synchronously on mount, so no need to wait
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
