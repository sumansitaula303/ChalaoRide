
import { api_url } from '@/config/config';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from "expo-secure-store";

interface CustomAxiosInstance {
  defaults: any;
  isAxiosError?: any;
  interceptors: any;
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
}

const axiosInstance: CustomAxiosInstance = axios.create({
  baseURL: api_url,
});

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common.Accept = 'application/json';
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refjwt');
        const response = await axios.post(`${api_url}/api/auth/token/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        await SecureStore.setItemAsync('jwt', access);
        
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = 'Bearer ' + access;
        }
        
        processQueue(null, access);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;