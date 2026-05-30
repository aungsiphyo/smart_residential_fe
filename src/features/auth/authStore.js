import { create } from "zustand";

const rawAuthUser = localStorage.getItem("authUser");
const initialUser = rawAuthUser && rawAuthUser !== "null" ? JSON.parse(rawAuthUser) : null;
const rawAuthEmail = localStorage.getItem("authEmail");
const initialEmail = rawAuthEmail && rawAuthEmail !== "null" ? rawAuthEmail : null;
const initialAccessToken = localStorage.getItem("accessToken");
const initialRefreshToken = localStorage.getItem("refreshToken");

const useAuthStore = create((set) => ({
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  authEmail: initialEmail,
  user: initialUser,
  isAuthenticated: Boolean(initialAccessToken),
  setAuth: ({ accessToken, refreshToken, user, email }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authEmail", email);
    set({
      accessToken,
      refreshToken,
      authEmail: email,
      user,
      isAuthenticated: true,
    });
  },
  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken, isAuthenticated: Boolean(accessToken) });
  },
  setPendingEmail: (email) => {
    localStorage.setItem("authEmail", email);
    set({ authEmail: email });
  },
  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authEmail");
    set({
      accessToken: null,
      refreshToken: null,
      authEmail: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
