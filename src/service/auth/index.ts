import { apiEndpoints } from "@/config/apiEndpoints";
import { get, post } from "@/service/apiClient";
import type { AuthUser, ILoginRequest, ILoginResponse } from "@/types/auth";

export const loginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.login, data);

export const adminLoginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.adminLogin, data);

export const getCurrentUserService = () =>
  get<AuthUser>(apiEndpoints.auth.me);

export const authService = {
  login: loginService,
  adminLogin: adminLoginService,
  me: getCurrentUserService,
};
