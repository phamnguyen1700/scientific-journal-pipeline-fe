export type SavedPaper = {
  id: string | number;
  apiId?: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  savedAt: string;
  abstract: string;
  tags: string[];
};

export type FollowingTab = "topics" | "journals";

export type FollowedTopic = {
  id: string | number;
  apiId?: string;
  name: string;
  category: string;
  papers: number;
  growth: number;
  alertOn: boolean;
};

export type FollowedJournal = {
  id: string | number;
  apiId?: string;
  name: string;
  publisher: string;
  papers?: number;
  impactFactor?: number;
  followedAt?: string;
  alertOn: boolean;
};
