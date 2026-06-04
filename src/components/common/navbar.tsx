"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useSidebar } from "./sidebar";
import { memo, useMemo } from "react";
import type { UserRole } from "@/types/role";
import { useAuthStore } from "@/store/auth";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const ROLES = [
  { value: "Student", label: "Student", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  { value: "Lecturer", label: "Lecturer", color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { value: "Researcher", label: "Researcher", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { value: "System Administrator", label: "System Administrator", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  { value: "Admin", label: "Admin", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
] satisfies Array<{ value: UserRole; label: string; color: string }>;

function NavbarContent({ onToggleSidebar }: NavbarProps) {
  const { open, setOpen } = useSidebar();
  const user = useAuthStore((state) => state.user);

  const handleToggle = () => {
    setOpen(!open);
    onToggleSidebar?.();
  };

  const currentRole = useMemo(
    () => ROLES.find((role) => role.value === user?.roleName) || ROLES[0],
    [user?.roleName]
  );

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0">
      <button
        onClick={handleToggle}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search papers, topics, journals..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${currentRole.color}`}>
          {user?.roleName ?? currentRole.label}
        </span>

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
          M
        </div>
      </div>
    </header>
  );
}

export const Navbar = memo(NavbarContent);
