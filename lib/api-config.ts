import { OpenAPI } from "@/src/api";
import { setupAxiosInterceptors } from "./axios-instance";

// 配置 OpenAPI 客户端
export function configureApiClient() {
  // 设置基础 URL
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  // 设置 Token 解析器
  OpenAPI.TOKEN = async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      return token || "";
    }
    return "";
  };

  // 设置请求拦截器
  OpenAPI.HEADERS = async () => {
    return {
      "Content-Type": "application/json",
    };
  };

  // 配置 axios 拦截器（token 自动刷新）
  setupAxiosInterceptors();
}

// 在应用启动时配置
if (typeof window !== "undefined") {
  configureApiClient();
}
