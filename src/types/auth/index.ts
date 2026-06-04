import type { UserRole } from "@/types/role";

export type LoginPayload = {
  identifier: string;
  password: string;
  role?: UserRole;
};

export type ILoginRequest = LoginPayload;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken?: string;
  AccessToken?: string;
  token?: string;
  Token?: string;
  refreshToken?: string;
  RefreshToken?: string;
  user?: AuthUser;
  User?: AuthUser;
};

export type LoginApiResponse = {
  succeeded?: boolean;
  Succeeded?: boolean;
  result?: LoginResponse | string | null;
  Result?: LoginResponse | string | null;
  errors?: string[];
  Errors?: string[];
  accessToken?: string;
  AccessToken?: string;
  token?: string;
  Token?: string;
  refreshToken?: string;
  RefreshToken?: string;
  user?: AuthUser;
  User?: AuthUser;
};

export type ILoginResponse = LoginApiResponse;
