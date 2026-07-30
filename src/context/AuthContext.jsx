import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { tokenStore } from "../api/client";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [requiresBirthDetails, setRequiresBirthDetails] = useState(false);

  const applyAuthResponse = useCallback((auth) => {
    tokenStore.setSession({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: auth.user,
    });
    setUser(auth.user);
    setRequiresBirthDetails(Boolean(auth.requiresBirthDetails));
  }, []);

  const login = useCallback(
    async (email, password, captchaToken) => {
      const auth = await authApi.login({ email, password }, captchaToken);
      applyAuthResponse(auth);
      return auth;
    },
    [applyAuthResponse]
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefresh();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // best-effort — clear local session regardless
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const refreshProfile = useCallback((profile) => {
    tokenStore.setUser(profile);
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      requiresBirthDetails,
      setRequiresBirthDetails,
      login,
      logout,
      applyAuthResponse,
      refreshProfile,
    }),
    [user, requiresBirthDetails, login, logout, applyAuthResponse, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
