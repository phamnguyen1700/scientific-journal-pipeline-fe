import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, post, put } from "@/service/apiClient";
import type {
  UserApiResponse,
  UserBookmark,
  UserFollowedJournal,
  UserFollowedTopic,
  UserProfile,
  UpdateDeviceTokenPayload,
  UpdateUserProfilePayload,
} from "@/types/user";

export const getUserProfileService = () =>
  get<UserApiResponse<UserProfile>>(apiEndpoints.user.profile);

export const updateUserProfileService = (payload: UpdateUserProfilePayload) =>
  put<UserApiResponse<UserProfile>, UpdateUserProfilePayload>(
    apiEndpoints.user.profile,
    payload,
  );

export const getLegacyProfileService = () =>
  get<UserApiResponse<UserProfile>>(apiEndpoints.user.legacyProfile);

export const updateDeviceTokenService = (payload: UpdateDeviceTokenPayload) =>
  post<UserApiResponse<string>, UpdateDeviceTokenPayload>(
    apiEndpoints.user.deviceToken,
    payload,
  );

export const getUserBookmarksService = () =>
  get<UserApiResponse<UserBookmark[]>>(apiEndpoints.user.bookmarks);

export const addUserBookmarkService = (paperId: string) =>
  post<UserApiResponse<UserBookmark>>(apiEndpoints.user.bookmark(paperId));

export const removeUserBookmarkService = (paperId: string) =>
  deleteRequest<UserApiResponse<string>>(apiEndpoints.user.bookmark(paperId));

export const getUserFollowingTopicsService = () =>
  get<UserApiResponse<UserFollowedTopic[]>>(apiEndpoints.user.followingTopics);

export const followTopicService = (topicId: string) =>
  post<UserApiResponse<UserFollowedTopic>>(apiEndpoints.user.followingTopic(topicId));

export const unfollowTopicService = (topicId: string) =>
  deleteRequest<UserApiResponse<string>>(apiEndpoints.user.followingTopic(topicId));

export const getUserFollowingJournalsService = () =>
  get<UserApiResponse<UserFollowedJournal[]>>(apiEndpoints.user.followingJournals);

export const followJournalService = (journalId: string) =>
  post<UserApiResponse<UserFollowedJournal>>(apiEndpoints.user.followingJournal(journalId));

export const unfollowJournalService = (journalId: string) =>
  deleteRequest<UserApiResponse<string>>(apiEndpoints.user.followingJournal(journalId));

export const userService = {
  profile: getUserProfileService,
  updateProfile: updateUserProfileService,
  legacyProfile: getLegacyProfileService,
  updateDeviceToken: updateDeviceTokenService,
  bookmarks: getUserBookmarksService,
  addBookmark: addUserBookmarkService,
  removeBookmark: removeUserBookmarkService,
  followingTopics: getUserFollowingTopicsService,
  followTopic: followTopicService,
  unfollowTopic: unfollowTopicService,
  followingJournals: getUserFollowingJournalsService,
  followJournal: followJournalService,
  unfollowJournal: unfollowJournalService,
};
