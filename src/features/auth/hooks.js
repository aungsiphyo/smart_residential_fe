import { useCallback } from "react";
import useAuthStore from "./authStore";
import {
  loginStep1,
  loginStep2,
  signup as signupRequest,
  logoutRequest,
} from "./api";

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    authEmail: state.authEmail,
    isAuthenticated: state.isAuthenticated,
    accessToken: state.accessToken,
  }));
}

export function useAuthActions() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const signUp = useCallback(async (payload) => {
    const response = await signupRequest(payload);
    return response.data;
  }, []);

  const loginPassword = useCallback(
    async (payload) => {
      const response = await loginStep1(payload);
      setPendingEmail(payload.email);
      return response.data;
    },
    [setPendingEmail]
  );

  const verifyOtp = useCallback(
    async (payload) => {
      const response = await loginStep2(payload);
      const { accessToken, refreshToken, user } = response.data;
      setAuth({ accessToken, refreshToken, user, email: payload.email });
      return response.data;
    },
    [setAuth]
  );

  const logout = useCallback(
    async (email) => {
      await logoutRequest(email);
      clearAuth();
    },
    [clearAuth]
  );

  return { signUp, loginPassword, verifyOtp, logout, setPendingEmail };
}
