export type Journal = {
  id: string | number;
  apiId?: string;
  name: string;
  issnL: string | null;
  publisher: string | null;
  homepageUrl: string | null;
  papers: number;
  citations: number;
  impactFactor: number | null;
  openAccess: boolean | null;
  core: boolean | null;
};
