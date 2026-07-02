import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";

export const getJournalsService = () =>
  get<unknown>(apiEndpoints.journals.list);

export const getJournalDetailService = (id: string) =>
  get<unknown>(apiEndpoints.journals.detail(id));

export const journalsService = {
  list: getJournalsService,
  detail: getJournalDetailService,
};
