import { apiEndpoints } from "@/config/apiEndpoints";
import { get, post } from "@/service/apiClient";
import type { ILoginRequest, ILoginResponse, LoginResponse } from "@/types/auth";

export const loginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.login, data);

export const adminLoginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.adminLogin, data);

export const getCurrentUserService = () =>
  get<LoginResponse["user"]>(apiEndpoints.auth.me);

export const logoutService = () => post<void>(apiEndpoints.auth.logout);

export const authService = {
  login: loginService,
  adminLogin: adminLoginService,
  me: getCurrentUserService,
  logout: logoutService,
};
