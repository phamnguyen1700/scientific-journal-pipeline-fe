export type UserApiResponse<T> = {
  succeeded: boolean;
  result: T | null;
  errors: string[];
};

export type UserProfile = {
  userId?: string;
  username?: string;
  email?: string;
  phonenumber?: string;
  roleName?: string;
  isActive?: boolean;
  createdAt?: string;
};

export type UpdateUserProfilePayload = {
  username: string;
  email: string;
  phonenumber: string;
  oldPassword?: string;
  newPassword?: string;
};

export type UpdateDeviceTokenPayload = {
  deviceToken: string;
};

export type UserBookmark = {
  bookmarkId: string;
  userId: string;
  paperId: string;
  createdAt: string;
  paper: UserBookmarkPaper | null;
};

export type UserBookmarkPaper = {
  paperId: string;
  doi?: string | null;
  title: string;
  abstract?: string | null;
  publicationYear?: number | null;
  createdAt?: string | null;
  paperAuthors?: Array<{
    authorId?: string;
    name?: string;
    authorName?: string;
    rawAuthorName?: string;
    authorOrder?: number;
    author?: {
      authorId?: string;
      displayName?: string;
      fullName?: string | null;
    } | null;
  }>;
  paperTopics?: Array<{
    topicId?: string;
    topicName?: string;
    topic?: {
      topicId?: string;
      topicName?: string;
      normalizedName?: string;
    } | null;
  }>;
  paperKeywords?: Array<{
    keywordId?: string;
    keywordName?: string;
    keyword?: {
      keywordId?: string;
      keywordName?: string;
      normalizedName?: string;
    } | null;
  }>;
};

export type UserFollowedTopic = {
  followId: string;
  topicId: string;
  topicName: string;
  category?: string;
  paperCount?: number;
  growthPercentage?: number;
  alertOn?: boolean;
};

export type UserFollowedJournal = {
  followId: string;
  userId: string;
  journalId: string;
  createdAt: string;
  journalName: string;
  normalizedName?: string | null;
};
