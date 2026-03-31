import axios from 'axios';
import { useAuthStore } from '@/src/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle invalid/expired token globally for protected endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const hasToken = Boolean(localStorage.getItem('token'));
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (hasToken && !isAuthRequest) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
