import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, post, put } from "@/service/apiClient";

export const getUserProfileService = () =>
  get<unknown>(apiEndpoints.user.profile);

export const updateUserProfileService = (payload: unknown) =>
  put<unknown>(apiEndpoints.user.profile, payload);

export const getLegacyProfileService = () =>
  get<unknown>(apiEndpoints.user.legacyProfile);

export const getUserBookmarksService = () =>
  get<unknown>(apiEndpoints.user.bookmarks);

export const addUserBookmarkService = (paperId: string) =>
  post<unknown>(apiEndpoints.user.bookmark(paperId));

export const removeUserBookmarkService = (paperId: string) =>
  deleteRequest<unknown>(apiEndpoints.user.bookmark(paperId));

export const getUserFollowingTopicsService = () =>
  get<unknown>(apiEndpoints.user.followingTopics);

export const followTopicService = (topicId: string) =>
  post<unknown>(apiEndpoints.user.followingTopic(topicId));

export const unfollowTopicService = (topicId: string) =>
  deleteRequest<unknown>(apiEndpoints.user.followingTopic(topicId));

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
