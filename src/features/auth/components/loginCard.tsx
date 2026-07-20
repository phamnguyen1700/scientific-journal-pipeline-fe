"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Spinner } from "@/components/common";
import { AuthTextField } from "@/features/auth/components/authTextField";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/ui/input-otp";
import type { RegisterRoleName } from "@/types/auth";

export type AuthPanelMode = "login" | "register" | "otp";

const registerRoles = [
  { label: "Student", value: "Student" },
  { label: "Lecturer", value: "Lecturer" },
  { label: "Researcher", value: "Researcher" },
] satisfies Array<{ label: string; value: RegisterRoleName }>;

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 36 : -36,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
  }),
};

export function LoginCard({
  email,
  loading,
  mode,
  onEmailChange,
  onModeChange,
  onOtpCodeChange,
  onPasswordChange,
  onRegisterConfirmPasswordChange,
  onRegisterEmailChange,
  onRegisterNameChange,
  onRegisterPasswordChange,
  onRegisterPhoneChange,
  onRegisterRoleChange,
  onRegisterSubmit,
  onResendCode,
  onSubmit,
  onVerifySubmit,
  otpCode,
  password,
  registerConfirmPassword,
  registerEmail,
  registerLoading,
  registerName,
  registerPassword,
  registerPhone,
  registerRole,
  resendLoading,
  verifyEmail,
  verifyLoading,
}: {
  email: string;
  loading: boolean;
  mode: AuthPanelMode;
  onEmailChange: (value: string) => void;
  onModeChange: (mode: AuthPanelMode) => void;
  onOtpCodeChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRegisterConfirmPasswordChange: (value: string) => void;
  onRegisterEmailChange: (value: string) => void;
  onRegisterNameChange: (value: string) => void;
  onRegisterPasswordChange: (value: string) => void;
  onRegisterPhoneChange: (value: string) => void;
  onRegisterRoleChange: (value: RegisterRoleName) => void;
  onRegisterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResendCode: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onVerifySubmit: (event: FormEvent<HTMLFormElement>) => void;
  otpCode: string;
  password: string;
  registerConfirmPassword: string;
  registerEmail: string;
  registerLoading: boolean;
  registerName: string;
  registerPassword: string;
  registerPhone: string;
  registerRole: RegisterRoleName;
  resendLoading: boolean;
  verifyEmail: string;
  verifyLoading: boolean;
}) {
  const direction = mode === "login" ? -1 : 1;

  return (
    <section className="auth-panel-shell">
      <div className="auth-panel auth-panel-slider">
        <div className="auth-mode-tabs" aria-label="Authentication mode">
          <button
            type="button"
            className={cn("auth-mode-tab", mode === "login" && "auth-mode-tab-active")}
            onClick={() => onModeChange("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={cn("auth-mode-tab", mode !== "login" && "auth-mode-tab-active")}
            onClick={() => onModeChange("register")}
          >
            Register
          </button>
        </div>

        <AnimatePresence custom={direction} initial={false} mode="wait">
          {mode === "login" ? (
            <AuthSlide key="login" direction={direction}>
              <LoginForm
                email={email}
                loading={loading}
                onEmailChange={onEmailChange}
                onModeChange={onModeChange}
                onPasswordChange={onPasswordChange}
                onSubmit={onSubmit}
                password={password}
              />
            </AuthSlide>
          ) : mode === "register" ? (
            <AuthSlide key="register" direction={direction}>
              <RegisterForm
                loading={registerLoading}
                onConfirmPasswordChange={onRegisterConfirmPasswordChange}
                onEmailChange={onRegisterEmailChange}
                onModeChange={onModeChange}
                onNameChange={onRegisterNameChange}
                onPasswordChange={onRegisterPasswordChange}
                onPhoneChange={onRegisterPhoneChange}
                onRoleChange={onRegisterRoleChange}
                onSubmit={onRegisterSubmit}
                confirmPassword={registerConfirmPassword}
                email={registerEmail}
                name={registerName}
                password={registerPassword}
                phone={registerPhone}
                role={registerRole}
              />
            </AuthSlide>
          ) : (
            <AuthSlide key="otp" direction={direction}>
              <OtpForm
                code={otpCode}
                email={verifyEmail}
                loading={verifyLoading}
                onBack={() => onModeChange("register")}
                onCodeChange={onOtpCodeChange}
                onResendCode={onResendCode}
                onSubmit={onVerifySubmit}
                resendLoading={resendLoading}
              />
            </AuthSlide>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function AuthSlide({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: number;
}) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function LoginForm({
  email,
  loading,
  onEmailChange,
  onModeChange,
  onPasswordChange,
  onSubmit,
  password,
}: {
  email: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onModeChange: (mode: AuthPanelMode) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <AuthHeading
        title="Welcome back"
        description="Sign in to your account to continue"
      />
      <form onSubmit={onSubmit} className="auth-form">
        <AuthTextField
          label="Email or username"
          type="text"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="Your email or username"
          icon={<Mail size={15} />}
          required
        />
        <AuthPasswordField
          label="Password"
          visible={showPassword}
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="********"
          onToggleVisibility={() => setShowPassword((value) => !value)}
          required
          action={
            <a href="#" className="auth-field-link">
              Forgot password?
            </a>
          }
        />
        <AuthSubmitButton loading={loading} loadingText="Signing in...">
          Sign in
        </AuthSubmitButton>
      </form>
      <p className="auth-demo-note">
        New here?{" "}
        <button type="button" onClick={() => onModeChange("register")}>
          Create an account
        </button>
      </p>
    </>
  );
}

function RegisterForm({
  confirmPassword,
  email,
  loading,
  name,
  onConfirmPasswordChange,
  onEmailChange,
  onModeChange,
  onNameChange,
  onPasswordChange,
  onPhoneChange,
  onRoleChange,
  onSubmit,
  password,
  phone,
  role,
}: {
  confirmPassword: string;
  email: string;
  loading: boolean;
  name: string;
  onConfirmPasswordChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onModeChange: (mode: AuthPanelMode) => void;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onRoleChange: (value: RegisterRoleName) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
  phone: string;
  role: RegisterRoleName;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <AuthHeading
        title="Create account"
        description="Register, verify your email, then sign in"
      />
      <form onSubmit={onSubmit} className="auth-form">
        <AuthTextField
          label="Name"
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Your name"
          icon={<UserRound size={15} />}
          required
        />
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          required
        />
        <AuthTextField
          label="Phone number"
          type="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="Phone number"
          icon={<Phone size={15} />}
          inputMode="tel"
          pattern="[0-9]{10,12}"
          required
          title="Enter 10 to 12 digits"
        />
        <div>
          <label className="auth-field-label" htmlFor="register-role">
            Role
          </label>
          <select
            id="register-role"
            className="auth-role-select"
            value={role}
            onChange={(event) =>
              onRoleChange(event.target.value as RegisterRoleName)
            }
          >
            {registerRoles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <AuthPasswordField
          label="Password"
          visible={showPassword}
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Create password"
          onToggleVisibility={() => setShowPassword((value) => !value)}
          required
        />
        <AuthPasswordField
          label="Confirm password"
          visible={showConfirmPassword}
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          invalid={
            Boolean(confirmPassword) && password !== confirmPassword
          }
          placeholder="Confirm password"
          onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
          required
        />
        <AuthSubmitButton loading={loading} loadingText="Creating account...">
          Register
        </AuthSubmitButton>
      </form>
      <p className="auth-demo-note">
        Already registered?{" "}
        <button type="button" onClick={() => onModeChange("login")}>
          Sign in
        </button>
      </p>
    </>
  );
}

function AuthPasswordField({
  action,
  label,
  onChange,
  onToggleVisibility,
  invalid,
  placeholder,
  required,
  value,
  visible,
}: {
  action?: React.ReactNode;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onToggleVisibility: () => void;
  invalid?: boolean;
  placeholder: string;
  required?: boolean;
  value: string;
  visible: boolean;
}) {
  return (
    <div>
      <div className="auth-field-header">
        <label className="auth-field-label">{label}</label>
        {action}
      </div>
      <div className="auth-password-control">
        <InputWithIcon
          icon={<Lock size={15} />}
          inputClassName="auth-field-input auth-password-input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={invalid || undefined}
          pattern={invalid ? "$^" : undefined}
          title={invalid ? "Password confirmation does not match." : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onToggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  );
}

function OtpForm({
  code,
  email,
  loading,
  onBack,
  onCodeChange,
  onResendCode,
  onSubmit,
  resendLoading,
}: {
  code: string;
  email: string;
  loading: boolean;
  onBack: () => void;
  onCodeChange: (value: string) => void;
  onResendCode: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resendLoading: boolean;
}) {
  return (
    <>
      <AuthHeading
        title="Verify email"
        description={`Enter the code sent to ${email || "your email"}`}
      />
      <form onSubmit={onSubmit} className="auth-form">
        <div className="auth-otp-field">
          <label className="auth-field-label">Verification code</label>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={onCodeChange}
            containerClassName="auth-otp-input"
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  className="auth-otp-slot"
                  index={index}
                  key={index}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AuthSubmitButton loading={loading} loadingText="Verifying...">
          Verify account
        </AuthSubmitButton>
      </form>
      <div className="auth-otp-actions">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onResendCode}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending..." : "Resend code"}
        </Button>
      </div>
    </>
  );
}

function AuthHeading({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div>
      <h2 className="auth-panel-title">{title}</h2>
      <p className="auth-panel-description">{description}</p>
    </div>
  );
}

function AuthSubmitButton({
  children,
  loading,
  loadingText,
}: {
  children: React.ReactNode;
  loading: boolean;
  loadingText: string;
}) {
  return (
    <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl">
      {loading ? (
        <>
          <Spinner size="xs" className="text-white" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
