import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AdminAuthService } from "@/src/api";

// 标记是否正在刷新 token
let isRefreshing = false;
// 存储待重试的请求
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// 配置全局 axios 拦截器
export function setupAxiosInterceptors() {
  // 响应拦截器：处理 token 过期
  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // 检查是否是 token 过期错误
      if (
        error.response?.status === 401 &&
        error.response?.data &&
        typeof error.response.data === "object" &&
        "code" in error.response.data &&
        (error.response.data.code === "AUTH_TOKEN_EXPIRED" ||
          error.response.data.code === "AUTH_TOKEN_INVALID") &&
        !originalRequest._retry
      ) {
        // 如果正在刷新 token，将请求加入队列
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("admin_refresh_token");

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // 调用刷新 token API
          const response = await AdminAuthService.postApiV1AdminAuthRefresh({
            refreshToken,
          });

          if (
            response &&
            typeof response === "object" &&
            "data" in response &&
            response.data &&
            typeof response.data === "object" &&
            "token" in response.data
          ) {
            const newToken = response.data.token as string;
            const newRefreshToken = (response.data as { refreshToken?: string })
              .refreshToken;

            // 保存新 token
            localStorage.setItem("admin_token", newToken);
            if (newRefreshToken) {
              localStorage.setItem("admin_refresh_token", newRefreshToken);
            }

            // 处理队列中的请求
            processQueue(null, newToken);

            // 重试原请求
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axios(originalRequest);
          } else {
            throw new Error("Invalid refresh token response");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);

          // 刷新失败，清除 token 并跳转到登录页
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_refresh_token");
            localStorage.removeItem("admin_user");
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
