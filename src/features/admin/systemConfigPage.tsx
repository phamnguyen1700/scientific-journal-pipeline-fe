"use client";

import { useState } from "react";
import { Save, Globe, Mail, Shield, Bell, Database, Server } from "lucide-react";
import type { SystemConfig } from "@/types/admin";
import { mockSystemConfig } from "@/features/admin";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  );
}

function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative ml-4 h-5 w-10 shrink-0 rounded-full transition-colors ${
          value ? "bg-primary" : "border border-border bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SystemConfigPage() {
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateGeneral = (
    key: keyof SystemConfig["general"],
    value: SystemConfig["general"][keyof SystemConfig["general"]]
  ) => {
    setConfig((prev) => ({
      ...prev,
      general: { ...prev.general, [key]: value },
    }));
  };

  const updateEmail = (
    key: keyof SystemConfig["email"],
    value: SystemConfig["email"][keyof SystemConfig["email"]]
  ) => {
    setConfig((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }));
  };

  const updateSecurity = (
    key: keyof SystemConfig["security"],
    value: SystemConfig["security"][keyof SystemConfig["security"]]
  ) => {
    setConfig((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: value },
    }));
  };

  const updateNotifications = (
    key: keyof SystemConfig["notifications"],
    value: SystemConfig["notifications"][keyof SystemConfig["notifications"]]
  ) => {
    setConfig((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            System Configuration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Global platform settings, security, and notification configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* General Settings */}
        <Section icon={<Globe size={16} />} title="General Settings">
          <FormField
            label="Application Name"
            value={config.general.appName}
            onChange={(v) => updateGeneral("appName", v)}
          />
          <FormField
            label="Application URL"
            value={config.general.appUrl}
            onChange={(v) => updateGeneral("appUrl", v)}
          />
          <FormField
            label="Max Registered Users"
            type="number"
            value={config.general.maxUsers.toString()}
            onChange={(v) => updateGeneral("maxUsers", parseInt(v))}
            hint="Set to 0 for unlimited"
          />
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Default Language
            </label>
            <select className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
              <option>English (EN)</option>
              <option>Vietnamese (VI)</option>
              <option>French (FR)</option>
            </select>
          </div>
        </Section>

        {/* Email Settings */}
        <Section icon={<Mail size={16} />} title="Email Settings">
          <FormField
            label="SMTP Host"
            value={config.email.smtpHost}
            onChange={(v) => updateEmail("smtpHost", v)}
            placeholder="smtp.example.com"
          />
          <FormField
            label="SMTP Port"
            type="number"
            value={config.email.smtpPort.toString()}
            onChange={(v) => updateEmail("smtpPort", parseInt(v))}
          />
          <FormField
            label="SMTP Username"
            type="email"
            value={config.email.smtpUser}
            onChange={(v) => updateEmail("smtpUser", v)}
          />
          <FormField
            label="SMTP Password"
            type="password"
            value="••••••••••••"
            onChange={() => {}}
          />
          <div className="border-t border-border pt-3 space-y-2">
            <Toggle
              label="Email Alerts"
              desc="Send paper and citation alerts by email"
              value={config.email.emailAlerts}
              onChange={(v) => updateEmail("emailAlerts", v)}
            />
            <Toggle
              label="Weekly Digest"
              desc="Send weekly research summaries"
              value={config.email.weeklyDigest}
              onChange={(v) => updateEmail("weeklyDigest", v)}
            />
          </div>
        </Section>

        {/* Security Settings */}
        <Section icon={<Shield size={16} />} title="Security Settings">
          <div className="space-y-3 divide-y divide-border">
            <Toggle
              label="Two-Factor Authentication"
              desc="Require 2FA for all users"
              value={config.security.twoFactor}
              onChange={(v) => updateSecurity("twoFactor", v)}
            />
            <div className="pt-3">
              <Toggle
                label="IP Whitelist"
                desc="Restrict admin access to specific IPs"
                value={config.security.ipWhitelist}
                onChange={(v) => updateSecurity("ipWhitelist", v)}
              />
            </div>
          </div>
          <FormField
            label="Session Timeout (days)"
            type="number"
            value={config.security.sessionTimeout.toString()}
            onChange={(v) => updateSecurity("sessionTimeout", parseInt(v))}
            hint="Users will be logged out after this period of inactivity"
          />
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Password Policy
            </label>
            <select className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
              <option>Standard (8+ chars, mixed case)</option>
              <option>Strong (12+ chars, symbols required)</option>
              <option>Enterprise (16+ chars, complexity enforced)</option>
            </select>
          </div>
        </Section>

        {/* Notification Settings */}
        <Section icon={<Bell size={16} />} title="Notification Settings">
          <div className="space-y-2 divide-y divide-border">
            <Toggle
              label="Push Notifications"
              desc="Enable browser push notifications"
              value={config.notifications.pushNotifs}
              onChange={(v) => updateNotifications("pushNotifs", v)}
            />
            <div className="pt-2">
              <Toggle
                label="Paper Alerts"
                desc="Notify when new papers match keywords"
                value={config.notifications.paperAlerts}
                onChange={(v) => updateNotifications("paperAlerts", v)}
              />
            </div>
            <div className="pt-2">
              <Toggle
                label="Citation Alerts"
                desc="Notify when saved papers gain citations"
                value={config.notifications.citationAlerts}
                onChange={(v) => updateNotifications("citationAlerts", v)}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Backup & System Info */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={<Database size={16} />} title="Backup & Recovery">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Last Backup</p>
                <p className="text-xs text-muted-foreground">
                  June 16, 2024 at 03:00 UTC
                </p>
              </div>
              <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Success
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Auto-backup Schedule
              </p>
              <select className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary">
                <option>Daily at 03:00 UTC</option>
                <option>Every 12 hours</option>
                <option>Weekly</option>
              </select>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Database size={14} />
              Run Backup Now
            </button>
          </div>
        </Section>

        <Section icon={<Server size={16} />} title="System Info">
          <div className="space-y-2">
            {[
              { label: "Platform Version", value: "v2.4.1" },
              { label: "Database", value: "PostgreSQL 16.2" },
              { label: "Cache", value: "Redis 7.2" },
              { label: "Search Engine", value: "Elasticsearch 8.12" },
              { label: "Uptime", value: "99.97% (30 days)" },
              { label: "Papers Indexed", value: "2,418,924" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium font-mono text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
