import type { UserRole } from "@/types/role";

export type LoginPayload = {
  email: string;
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
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export type ILoginResponse = LoginResponse;
