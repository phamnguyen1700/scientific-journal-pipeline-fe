export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api",
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 15000),
  authTokenStorageKey:
    process.env.NEXT_PUBLIC_AUTH_TOKEN_STORAGE_KEY ?? "accessToken",
} as const;
