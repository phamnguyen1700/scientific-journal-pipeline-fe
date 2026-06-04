function requireEnv(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  apiBaseUrl: requireEnv(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "NEXT_PUBLIC_API_BASE_URL"
  ),
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 15000),
  authTokenStorageKey:
    process.env.NEXT_PUBLIC_AUTH_TOKEN_STORAGE_KEY ?? "accessToken",
} as const;
