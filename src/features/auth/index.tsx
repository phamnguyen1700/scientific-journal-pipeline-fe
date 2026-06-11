"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Atom, BarChart2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

import {
  LoginBrandPanel,
  LoginCard,
  type LoginFeatureItem,
  type LoginStatItem,
} from "@/features/auth/components";
import { useLogin } from "@/hooks/auth";
import { getApiErrorMessage } from "@/service/apiError";
import { getDefaultRouteByRole } from "@/types/role";

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

export function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailValue = email.trim();

    if (!emailValue || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    loginMutation.mutate(
      { email: emailValue, password },
      {
        onSuccess: ({ user }) => {
          toast.success("Signed in successfully.");
          router.push(getDefaultRouteByRole(user.roleName));
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Unable to sign in."));
        },
      }
    );
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
        email={email}
        password={password}
        loading={loginMutation.isPending}
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

export { loginFeatures, loginStats };
