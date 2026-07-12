import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { JournalDetailApiResponse, JournalListApiResponse } from "@/types/journals";

export const getJournalsService = () =>
  get<JournalListApiResponse>(apiEndpoints.journals.list);

export const getJournalDetailService = (id: string) =>
  get<JournalDetailApiResponse>(apiEndpoints.journals.detail(id));

export const journalsService = {
  list: getJournalsService,
  detail: getJournalDetailService,
};