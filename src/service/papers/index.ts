import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type {
  PaperDetailApiResponse,
  PaperListApiResponse,
} from "@/types/papers";

export const getPapersService = () =>
  get<PaperListApiResponse>(apiEndpoints.papers.list);

export const getPaperDetailService = (id: string) =>
  get<PaperDetailApiResponse>(apiEndpoints.papers.detail(id));

export const getPapersByAuthorService = (authorId: string) =>
  get<PaperListApiResponse>(apiEndpoints.papers.byAuthor(authorId));

export const getPapersByJournalService = (journalId: string) =>
  get<PaperListApiResponse>(apiEndpoints.papers.byJournal(journalId));

export const papersService = {
  list: getPapersService,
  detail: getPaperDetailService,
  byAuthor: getPapersByAuthorService,
  byJournal: getPapersByJournalService,
};
