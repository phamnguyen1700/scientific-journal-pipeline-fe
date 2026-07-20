import type { UserRole } from "@/types/role";

export type LoginPayload = {
  email: string;
  password: string;
};

export type ILoginRequest = LoginPayload;

export type RegisterRoleName = "Student" | "Lecturer" | "Researcher";

export type RegisterPayload = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleName: RegisterRoleName;
};

export type VerifyRegistrationPayload = {
  email: string;
  code: string;
};

export type ResendConfirmationCodePayload = {
  email: string;
};

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  phonenumber?: string;
  roleName: UserRole;
};

export type LoginResult = {
  userId: string;
  username: string;
  email: string;
  phonenumber?: string;
  roleName: UserRole;
  token: string;
};

export type BackendResponse<T> = {
  succeeded?: boolean;
  result?: T | null;
  errors?: string[];
  Succeeded?: boolean;
  Result?: T | null;
  Errors?: string[];
};

export type LoginResponse = BackendResponse<LoginResult>;

export type ILoginResponse = LoginResponse;

export type AuthActionResponse = BackendResponse<unknown>;

export function normalizeBackendResponse<T>(response: BackendResponse<T>) {
  return {
    succeeded: response.succeeded ?? response.Succeeded ?? false,
    result: response.result ?? response.Result ?? null,
    errors: response.errors ?? response.Errors ?? [],
  };
}

export function mapLoginResultToUser(result: LoginResult): AuthUser {
  return {
    id: result.userId,
    username: result.username,
    name: result.username,
    email: result.email,
    phonenumber: result.phonenumber,
    roleName: result.roleName,
  };
}
