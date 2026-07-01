"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Search,
  Users,
  LogOut,
  TrendingUp,
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
import { Suspense, useMemo, memo } from "react";
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
import { useLogout } from "@/hooks/auth";
import { useAuthStore } from "@/store/auth";
import { isAdminRole, type UserRole } from "@/types/role";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  section: string;
}

// Student Navigation
const studentNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", section: "Main" },
  { label: "Paper Search", icon: Search, href: "/dashboard/papers", section: "Discover" },
  { label: "Topic Search", icon: Tag, href: "/dashboard/topics", section: "Discover" },
  { label: "Trending Topics", icon: TrendingUp, href: "/dashboard/trending", section: "Discover" },
  { label: "Bookmarked Papers", icon: Bookmark, href: "/dashboard/bookmarks", section: "Library" },
  { label: "Followed Topics", icon: BookMarked, href: "/dashboard/following", section: "Library" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications", section: "Library" },
];

// Researcher Navigation
const researcherNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/researcher", section: "Main" },
  { label: "Trend Research", icon: LineChart, href: "/researcher/trends", section: "Analytics" },
  { label: "Topic Compare", icon: BarChart2, href: "/researcher/compare", section: "Analytics" },
  { label: "Topic Cluster", icon: Network, href: "/researcher/cluster", section: "Analytics" },
  { label: "Emerging Topics", icon: Zap, href: "/researcher/emerging", section: "Analytics" },
  { label: "Publication Analytics", icon: Activity, href: "/researcher/analytics", section: "Research" },
  { label: "Reports & Analytics", icon: FileText, href: "/researcher/reports", section: "Research" },
  { label: "Journal Tracker", icon: Radio, href: "/researcher/tracker", section: "Research" },
];

// Admin Navigation
const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin", section: "Main" },
  { label: "User Management", icon: Users, href: "/admin/users", section: "Manage" },
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
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            SJ
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-bold">Journal</span>
              <span className="text-[10px] text-muted-foreground">Pipeline</span>
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
                        <item.icon className="h-4 w-4 shrink-0" />
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
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold shrink-0">
            A
          </div>
          {open && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.username ?? "User"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email ?? "Signed in"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-sm transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          title={open ? undefined : "Logout"}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {open && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export const MemoizedAppSidebarContent = memo(AppSidebarContent);

export function AppSidebar() {
  return (
    <Suspense fallback={<div className="w-16 bg-card border-r border-border" />}>
      <MemoizedAppSidebarContent />
    </Suspense>
  );
}
