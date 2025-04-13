import axios from "axios";
import { completelogout } from "../utils/libs";

const axiosInstance = axios.create({
  baseURL: "https://blog-app-mongodb-completed.onrender.com/api",
  withCredentials: true,
});

// Flag to track token refresh request
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = () => {
  refreshSubscribers.map((callback) => callback());
  refreshSubscribers = [];
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle 401 Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          "https://your-api.com/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        onRefreshed();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        completelogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
