"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoginRole = "student" | "researcher" | "admin";

export type LoginRoleOption = {
  value: LoginRole;
  label: string;
  description: string;
};

export function RoleSelector({
  roles,
  value,
  open,
  onOpenChange,
  onChange,
}: {
  roles: LoginRoleOption[];
  value: LoginRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (role: LoginRole) => void;
}) {
  const selectedRole = roles.find((role) => role.value === value) ?? roles[0];

  return (
    <div className="auth-role">
      <label className="auth-role-label">
        Role
      </label>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="auth-role-trigger"
      >
        <span className="font-medium">{selectedRole.label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "auth-role-icon",
            open && "auth-role-icon-open"
          )}
        />
      </button>

      {open && (
        <div className="auth-role-menu">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => {
                onChange(role.value);
                onOpenChange(false);
              }}
              className={cn(
                "auth-role-option",
                role.value === value && "auth-role-option-active"
              )}
            >
              <p className="auth-role-option-label">{role.label}</p>
              <p className="auth-role-option-description">{role.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
