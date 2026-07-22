"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  LogOut,
  Tag,
  Bookmark,
  BookMarked,
  Bell,
  LineChart,
  BarChart2,
  Network,
  Zap,
  Activity,
  Radio,
} from "lucide-react";
import { Suspense, useEffect, useMemo, memo } from "react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "./sidebar";
import { MobileBottomNavbar } from "./mobileBottomNavbar";
import { useLogout } from "@/hooks/auth";
import { useAuthStore } from "@/store/auth";
import { isAdminRole, type UserRole } from "@/types/role";
import { ProfileDrawer } from "@/features/profile";
import { UserAvatar } from "@/components/common/userAvatar";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  section: string;
}

// Student Navigation
const studentNav: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard", section: "Main" },
  {
    label: "Paper Search",
    icon: Search,
    href: "/dashboard/papers",
    section: "Discover",
  },
  {
    label: "Topic Insight",
    icon: Tag,
    href: "/dashboard/topics",
    section: "Discover",
  },
  {
    label: "Bookmark",
    icon: Bookmark,
    href: "/dashboard/bookmarks",
    section: "Library",
  },
  {
    label: "Followed",
    icon: BookMarked,
    href: "/dashboard/following",
    section: "Library",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
    section: "Library",
  },
];

// Researcher Navigation
const researcherNav: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/researcher",
    section: "Main",
  },
  {
    label: "Trend Research",
    icon: LineChart,
    href: "/researcher/trends",
    section: "Analytics",
  },
  {
    label: "Topic Compare",
    icon: BarChart2,
    href: "/researcher/compare",
    section: "Analytics",
  },
  {
    label: "Topic Cluster",
    icon: Network,
    href: "/researcher/cluster",
    section: "Analytics",
  },
  {
    label: "Emerging Topics",
    icon: Zap,
    href: "/researcher/emerging",
    section: "Analytics",
  },
  {
    label: "Publication Analytics",
    icon: Activity,
    href: "/researcher/analytics",
    section: "Research",
  },
  // { label: "Reports & Analytics", icon: FileText, href: "/researcher/reports", section: "Research" },
  {
    label: "Journal Tracker",
    icon: Radio,
    href: "/researcher/tracker",
    section: "Research",
  },
];

// Admin Navigation
const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    section: "Main",
  },
  {
    label: "User Management",
    icon: Users,
    href: "/admin/users",
    section: "Manage",
  },
  // { label: "API Management", icon: Database, href: "/admin/api", section: "Manage" },
  // { label: "System Config", icon: SlidersHorizontal, href: "/admin/config", section: "Manage" },
];

function getNavigation(role: UserRole): NavItem[] {
  if (isAdminRole(role)) return adminNav;
  if (role === "Researcher") return researcherNav;
  return studentNav;
}

function AppSidebarContent() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
  const role = user?.roleName ?? "Student";

  // Memoize navigation structure so it only updates when role changes
  const { navigation, sections } = useMemo(() => {
    const nav = getNavigation(role);
    const secs = Array.from(new Set(nav.map((item) => item.section)));
    return { navigation: nav, sections: secs };
  }, [role]); // Only depend on role, not pathname

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            SJT
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-bold">Scientific Journals</span>
              <span className="text-xs text-muted-foreground">
                Tracking System
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Render navigation by sections */}
        {sections.map((section) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        href={item.href}
                        isActive={pathname === item.href}
                        title={item.label}
                      >
                        <item.icon className="size-6 shrink-0" />
                        {open && <span>{item.label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Card Footer */}
      <SidebarFooter>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className={`flex w-full items-center gap-2 rounded-lg py-2 text-left transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-primary/30 ${open ? "px-2" : "justify-center px-0"}`}
          title={open ? undefined : "Open profile"}
        >
          <UserAvatar
            name={user?.username ?? user?.email ?? "User"}
            size="sm"
            className="shrink-0"
          />
          {open && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium truncate">
                {user?.username ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email ?? "Signed in"}
              </span>
            </div>
          )}
        </button>
        <button
          onClick={logout}
          className={`flex min-h-11 w-full items-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 ${open ? "gap-2.5 px-2 py-1.5" : "justify-center px-0 py-2.5"}`}
          title={open ? undefined : "Logout"}
        >
          <LogOut className="size-6 shrink-0" />
          {open && <span>Logout</span>}
        </button>
      </SidebarFooter>
      <ProfileDrawer open={profileOpen} onOpenChange={setProfileOpen} />
    </Sidebar>
  );
}

export const MemoizedAppSidebarContent = memo(AppSidebarContent);

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isMobile = useIsMobile();
  const navigation = useMemo(
    () => getNavigation(user?.roleName ?? "Student"),
    [user?.roleName],
  );

  return isMobile ? (
    <MobileBottomNavbar items={navigation} pathname={pathname} />
  ) : (
    <Suspense
      fallback={<div className="w-[72px] bg-card border-r border-border" />}
    >
      <MemoizedAppSidebarContent />
    </Suspense>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);

    return () => {
      mediaQuery.removeEventListener("change", updateMobileState);
    };
  }, []);

  return isMobile;
}
