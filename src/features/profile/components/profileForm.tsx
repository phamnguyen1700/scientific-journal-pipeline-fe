"use client";

import { Eye, EyeOff, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { UserAvatar } from "@/components/common";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { UserProfile } from "@/types/user";

export type ProfileFormValues = {
  confirmPassword?: string;
  newPassword?: string;
  oldPassword?: string;
  phonenumber: string;
  username: string;
};

export function ProfileForm({
  error,
  loading,
  onSubmit,
  profile,
  saving,
}: {
  error: string | null;
  loading: boolean;
  onSubmit: (values: ProfileFormValues) => void;
  profile: UserProfile | null;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProfileFormValues>({
    username: profile?.username ?? "",
    phonenumber: profile?.phonenumber ?? "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visiblePasswords, setVisiblePasswords] = useState({
    confirmPassword: false,
    newPassword: false,
    oldPassword: false,
  });

  const displayName = form.username || profile?.username || "User profile";
  const statusLabel = profile?.isActive === false ? "Inactive" : "Active";
  const joinedAt = useMemo(
    () => formatProfileDate(profile?.createdAt),
    [profile?.createdAt],
  );
  const hasChanges = useMemo(
    () =>
      form.username.trim() !== (profile?.username ?? "") ||
      form.phonenumber.trim() !== (profile?.phonenumber ?? "") ||
      Boolean(
        form.oldPassword?.trim() ||
        form.newPassword?.trim() ||
        form.confirmPassword?.trim(),
      ),
    [
      form.confirmPassword,
      form.newPassword,
      form.oldPassword,
      form.phonenumber,
      form.username,
      profile?.phonenumber,
      profile?.username,
    ],
  );

  function updateField(field: keyof ProfileFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function togglePasswordVisibility(field: keyof typeof visiblePasswords) {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  return (
    <form
      className="profile-drawer-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!hasChanges) return;
        onSubmit(form);
      }}
    >
      <section className="profile-drawer-hero">
        <UserAvatar name={displayName} size="xl" />
        <div className="min-w-0">
          <span className="profile-drawer-eyebrow">
            {profile?.roleName ?? "Account"}
          </span>
          <h2>{displayName}</h2>
          <p>{profile?.email ?? "No email available"}</p>
        </div>
      </section>

      {loading ? (
        <div className="paper-search-empty">Loading profile...</div>
      ) : error ? (
        <div className="paper-search-empty">{error}</div>
      ) : null}

      <section className="profile-drawer-grid">
        <ProfileInfoCard
          icon={<ShieldCheck />}
          label="Status"
          value={statusLabel}
        />
        <ProfileInfoCard
          icon={<Mail />}
          label="Email"
          value={profile?.email ?? "N/A"}
        />
        <ProfileInfoCard icon={<UserRound />} label="Joined" value={joinedAt} />
      </section>

      <div className="profile-drawer-edit-grid">
        <section className="profile-drawer-section">
          <div>
            <h3>Profile</h3>
          </div>
          <div className="profile-drawer-fields">
            <ProfileField label="Name">
              <Input
                value={form.username}
                onChange={(event) =>
                  updateField("username", event.target.value)
                }
                placeholder="Your name"
                required
              />
            </ProfileField>

            <ProfileField label="Phone number">
              <Input
                value={form.phonenumber}
                onChange={(event) =>
                  updateField("phonenumber", event.target.value)
                }
                placeholder="Phone number"
              />
            </ProfileField>
          </div>
        </section>

        <section className="profile-drawer-section">
          <div className="profile-drawer-fields">
            <ProfileField label="Old password">
              <PasswordInput
                visible={visiblePasswords.oldPassword}
                value={form.oldPassword}
                onChange={(event) =>
                  updateField("oldPassword", event.target.value)
                }
                onToggleVisibility={() =>
                  togglePasswordVisibility("oldPassword")
                }
                placeholder="Current password"
                autoComplete="current-password"
              />
            </ProfileField>
            <ProfileField label="New password">
              <PasswordInput
                visible={visiblePasswords.newPassword}
                value={form.newPassword}
                onChange={(event) =>
                  updateField("newPassword", event.target.value)
                }
                onToggleVisibility={() =>
                  togglePasswordVisibility("newPassword")
                }
                placeholder="New password"
                autoComplete="new-password"
              />
            </ProfileField>
            <ProfileField label="Confirm new password">
              <PasswordInput
                visible={visiblePasswords.confirmPassword}
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                onToggleVisibility={() =>
                  togglePasswordVisibility("confirmPassword")
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </ProfileField>
          </div>
        </section>
      </div>

      <div className="profile-drawer-actions">
        <Button type="submit" disabled={saving || loading || !hasChanges}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function PasswordInput({
  autoComplete,
  onChange,
  onToggleVisibility,
  placeholder,
  value,
  visible,
}: {
  autoComplete: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onToggleVisibility: () => void;
  placeholder: string;
  value: string | undefined;
  visible: boolean;
}) {
  return (
    <div className="profile-drawer-password-input">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
  );
}

function ProfileField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="profile-drawer-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ProfileInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="profile-drawer-info-card">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function formatProfileDate(value: string | undefined) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
