"use client";

import React, { createContext, useContext, useState } from "react";
import type { UserRole } from "@/types/role";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Load role synchronously on initial render using lazy initializer
  // This avoids the setState-in-effect warning and ensures role is ready immediately
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem("userRole") as UserRole | null;
      if (savedRole && ["student", "researcher", "admin"].includes(savedRole)) {
        return savedRole;
      }
    } catch (_e) {
      // localStorage not available (SSR)
    }
    return "student";
  });

  // Save role to localStorage when it changes
  const handleSetRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("userRole", newRole);
    } catch (_e) {
      // localStorage not available
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
}

