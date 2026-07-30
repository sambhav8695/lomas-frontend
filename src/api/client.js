import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const ACCESS_KEY = "lomas_access_token";
const REFRESH_KEY = "lomas_refresh_token";
const USER_KEY = "lomas_user";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession: ({ accessToken, refreshToken, user }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Queue of callbacks waiting on a single in-flight refresh
let isRefreshing = false;
let waiters = [];

function onRefreshed(newAccessToken) {
  waiters.forEach((cb) => cb(newAccessToken));
  waiters = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401 || config._retried || config.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    config._retried = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const auth = data.data;
        tokenStore.setSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken });
        isRefreshing = false;
        onRefreshed(auth.accessToken);
      } catch (refreshError) {
        isRefreshing = false;
        tokenStore.clear();
        waiters = [];
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    return new Promise((resolve) => {
      waiters.push((newAccessToken) => {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(api(config));
      });
    });
  }
);

/** Pulls the friendliest message out of the backend's ErrorResponse envelope. */
export function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.join(" ");
  if (data?.message) return data.message;
  return err?.message || "Something went wrong. Please try again.";
}
