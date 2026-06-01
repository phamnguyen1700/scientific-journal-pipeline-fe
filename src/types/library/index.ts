export type SavedPaper = {
  id: number;
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
  id: number;
  name: string;
  category: string;
  papers: number;
  growth: number;
  alertOn: boolean;
};

export type FollowedJournal = {
  id: number;
  name: string;
  publisher: string;
  papers: number;
  impactFactor: number;
  alertOn: boolean;
};
