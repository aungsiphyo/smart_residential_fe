import axios from "axios";
import useAuthStore from "../features/auth/authStore";

const baseURL = "http://localhost:5001/api";
const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        window.location.assign("/login");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
