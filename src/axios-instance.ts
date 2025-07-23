import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true, // Always send cookies
} as const;

const axiosInstance = axios.create(API_CONFIG);

// Remove Authorization header logic entirely - rely only on cookies
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No Authorization header needed - cookies handle auth
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh endpoint will read refresh token from httpOnly cookies
        await axios.post(
          `${API_CONFIG.baseURL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        // Retry original request - new access token cookie will be sent automatically
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
