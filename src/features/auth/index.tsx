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
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      router.push(roleRedirects[role]);
    }, 800);
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

export { loginFeatures, loginRoles, loginStats };
export type { LoginRole };
