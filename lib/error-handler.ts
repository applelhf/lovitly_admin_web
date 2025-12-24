import { ApiError } from "@/src/api";

/**
 * 从 API 错误中提取错误消息
 * @param error - 捕获的错误对象
 * @param defaultMessage - 默认错误消息
 * @returns 用户友好的错误消息
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "操作失败"
): string {
  // 如果是 ApiError（Swagger 生成的客户端抛出的错误）
  if (error instanceof ApiError) {
    // 尝试从 body 中获取 message
    if (
      error.body &&
      typeof error.body === "object" &&
      "message" in error.body
    ) {
      return error.body.message as string;
    }
    // 如果没有 message，返回错误本身的 message
    return error.message || defaultMessage;
  }

  // 如果是普通 Error
  if (error instanceof Error) {
    return error.message;
  }

  // 其他情况返回默认消息
  return defaultMessage;
}
