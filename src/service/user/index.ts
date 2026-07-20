import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, post, put } from "@/service/apiClient";
import type {
  UserApiResponse,
  UserBookmark,
  UserFollowedTopic,
  UserProfile,
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

export const userService = {
  profile: getUserProfileService,
  updateProfile: updateUserProfileService,
  legacyProfile: getLegacyProfileService,
  bookmarks: getUserBookmarksService,
  addBookmark: addUserBookmarkService,
  removeBookmark: removeUserBookmarkService,
  followingTopics: getUserFollowingTopicsService,
  followTopic: followTopicService,
  unfollowTopic: unfollowTopicService,
};
