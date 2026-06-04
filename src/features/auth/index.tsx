"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Atom, BarChart2, BookOpen } from "lucide-react";

import {
  LoginBrandPanel,
  LoginCard,
  type LoginFeatureItem,
  type LoginRole,
  type LoginRoleOption,
  type LoginStatItem,
} from "@/features/auth/components";
import { env } from "@/config/env";
import { loginService } from "@/service/auth";

const loginRoles: LoginRoleOption[] = [
  {
    value: "student",
    label: "Student / Lecturer",
    description: "Discover papers & track topics",
  },
  {
    value: "researcher",
    label: "Researcher",
    description: "Advanced analytics & trend research",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "System management & configuration",
  },
];

const demoUsers: Record<LoginRole, { name: string; email: string }> = {
  student: { name: "Minh Nguyen", email: "minh.nguyen@university.edu" },
  researcher: { name: "Dr. Lan Tran", email: "l.tran@research.ac.vn" },
  admin: { name: "Admin System", email: "admin@scitrend.io" },
};

const loginFeatures: LoginFeatureItem[] = [
  { icon: <BarChart2 size={14} />, label: "Trend Analytics" },
  { icon: <Atom size={14} />, label: "Topic Clusters" },
  { icon: <BookOpen size={14} />, label: "Journal Tracking" },
];

const loginStats: LoginStatItem[] = [
  { value: "2.4M+", label: "Papers indexed" },
  { value: "48K", label: "Journals tracked" },
  { value: "850K", label: "Researchers" },
];

const roleRedirects: Record<LoginRole, string> = {
  student: "/dashboard",
  researcher: "/dashboard",
  admin: "/admin",
};

export function LoginPage() {
  const router = useRouter();
  const { setRole: setGlobalRole } = useRole();
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginService({
        identifier: email,
        password,
      });
      const accessToken = getAccessToken(response);

      if (!accessToken) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      window.localStorage.setItem(env.authTokenStorageKey, accessToken);

      const refreshToken = getRefreshToken(response);

      if (refreshToken) {
        window.localStorage.setItem("refreshToken", refreshToken);
      }

      router.push(roleRedirects[role]);
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <LoginBrandPanel
        mode="mobile"
        features={loginFeatures}
        stats={loginStats}
      />
      <LoginBrandPanel features={loginFeatures} stats={loginStats} />
      <LoginCard
        roles={loginRoles}
        demoUsers={demoUsers}
        role={role}
        email={email}
        password={password}
        loading={loading}
        error={error}
        roleOpen={roleOpen}
        onRoleChange={setRole}
        onRoleOpenChange={setRoleOpen}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
      <section className="auth-stats-mobile">
        {loginStats.map((stat) => (
          <div key={stat.label}>
            <p className="auth-stat-value">{stat.value}</p>
            <p className="auth-stat-label-mobile">{stat.label}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

function getAccessToken(response: Awaited<ReturnType<typeof loginService>>) {
  const result = response.result ?? response.Result;

  if (typeof result === "string") return result;
  if (typeof result === "object" && result !== null) {
    return (
      result.accessToken ??
      result.AccessToken ??
      result.token ??
      result.Token
    );
  }

  return (
    response.accessToken ??
    response.AccessToken ??
    response.token ??
    response.Token
  );
}

function getRefreshToken(response: Awaited<ReturnType<typeof loginService>>) {
  const result = response.result ?? response.Result;

  if (typeof result === "object" && result !== null) {
    return result.refreshToken ?? result.RefreshToken;
  }

  return (
    response.refreshToken ??
    response.RefreshToken
  );
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return "Unable to sign in. Please check your credentials and try again.";
}

export { loginFeatures, loginRoles, loginStats };
export type { LoginRole };
