import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { createApiError } from "@/lib/apiError";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") {
    return config;
  }

  const accessToken = window.localStorage.getItem(env.authTokenStorageKey);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(createApiError(error))
);

export async function unwrapResponse<T>(request: Promise<{ data: T }>) {
  const response = await request;
  return response.data;
}

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return unwrapResponse(apiClient.get<T>(url, config));
}

export function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) {
  return unwrapResponse(apiClient.post<T>(url, data, config));
}

export function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) {
  return unwrapResponse(apiClient.put<T>(url, data, config));
}

export function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) {
  return unwrapResponse(apiClient.patch<T>(url, data, config));
}

export function deleteRequest<T>(url: string, config?: AxiosRequestConfig) {
  return unwrapResponse(apiClient.delete<T>(url, config));
}
