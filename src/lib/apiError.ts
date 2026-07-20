import { AxiosError } from "axios";

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: string[];
  Errors?: string[];
  code?: string;
  details?: unknown;
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

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
) {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (isApiErrorPayload(error)) {
    return (
      error.message ??
      error.error ??
      error.errors?.join(", ") ??
      error.Errors?.join(", ") ??
      fallback
    );
  }

  return fallback;
}

export function createApiError(error: AxiosError) {
  const payload = isApiErrorPayload(error.response?.data)
    ? error.response.data
    : undefined;
  const message =
    payload?.message ??
    payload?.error ??
    payload?.errors?.join(", ") ??
    payload?.Errors?.join(", ") ??
    error.message ??
    "Something went wrong";

  return new ApiError({
    message,
    status: error.response?.status,
    code: payload?.code ?? error.code,
    details: payload?.details,
    originalError: error,
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
