"use client";

import { Lock, Mail } from "lucide-react";
import type { FormEvent } from "react";

import { Spinner } from "@/components/common";
import { Button } from "@/shared/ui/button";
import { AuthTextField } from "@/features/auth/components/authTextField";
import {
  RoleSelector,
  type LoginRole,
  type LoginRoleOption,
} from "@/features/auth/components/roleSelector";

type DemoUser = {
  name: string;
  email: string;
};

export function LoginCard({
  roles,
  demoUsers,
  role,
  email,
  password,
  loading,
  error,
  roleOpen,
  onRoleChange,
  onRoleOpenChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  roles: LoginRoleOption[];
  demoUsers: Record<LoginRole, DemoUser>;
  role: LoginRole;
  email: string;
  password: string;
  loading: boolean;
  error?: string | null;
  roleOpen: boolean;
  onRoleChange: (role: LoginRole) => void;
  onRoleOpenChange: (open: boolean) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="auth-panel-shell">
      <div className="auth-panel">
        <div>
          <h2 className="auth-panel-title">
            Welcome back
          </h2>
          <p className="auth-panel-description">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <RoleSelector
            roles={roles}
            value={role}
            open={roleOpen}
            onOpenChange={onRoleOpenChange}
            onChange={onRoleChange}
          />

          <AuthTextField
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={demoUsers[role].email}
            icon={<Mail size={15} />}
          />

          <AuthTextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="********"
            icon={<Lock size={15} />}
            action={
              <a href="#" className="auth-field-link">
                Forgot password?
              </a>
            }
          />

          <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl">
            {loading ? (
              <>
                <Spinner size="xs" className="text-white" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {error && <p className="auth-error-message">{error}</p>}
        </form>

        <p className="auth-demo-note">
          Use your registered account credentials to sign in.
        </p>
      </div>
    </section>
  );
}
