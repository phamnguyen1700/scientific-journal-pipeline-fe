import { AxiosError } from "axios";

export type ApiErrorPayload = {
  message?: string;
  Message?: string;
  error?: string;
  Error?: string;
  errors?: string[];
  Errors?: string[];
  code?: string;
  Code?: string;
  details?: unknown;
  Details?: unknown;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  originalError: unknown;

  constructor({
    message,
    status,
    code,
    details,
    originalError,
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    originalError: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.originalError = originalError;
  }
}

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  return typeof payload === "object" && payload !== null;
}

export function createApiError(error: AxiosError) {
  const payload = isApiErrorPayload(error.response?.data)
    ? error.response.data
    : undefined;
  const message =
    payload?.message ??
    payload?.Message ??
    payload?.error ??
    payload?.Error ??
    payload?.errors?.join(", ") ??
    payload?.Errors?.join(", ") ??
    error.message ??
    "Something went wrong";

  return new ApiError({
    message,
    status: error.response?.status,
    code: payload?.code ?? payload?.Code ?? error.code,
    details: payload?.details ?? payload?.Details,
    originalError: error,
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
