import API from "../../services/axios";

export const signup = (payload) => API.post("/auth/signup", payload);
export const loginStep1 = (payload) => API.post("/auth/login/step1", payload);
export const loginStep2 = (payload) => API.post("/auth/login/step2", payload);
export const refreshTokenRequest = (refreshToken) =>
  API.post("/auth/refresh-token", { refreshToken });
export const logoutRequest = (email) => API.post("/auth/logout", { email });
