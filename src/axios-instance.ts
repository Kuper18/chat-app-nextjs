import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import { COOKIE_CONFIG } from './config';
import { Tokens } from './enum';
import { removeCookies } from './lib/utils';
import { TTokens } from './types';

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api',
} as const;

const axiosInstance = axios.create(API_CONFIG);

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get(Tokens.ACCESS);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

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
        const refreshToken = Cookies.get(Tokens.REFRESH);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post<Pick<TTokens, 'accessToken'>>(
          `${API_CONFIG.baseURL}/refresh-token`,
          { refreshToken },
        );

        Cookies.set(Tokens.ACCESS, data.accessToken, COOKIE_CONFIG);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

const clearAuthTokens = (): void => {
  removeCookies();
  delete axiosInstance.defaults.headers.common.Authorization;
};

export default axiosInstance;
