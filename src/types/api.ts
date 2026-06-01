export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type ApiListResponse<T> = {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
};

export type ApiMutationResponse<T = unknown> = {
  data?: T;
  message: string;
  success: boolean;
};
