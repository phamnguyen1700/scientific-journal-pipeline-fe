"use client";

import toast from "react-hot-toast";

import {
  ProfileForm,
  type ProfileFormValues,
} from "@/features/profile/components";
import { useUpdateUserProfile, useUserProfile } from "@/hooks/user";
import { getApiErrorMessage } from "@/lib/apiError";
import { Drawer, DrawerContent } from "@/shared/ui/drawer";
import { useAuthStore } from "@/store/auth";
import type { UpdateUserProfilePayload } from "@/types/user";

export function ProfileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const profileQuery = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const updateAuthUser = useAuthStore((state) => state.updateUser);

  function submitProfile(values: ProfileFormValues) {
    const payload = toUpdatePayload(values, profileQuery.profile?.email);
    if (!payload) return;

    updateProfile.mutate(payload, {
      onSuccess: (response) => {
        if (!response.succeeded || !response.result) {
          toast.error(
            response.errors.join(", ") || "Unable to update profile.",
          );
          return;
        }

        updateAuthUser({
          username: response.result.username ?? payload.username,
          name: response.result.username ?? payload.username,
          email: response.result.email ?? payload.email,
          phonenumber: response.result.phonenumber ?? payload.phonenumber,
        });
        toast.success("Profile updated successfully.");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Unable to update profile."));
      },
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent showCloseButton>
        <div className="author-drawer-body">
          <ProfileForm
            error={profileQuery.error}
            key={getProfileFormKey(profileQuery.profile)}
            loading={profileQuery.loading}
            onSubmit={submitProfile}
            profile={profileQuery.profile}
            saving={updateProfile.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function getProfileFormKey(
  profile: ReturnType<typeof useUserProfile>["profile"],
) {
  return [
    profile?.userId,
    profile?.username,
    profile?.email,
    profile?.phonenumber,
  ].join(":");
}

function toUpdatePayload(
  values: ProfileFormValues,
  currentEmail: string | undefined,
): UpdateUserProfilePayload | null {
  const username = values.username.trim();
  const email = currentEmail?.trim();
  const phonenumber = values.phonenumber.trim();
  const oldPassword = values.oldPassword?.trim();
  const newPassword = values.newPassword?.trim();
  const confirmPassword = values.confirmPassword?.trim();

  if (!username) {
    toast.error("Name is required.");
    return null;
  }

  if (!email) {
    toast.error("Current email is unavailable.");
    return null;
  }

  if (newPassword || oldPassword || confirmPassword) {
    if (!oldPassword || !newPassword) {
      toast.error("Old password and new password are required.");
      return null;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password confirmation does not match.");
      return null;
    }
  }

  return {
    username,
    email,
    phonenumber,
    oldPassword: oldPassword || undefined,
    newPassword: newPassword || undefined,
  };
}
