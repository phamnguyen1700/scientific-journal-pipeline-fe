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
  const { hasHydrated, hydrateAuth, isAuthenticated, user } = useAuthStore();
  
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/signup") || pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");
  const isResearcherPage = pathname.startsWith("/researcher");
  const isProtectedPage = !isAuthPage;
  const defaultRoute = getDefaultRouteByRole(user?.roleName);
  const shouldRedirectFromAuth = isAuthPage && isAuthenticated;
  const shouldRedirectToLogin = isProtectedPage && !isAuthenticated;
  const shouldRedirectFromAdmin =
    isAdminPage && isAuthenticated && !isAdminRole(user?.roleName);
  const shouldRedirectFromResearcher =
    isResearcherPage && isAuthenticated && user?.roleName !== "Researcher";
  const shouldRedirectAdminToAdminHome =
    pathname.startsWith("/dashboard") && isAuthenticated && isAdminRole(user?.roleName);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!hasHydrated) return;

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

    if (shouldRedirectFromResearcher) {
      router.replace(defaultRoute);
      return;
    }

    if (shouldRedirectAdminToAdminHome) {
      router.replace("/admin");
    }
  }, [
    defaultRoute,
    hasHydrated,
    router,
    shouldRedirectAdminToAdminHome,
    shouldRedirectFromAdmin,
    shouldRedirectFromAuth,
    shouldRedirectFromResearcher,
    shouldRedirectToLogin,
  ]);

  if (!hasHydrated) {
    return <div className="min-h-screen" />;
  }

  if (
    shouldRedirectFromAuth ||
    shouldRedirectToLogin ||
    shouldRedirectFromAdmin ||
    shouldRedirectFromResearcher ||
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
