"use client";

import { useEffect } from "react";
import { configureApiClient } from "@/lib/api-config";

/**
 * API 初始化组件
 * 用于在应用启动时配置 API 客户端和拦截器
 */
export default function ApiInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 配置 API 客户端
    configureApiClient();

    // 配置全局 axios 拦截器已经在 axios-instance.ts 中完成
  }, []);

  return <>{children}</>;
}
