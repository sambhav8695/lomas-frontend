import { api } from "./client";

function captchaConfig(captchaToken) {
  return captchaToken && captchaToken !== "captcha-not-configured"
    ? { headers: { "X-Captcha-Token": captchaToken } }
    : {};
}

export const authApi = {
  register: (payload, captchaToken) =>
    api.post("/auth/register", payload, captchaConfig(captchaToken)).then((r) => r.data.data),
  verifyEmail: (payload) => api.post("/auth/otp/verify", payload).then((r) => r.data.data),
  resendOtp: (payload, captchaToken) =>
    api.post("/auth/otp/resend", payload, captchaConfig(captchaToken)).then((r) => r.data.data),
  login: (payload, captchaToken) =>
    api.post("/auth/login", payload, captchaConfig(captchaToken)).then((r) => r.data.data),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }).then((r) => r.data.data),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }).then((r) => r.data.data),
  forgotPassword: (payload, captchaToken) =>
    api.post("/auth/forgot-password", payload, captchaConfig(captchaToken)).then((r) => r.data.data),
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then((r) => r.data.data),
};

export const oauth2Api = {
  completeBirthDetails: (payload) =>
    api.post("/oauth2/complete-birth-details", payload).then((r) => r.data.data),
};

/** Kicks off the Spring Security OAuth2 login redirect for a given provider ("google" | "microsoft"). */
export function startOAuth2Login(provider) {
  const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1").replace(/\/api\/v1\/?$/, "");
  window.location.assign(`${base}/oauth2/authorization/${provider}`);
}
