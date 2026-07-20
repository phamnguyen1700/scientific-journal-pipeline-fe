"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Atom, BarChart2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

import {
  LoginBrandPanel,
  LoginCard,
  type AuthPanelMode,
  type LoginFeatureItem,
  type LoginStatItem,
} from "@/features/auth/components";
import {
  useLogin,
  useRegister,
  useResendConfirmationCode,
  useVerifyRegistration,
} from "@/hooks/auth";
import { getApiErrorMessage } from "@/lib/apiError";
import type { RegisterRoleName } from "@/types/auth";
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
  const registerMutation = useRegister();
  const verifyMutation = useVerifyRegistration();
  const resendMutation = useResendConfirmationCode();
  const [mode, setMode] = useState<AuthPanelMode>("login");
  const [otpBackMode, setOtpBackMode] = useState<AuthPanelMode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerRole, setRegisterRole] =
    useState<RegisterRoleName>("Student");
  const [otpCode, setOtpCode] = useState("");

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
        onSuccess: ({ isVerified, user }) => {
          if (!isVerified) {
            const verificationEmail = user.email || emailValue;

            resendMutation.mutate(
              { email: verificationEmail },
              {
                onSuccess: () => {
                  toast.success("Please verify your email before signing in.");
                  setRegisterEmail(verificationEmail);
                  setEmail(verificationEmail);
                  setOtpCode("");
                  setOtpBackMode("login");
                  setMode("otp");
                },
                onError: (error) => {
                  toast.error(
                    getApiErrorMessage(
                      error,
                      "Account is not verified, and we could not resend the code.",
                    ),
                  );
                },
              },
            );
            return;
          }

          toast.success("Signed in successfully.");
          router.push(getDefaultRouteByRole(user.roleName));
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Unable to sign in."));
        },
      }
    );
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const username = registerName.trim();
    const nextEmail = registerEmail.trim();
    const phoneNumber = registerPhone.trim();

    if (!username) {
      toast.error("Name is required.");
      return;
    }

    if (!isValidEmail(nextEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error("Phone number must contain 10 to 12 digits.");
      return;
    }

    if (!registerPassword) {
      toast.error("Password is required.");
      return;
    }

    registerMutation.mutate(
      {
        username,
        email: nextEmail,
        phoneNumber,
        password: registerPassword,
        roleName: registerRole,
      },
      {
        onSuccess: () => {
          toast.success("Registration submitted. Check your email for the code.");
          setEmail(nextEmail);
          setOtpCode("");
          setOtpBackMode("register");
          setMode("otp");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Unable to register."));
        },
      },
    );
  }

  function handleVerifyRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = registerEmail.trim() || email.trim();
    const code = otpCode.trim();

    if (!nextEmail || code.length < 6) {
      toast.error("Please enter the verification code.");
      return;
    }

    verifyMutation.mutate(
      { email: nextEmail, code },
      {
        onSuccess: () => {
          toast.success("Account verified. Please sign in.");
          setMode("login");
          setPassword("");
          setRegisterPassword("");
          setRegisterConfirmPassword("");
          setOtpCode("");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Unable to verify registration."));
        },
      },
    );
  }

  function handleResendCode() {
    const nextEmail = registerEmail.trim() || email.trim();

    if (!nextEmail) {
      toast.error("Email is required to resend the code.");
      return;
    }

    resendMutation.mutate(
      { email: nextEmail },
      {
        onSuccess: () => {
          toast.success("A new verification code has been sent.");
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Unable to resend code."));
        },
      },
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
        mode={mode}
        otpCode={otpCode}
        otpBackMode={otpBackMode}
        registerConfirmPassword={registerConfirmPassword}
        registerEmail={registerEmail}
        registerName={registerName}
        registerPassword={registerPassword}
        registerPhone={registerPhone}
        registerRole={registerRole}
        registerLoading={registerMutation.isPending}
        resendLoading={resendMutation.isPending}
        verifyEmail={registerEmail.trim() || email.trim()}
        verifyLoading={verifyMutation.isPending}
        onEmailChange={setEmail}
        onModeChange={setMode}
        onOtpCodeChange={setOtpCode}
        onPasswordChange={setPassword}
        onRegisterConfirmPasswordChange={setRegisterConfirmPassword}
        onRegisterEmailChange={setRegisterEmail}
        onRegisterNameChange={setRegisterName}
        onRegisterPasswordChange={setRegisterPassword}
        onRegisterPhoneChange={setRegisterPhone}
        onRegisterRoleChange={setRegisterRole}
        onRegisterSubmit={handleRegister}
        onResendCode={handleResendCode}
        onSubmit={handleLogin}
        onVerifySubmit={handleVerifyRegistration}
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhoneNumber(value: string) {
  return /^\d{10,12}$/.test(value);
}
