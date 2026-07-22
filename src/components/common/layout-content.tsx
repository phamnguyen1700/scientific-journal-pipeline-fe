"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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
      <motion.div
        key={`sidebar-${pathname}`}
        initial={{ opacity: 0.92, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="shrink-0"
      >
        <AppSidebar />
      </motion.div>
      <SidebarInset>
        <Navbar />
        <main className="relative min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
