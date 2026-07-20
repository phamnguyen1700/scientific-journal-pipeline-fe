import { apiEndpoints } from "@/config/apiEndpoints";
import { get, post } from "@/service/apiClient";
import type {
  AuthActionResponse,
  AuthUser,
  ILoginRequest,
  ILoginResponse,
  RegisterPayload,
  ResendConfirmationCodePayload,
  VerifyRegistrationPayload,
} from "@/types/auth";

export const loginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.login, data);

export const adminLoginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.adminLogin, data);

export const registerService = (data: RegisterPayload) =>
  post<AuthActionResponse, RegisterPayload>(apiEndpoints.auth.register, data);

export const verifyRegistrationService = (data: VerifyRegistrationPayload) =>
  post<AuthActionResponse, VerifyRegistrationPayload>(
    apiEndpoints.auth.verifyRegistration,
    data,
  );

export const resendConfirmationCodeService = (
  data: ResendConfirmationCodePayload,
) =>
  post<AuthActionResponse, ResendConfirmationCodePayload>(
    apiEndpoints.auth.resendConfirmationCode,
    data,
  );

export const getCurrentUserService = () =>
  get<AuthUser>(apiEndpoints.auth.me);

export const authService = {
  login: loginService,
  adminLogin: adminLoginService,
  register: registerService,
  verifyRegistration: verifyRegistrationService,
  resendConfirmationCode: resendConfirmationCodeService,
  me: getCurrentUserService,
};
