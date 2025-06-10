import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const api = axios.create({
  baseURL: "http://192.168.0.105:3000",
});

// Request interceptor: add access token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await axios.post(
          "http://192.168.0.105:3000/auth/refresh",
          { refreshToken: refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        await AsyncStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry the original request
      } catch (err) {
        await AsyncStorage.multiRemove([
          "accessToken",
          "refreshToken",
          "userData",
        ]);
        router.replace("/landing");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
