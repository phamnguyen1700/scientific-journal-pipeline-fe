import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";

export const getTopicsService = () =>
  get<unknown>(apiEndpoints.topics.list);

export const getTopicDetailService = (id: string) =>
  get<unknown>(apiEndpoints.topics.detail(id));

export const topicsService = {
  list: getTopicsService,
  detail: getTopicDetailService,
};
