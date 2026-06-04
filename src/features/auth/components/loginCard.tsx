"use client";

import { Lock, Mail } from "lucide-react";
import type { FormEvent } from "react";

import { Spinner } from "@/components/common";
import { Button } from "@/shared/ui/button";
import { AuthTextField } from "@/features/auth/components/authTextField";

export function LoginCard({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="auth-panel-shell">
      <div className="auth-panel">
        <div>
          <h2 className="auth-panel-title">Welcome back</h2>
          <p className="auth-panel-description">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <AuthTextField
            label="Email or username"
            type="text"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="Your email or username"
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

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-xl"
          >
            {loading ? (
              <>
                <Spinner size="xs" className="text-white" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="auth-demo-note">
          Use your registered account credentials to access the platform
        </p>
      </div>
    </section>
  );
}
