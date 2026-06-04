"use client";

import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useSidebar } from "./sidebar";
import { useRole } from "@/providers/role-provider";
import { useState, memo, useMemo } from "react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const ROLES = [
  { value: "student", label: "Student / Lecturer", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  { value: "researcher", label: "Researcher", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { value: "admin", label: "Administrator", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
];

function NavbarContent({ onToggleSidebar }: NavbarProps) {
  const { open, setOpen } = useSidebar();
  const { role, setRole } = useRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
    onToggleSidebar?.();
  };

  const currentRole = useMemo(() => ROLES.find(r => r.value === role) || ROLES[0], [role]);

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
        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors hover:opacity-80 ${currentRole.color}`}
          >
            {currentRole.label}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showRoleMenu && (
            <div className="absolute top-8 right-0 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setRole(r.value as "student" | "researcher" | "admin");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    role === r.value
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

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
