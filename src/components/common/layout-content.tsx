"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, AppSidebar, SidebarInset } from "./sidebar";
import { Navbar } from "./navbar";
import { useAuthStore } from "@/store/auth";
import { getDefaultRouteByRole, isAdminRole } from "@/types/role";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/signup") || pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedPage = !isAuthPage;
  const defaultRoute = getDefaultRouteByRole(user?.roleName);
  const shouldRedirectFromAuth = isAuthPage && isAuthenticated;
  const shouldRedirectToLogin = isProtectedPage && !isAuthenticated;
  const shouldRedirectFromAdmin =
    isAdminPage && isAuthenticated && !isAdminRole(user?.roleName);
  const shouldRedirectAdminToAdminHome =
    pathname.startsWith("/dashboard") && isAuthenticated && isAdminRole(user?.roleName);

  useEffect(() => {
    if (shouldRedirectFromAuth) {
      router.replace(defaultRoute);
      return;
    }

    if (shouldRedirectToLogin) {
      router.replace("/login");
      return;
    }

    if (shouldRedirectFromAdmin) {
      router.replace("/dashboard");
      return;
    }

    if (shouldRedirectAdminToAdminHome) {
      router.replace("/admin");
    }
  }, [
    defaultRoute,
    router,
    shouldRedirectAdminToAdminHome,
    shouldRedirectFromAdmin,
    shouldRedirectFromAuth,
    shouldRedirectToLogin,
  ]);

  if (
    shouldRedirectFromAuth ||
    shouldRedirectToLogin ||
    shouldRedirectFromAdmin ||
    shouldRedirectAdminToAdminHome
  ) {
    return <div className="min-h-screen" />;
  }

  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
