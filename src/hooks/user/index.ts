"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKeys } from "@/hooks/dashboard";
import {
  addUserBookmarkService,
  followJournalService,
  followTopicService,
  getUserBookmarksService,
  getUserFollowingJournalsService,
  getUserFollowingTopicsService,
  getUserProfileService,
  removeUserBookmarkService,
  updateDeviceTokenService,
  updateUserProfileService,
  unfollowJournalService,
  unfollowTopicService,
} from "@/service/user";
import type {
  UpdateDeviceTokenPayload,
  UpdateUserProfilePayload,
  UserApiResponse,
} from "@/types/user";

export const userQueryKeys = {
  all: ["user"] as const,
  profile: () => [...userQueryKeys.all, "profile"] as const,
  bookmarks: () => [...userQueryKeys.all, "bookmarks"] as const,
  followingTopics: () => [...userQueryKeys.all, "following", "topics"] as const,
  followingJournals: () => [...userQueryKeys.all, "following", "journals"] as const,
};

export function useUserProfile() {
  const query = useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: async () => unwrapUserResponse(await getUserProfileService(), "Unable to load user profile."),
  });

  return {
    ...query,
    profile: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useUserBookmarks() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: userQueryKeys.bookmarks(),
    queryFn: async () => unwrapUserResponse(await getUserBookmarksService(), "Unable to load bookmarks."),
  });

  const addBookmark = useMutation({
    mutationFn: addUserBookmarkService,
    onSuccess: () => invalidateBookmarkQueries(queryClient),
  });
  const removeBookmark = useMutation({
    mutationFn: removeUserBookmarkService,
    onSuccess: () => invalidateBookmarkQueries(queryClient),
  });

  return {
    ...query,
    bookmarks: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
    addBookmark: addBookmark.mutate,
    removeBookmark: removeBookmark.mutate,
    saving: addBookmark.isPending || removeBookmark.isPending,
  };
}

export function useUserFollowingTopics() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: userQueryKeys.followingTopics(),
    queryFn: async () => unwrapUserResponse(await getUserFollowingTopicsService(), "Unable to load followed topics."),
  });

  const unfollowTopic = useMutation({
    mutationFn: (id: string | number) => unfollowTopicService(String(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.followingTopics() });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    },
  });
  const followTopic = useMutation({
    mutationFn: (id: string | number) => followTopicService(String(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.followingTopics() });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    },
  });

  return {
    ...query,
    topics: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
    followTopic: followTopic.mutate,
    unfollowTopic: unfollowTopic.mutate,
    saving: followTopic.isPending || unfollowTopic.isPending,
  };
}

export function useUserFollowingJournals() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: userQueryKeys.followingJournals(),
    queryFn: async () =>
      unwrapUserResponse(
        await getUserFollowingJournalsService(),
        "Unable to load followed journals.",
      ),
  });

  const followJournal = useMutation({
    mutationFn: (id: string | number) => followJournalService(String(id)),
    onSuccess: () => invalidateFollowingJournalQueries(queryClient),
  });
  const unfollowJournal = useMutation({
    mutationFn: (id: string | number) => unfollowJournalService(String(id)),
    onSuccess: () => invalidateFollowingJournalQueries(queryClient),
  });

  return {
    ...query,
    journals: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
    followJournal: followJournal.mutate,
    unfollowJournal: unfollowJournal.mutate,
    saving: followJournal.isPending || unfollowJournal.isPending,
  };
}

function invalidateBookmarkQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.bookmarks() });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
}

function invalidateFollowingJournalQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.followingJournals() });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
}

function unwrapUserResponse<T>(response: UserApiResponse<T>, fallbackMessage: string): T {
  if (!response.succeeded || response.result === null) {
    throw new Error(response.errors.join(", ") || fallbackMessage);
  }

  return response.result;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the user service.";
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      updateUserProfileService(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
    },
  });
}

export function useUpdateDeviceToken() {
  return useMutation({
    mutationFn: async (payload: UpdateDeviceTokenPayload) =>
      unwrapUserResponse(
        await updateDeviceTokenService(payload),
        "Unable to update device token.",
      ),
  });
}
