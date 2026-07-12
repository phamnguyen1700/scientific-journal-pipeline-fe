import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { TopicDetailApiResponse, TopicListApiResponse } from "@/types/topics";

export const getTopicsService = () =>
  get<TopicListApiResponse>(apiEndpoints.topics.list);

export const getTopicDetailService = (id: string) =>
  get<TopicDetailApiResponse>(apiEndpoints.topics.detail(id));

export const topicsService = {
  list: getTopicsService,
  detail: getTopicDetailService,
};